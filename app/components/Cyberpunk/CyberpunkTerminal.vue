<template>
  <CyberpunkTerminalWindow
    class="cyberpunk-terminal font-mono h-full overflow-hidden rounded-md border-2 border-primary/70 text-sm"
    :show-icon="false"
    body-class="overflow-y-auto xl:max-h-[530px] lg:max-h-[610px] md:max-h-[700px] max-h-[520px]"
  >
    <template #title>
      kwikkill@hyperion:~
    </template>

    <template #body>
      <!-- Clicking anywhere skips the intro and focuses the prompt -->
      <div ref="terminalContentRef" @click="onTerminalClick">
        <div v-for="(line, index) in displayedLines" :key="index" class="mb-1 break-words">
          <template v-if="line.type === 'command'">
            <span class="text-secondary">kwikkill@hyperion:~$</span>
            <span class="ml-2 text-primary">
              {{ line.displayText ?? line.text }}
            </span>
          </template>
          <!-- Plain `ls`: file names in columns as wide as the longest one -->
          <div
            v-else-if="line.files"
            class="grid gap-x-[2ch]"
            :style="{ gridTemplateColumns: `repeat(auto-fill, minmax(${longestName(line.files)}ch, 1fr))` }"
          >
            <button
              v-for="(file, fileIndex) in line.files"
              :key="file"
              type="button"
              class="truncate text-left text-terminal transition-colors hover:text-terminal-hover"
              :title="file"
              @click="openProject(file)"
            >
              {{ line.displayFiles?.[fileIndex] ?? file }}
            </button>
          </div>
          <template v-else-if="line.type === 'response'">
            <span v-if="line.inline" class="mr-2 text-red-500">
              >>
            </span>
            <button
              v-if="line.link"
              type="button"
              class="cursor-pointer text-left text-terminal transition-colors hover:text-terminal-hover"
              @click="handleLinkClick(line.link)"
            >
              {{ line.displayText ?? line.text }}
            </button>
            <span v-else class="text-terminal">
              {{ line.displayText ?? line.text }}
            </span>
          </template>
          <span v-else-if="line.type === 'error'" class="text-red-400">
            {{ line.displayText ?? line.text }}
          </span>
        </div>

        <form class="mt-2 flex items-center" @submit.prevent="submitCommand">
          <label for="terminal-input" class="shrink-0 text-secondary">kwikkill@hyperion:~$</label>
          <input
            id="terminal-input"
            ref="inputRef"
            v-model="command"
            type="text"
            class="ml-2 min-w-0 flex-1 border-none bg-transparent p-0 text-primary caret-primary outline-none"
            placeholder="help"
            autocomplete="off"
            autocapitalize="off"
            spellcheck="false"
            :aria-label="isEnglish ? 'Terminal command' : 'Commande du terminal'"
            @keydown="onInputKeydown"
          />
        </form>

        <!-- Lets touch users run commands without typing -->
        <div class="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span class="text-gray-500">{{ isEnglish ? 'Try:' : 'Essayer :' }}</span>
          <button
            v-for="suggestion in suggestions"
            :key="suggestion"
            type="button"
            class="border border-primary/40 bg-primary/10 px-2 py-1 text-primary transition-colors hover:bg-primary/20"
            @click="runCommand(suggestion)"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>
    </template>
  </CyberpunkTerminalWindow>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import {
  computed, nextTick, onBeforeUnmount, onMounted, ref,
} from 'vue';

import type { Command } from '../../models/command';
import { usePreferencesStore } from '../../stores/preferences';
import { useProjectsStore } from '../../stores/projects';
import { CV_URL } from '../../utils/links';
import CyberpunkTerminalWindow from './CyberpunkTerminalWindow.vue';

type TerminalLine = Command & {
  // What is shown while the line is being typed, decoded or glitched.
  displayText?: string;
  // Project files listed by a plain `ls`, and their decoding state.
  files?: string[];
  displayFiles?: string[];
};

interface TerminalCommand {
  usage?: () => string;
  // Commands without a description are easter eggs, left out of `help`.
  description?: () => string;
  run: (args: string[]) => void;
}

const preferencesStore = usePreferencesStore();
const isEnglish = computed(() => preferencesStore.isEnglish);

const projectsStore = useProjectsStore();
const projects = computed(() => projectsStore.getLocalizedProjects);
const skills = computed(() => projectsStore.getLocalizedSkills);

const { selectedProject } = storeToRefs(projectsStore);

type Project = (typeof projects.value)[number];

const terminalContentRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const displayedLines = ref<TerminalLine[]>([]);
const command = ref('');
const introRunning = ref(false);

const history: string[] = [];
let historyIndex = 0;
// Bumped to cancel the intro that is playing (skip, unmount).
let introRun = 0;
let prefersReducedMotion = false;

// Characters to use for decoding and glitching
const RANDOM_CHARS = '0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/';
const THEMES: Record<string, 'default' | 'ghost' | 'matrix' | 'solarpunk'> = {
  cyberpunk: 'default',
  ghost: 'ghost',
  matrix: 'matrix',
  solarpunk: 'solarpunk',
};

const t = (fr: string, en: string) => (isEnglish.value ? en : fr);
const sleep = (ms: number) => new Promise((resolve) => { setTimeout(resolve, ms); });
const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomChar = () => RANDOM_CHARS.charAt(Math.floor(Math.random() * RANDOM_CHARS.length));
const fileStem = (file: string) => file.replace(/\.[^.]+$/, '');

const longestName = (files: string[]) => Math.max(...files.map((file) => file.length));

const suggestions = computed(() => [
  'help',
  'ls',
  `open ${fileStem(projects.value[0]?.localizedFile ?? 'polis')}`,
  'theme matrix',
  'sudo rm -rf /',
]);

function scrollToBottom() {
  nextTick(() => {
    const body = terminalContentRef.value?.parentElement;
    if (body) {
      body.scrollTop = body.scrollHeight;
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Error scrolling to bottom:', error);
  });
}

// Returns the reactive copy, so later edits (typing, glitches) re-render.
function pushLine(line: TerminalLine) {
  displayedLines.value.push(line);
  scrollToBottom();
  return displayedLines.value[displayedLines.value.length - 1];
}

const print = (text: string, extra: Partial<Command> = {}) => pushLine({ type: 'response', text, ...extra });
const printError = (text: string) => pushLine({ type: 'error', text });

// Plain `ls` output, in the order of the projects store.
function filesLine(): TerminalLine {
  return { type: 'response', text: '', files: projects.value.map((project) => project.localizedFile) };
}

// `ls -l` style entry; the "size" is the length of the description.
function fileLine(project: Project): TerminalLine {
  const size = project.localizedDescription.length.toString().padStart(4, ' ');
  return {
    type: 'response',
    text: `-rwxr-xr-x 23 gabriel gabriel ${size} ${project.localizedFile}`,
    link: `#project-${project.localizedFile}`,
  };
}

function openProject(file: string) {
  if (preferencesStore.isAnyFullScreen) {
    printError(t('Quittez le plein écran pour ouvrir la fiche.', 'Exit full screen to open the project.'));
    return;
  }
  const project = projects.value.find((item) => item.localizedFile === file);
  if (!project) return;

  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  selectedProject.value = project;
}

function handleLinkClick(link: string) {
  if (link.startsWith('#project-')) {
    openProject(link.replace('#project-', ''));
  } else if (link.startsWith('mailto:')) {
    window.location.href = link;
  } else {
    window.open(link, '_blank', 'noopener');
  }
}

function findProject(query: string) {
  return projects.value.find((project) => fileStem(project.localizedFile) === query)
    ?? projects.value.find((project) => project.localizedFile.startsWith(query))
    ?? projects.value.find((project) => project.localizedName.toLowerCase().includes(query));
}

function requestSelfDestruct() {
  // Same rule as the self-destruct button, which only shows from the md breakpoint.
  if (!window.matchMedia('(min-width: 768px)').matches) {
    printError(t('L\'auto-destruction n\'est disponible que sur grand écran.', 'Self-destruct is only available on larger screens.'));
    return;
  }
  if (preferencesStore.isAnyFullScreen) {
    printError(t('Quittez le plein écran pour lancer l\'auto-destruction.', 'Exit full screen to start the self-destruct.'));
    return;
  }
  printError(t('[ALERTE] Séquence d\'auto-destruction armée.', '[ALERT] Self-destruct sequence armed.'));
  preferencesStore.showSelfDestructAlarm = true;
}

const COMMANDS: Record<string, TerminalCommand> = {
  help: {
    description: () => t('liste des commandes', 'list the commands'),
    run: () => {
      Object.entries(COMMANDS).forEach(([name, { usage, description }]) => {
        if (description) {
          print(`${usage?.() ?? name} · ${description()}`, { inline: true });
        }
      });
    },
  },
  whoami: {
    description: () => t('qui suis-je', 'who am I'),
    run: () => {
      print(t(
        'Gabriel Blaisot (kwikkill) - Ingénieur Informatique & Développeur Web Freelance',
        'Gabriel Blaisot (kwikkill) - Software Engineer & Freelance Web Developer',
      ));
      print(t(
        'Passionné par le développement web et l\'ingénierie logicielle.',
        'Passionate about web development and software engineering.',
      ), { inline: true });
      print(t('Intéressé par l\'IA et le Machine Learning.', 'Interested in AI and Machine Learning.'), { inline: true });
      print(t(
        'Toujours désireux d\'apprendre de nouvelles technologies et d\'améliorer mes compétences.',
        'Always eager to learn new technologies and improve my skills.',
      ), { inline: true });
    },
  },
  ls: {
    usage: () => 'ls [-l]',
    description: () => t('fichiers des projets, en détail avec -l', 'project files, detailed with -l'),
    run: (args) => {
      // -l, -la, -al…: long format, one project per line.
      if (args.some((arg) => arg.startsWith('-') && arg.includes('l'))) {
        projects.value.forEach((project) => pushLine(fileLine(project)));
        return;
      }
      pushLine(filesLine());
    },
  },
  open: {
    usage: () => t('open <projet>', 'open <project>'),
    description: () => t('ouvrir la fiche d\'un projet', 'open a project\'s page'),
    run: (args) => {
      const query = args.join(' ').toLowerCase();
      if (!query) {
        printError(t('open : précisez un projet, par exemple « open polis »', 'open: name a project, e.g. "open polis"'));
        return;
      }
      const project = findProject(query);
      if (!project) {
        printError(t(`open : ${query} : fichier introuvable. Essayez ls.`, `open: ${query}: no such file. Try ls.`));
        return;
      }
      print(t(`Ouverture de ${project.localizedFile}…`, `Opening ${project.localizedFile}…`));
      openProject(project.localizedFile);
    },
  },
  skills: {
    description: () => t('compétences par catégorie', 'skills by category'),
    run: () => {
      skills.value.forEach((category) => {
        print(`${category.name}${t(' :', ':')} ${category.skills.join(', ')}`, { inline: true });
      });
    },
  },
  contact: {
    description: () => t('me contacter', 'get in touch'),
    run: () => {
      print('gabriel@blaisot.org', { link: 'mailto:gabriel@blaisot.org', inline: true });
      print('github.com/KwikKill', { link: 'https://github.com/KwikKill', inline: true });
      print('linkedin.com/in/gabriel-blaisot', {
        link: 'https://www.linkedin.com/in/gabriel-blaisot-a89480233/',
        inline: true,
      });
    },
  },
  cv: {
    description: () => t('ouvrir mon CV (PDF)', 'open my CV (PDF)'),
    run: () => {
      print(t('Ouverture du CV…', 'Opening the CV…'), { link: CV_URL });
      window.open(CV_URL, '_blank', 'noopener');
    },
  },
  theme: {
    usage: () => t('theme <nom>', 'theme <name>'),
    description: () => Object.keys(THEMES).join(', '),
    run: (args) => {
      const name = (args[0] ?? '').toLowerCase();
      const theme = THEMES[name];
      if (!theme) {
        printError(t(
          `theme : choisissez parmi ${Object.keys(THEMES).join(', ')}`,
          `theme: pick one of ${Object.keys(THEMES).join(', ')}`,
        ));
        return;
      }
      preferencesStore.setCyberpunkTheme(theme);
      print(t(`Thème ${name} appliqué.`, `Theme ${name} applied.`));
    },
  },
  history: {
    description: () => t('commandes précédentes', 'previous commands'),
    run: () => {
      history.forEach((entry, index) => print(`${index + 1}  ${entry}`));
    },
  },
  clear: {
    description: () => t('effacer l\'écran', 'clear the screen'),
    run: () => {
      displayedLines.value = [];
    },
  },
  sudo: {
    run: (args) => {
      if (/^rm\s+-rf/.test(args.join(' '))) {
        requestSelfDestruct();
        return;
      }
      printError(t(
        'sudo : kwikkill n\'est pas dans le fichier sudoers. Cet incident sera signalé.',
        'sudo: kwikkill is not in the sudoers file. This incident will be reported.',
      ));
    },
  },
  exit: {
    run: () => {
      print(t('Il n\'y a pas de sortie. Essayez « theme matrix ».', 'There is no way out. Try "theme matrix".'));
    },
  },
};

// ---------- Glitches ----------

const glitchTimers = new Set<ReturnType<typeof setTimeout>>();

function later(callback: () => void, delay: number) {
  const id = setTimeout(() => {
    glitchTimers.delete(id);
    callback();
  }, delay);
  glitchTimers.add(id);
}

// Swaps one character of a random output line for a moment.
function glitchRandomLine() {
  const candidates = displayedLines.value.filter((line) => line.type !== 'command'
    && line.text.trim().length > 0
    && line.displayText === undefined);
  if (candidates.length === 0) return;

  const line = candidates[Math.floor(Math.random() * candidates.length)];
  const positions = line.text.split('')
    .map((char, index) => (char === ' ' ? -1 : index))
    .filter((index) => index >= 0);
  const position = positions[Math.floor(Math.random() * positions.length)];
  line.displayText = line.text.slice(0, position) + randomChar() + line.text.slice(position + 1);
  later(() => {
    line.displayText = undefined;
  }, randomBetween(100, 300));
}

function scheduleGlitch() {
  later(() => {
    glitchRandomLine();
    scheduleGlitch();
  }, randomBetween(300, 1000));
}

function startGlitches() {
  if (prefersReducedMotion || glitchTimers.size > 0) return;
  scheduleGlitch();
}

// ---------- Intro ----------

function endIntro() {
  introRunning.value = false;
  scrollToBottom();
  startGlitches();
}

function introLines(): TerminalLine[] {
  return [
    { type: 'command', text: 'whoami' },
    {
      type: 'response',
      text: t(
        'Gabriel Blaisot (kwikkill) - Ingénieur Informatique & Développeur Web Freelance',
        'Gabriel Blaisot (kwikkill) - Software Engineer & Freelance Web Developer',
      ),
    },
    { type: 'command', text: t('ls projets/', 'ls projects/') },
    filesLine(),
    {
      type: 'response',
      text: t(
        'Tapez help pour voir les commandes, ou cliquez sur un fichier.',
        'Type help to see the commands, or click a file.',
      ),
    },
  ];
}

const scramble = (text: string, revealed: number) => text.slice(0, revealed)
  + text.slice(revealed).split('').map((char) => (char === ' ' ? ' ' : randomChar())).join('');

// Calls onFrame(1…frames) every `interval` ms. Resolves false if the intro got cancelled.
function animateFrames(frames: number, interval: number, run: number, onFrame: (frame: number) => void) {
  return new Promise<boolean>((resolve) => {
    const tick = (frame: number) => {
      if (run !== introRun) {
        resolve(false);
        return;
      }
      onFrame(frame);
      if (frame >= frames) {
        resolve(true);
        return;
      }
      setTimeout(() => tick(frame + 1), interval);
    };
    tick(1);
  });
}

// Commands are typed out; their output decodes from random characters.
async function playIntroLine(lines: TerminalLine[], index: number, run: number): Promise<void> {
  if (run !== introRun) return;
  if (index >= lines.length) {
    endIntro();
    return;
  }

  const { text, type, files } = lines[index];
  const isCommand = type === 'command';
  const line = pushLine({ ...lines[index] });
  const frames = isCommand ? text.length : Math.round((files ? 300 : 220) / 30);
  const render = (frame: number) => {
    const reveal = (value: string) => scramble(value, Math.round((frame / frames) * value.length));
    if (isCommand) {
      line.displayText = text.slice(0, frame);
    } else if (files) {
      line.displayFiles = files.map(reveal);
    } else {
      line.displayText = reveal(text);
    }
  };
  render(0);
  const finished = await animateFrames(frames, isCommand ? 40 : 30, run, render);
  if (!finished) return;

  line.displayText = undefined;
  line.displayFiles = undefined;
  await sleep(isCommand ? 150 : 60);
  await playIntroLine(lines, index + 1, run);
}

async function playIntro() {
  introRun += 1;
  const run = introRun;
  introRunning.value = true;
  displayedLines.value = [];
  await sleep(300);
  await playIntroLine(introLines(), 0, run);
}

function skipIntro() {
  if (!introRunning.value) return;
  introRun += 1;
  displayedLines.value = introLines();
  endIntro();
}

// ---------- Input ----------

function runCommand(raw: string) {
  const line = raw.trim();
  if (!line) return;

  skipIntro();
  history.push(line);
  historyIndex = history.length;
  pushLine({ type: 'command', text: line });

  const [name, ...args] = line.split(/\s+/);
  const terminalCommand = COMMANDS[name.toLowerCase()];
  if (terminalCommand) {
    terminalCommand.run(args);
  } else {
    printError(t(`${name} : commande introuvable. Tapez help.`, `${name}: command not found. Type help.`));
  }
}

function submitCommand() {
  runCommand(command.value);
  command.value = '';
}

// Completes a command name, or the argument of `open` and `theme`.
function complete(value: string) {
  const space = value.indexOf(' ');
  if (space === -1) {
    const match = Object.keys(COMMANDS).find((name) => name.startsWith(value.toLowerCase()) && name !== value);
    return match ? `${match} ` : null;
  }

  const name = value.slice(0, space);
  const partial = value.slice(space + 1).toLowerCase();
  let candidates: string[] = [];
  if (name === 'open') {
    candidates = projects.value.map((project) => fileStem(project.localizedFile));
  } else if (name === 'theme') {
    candidates = Object.keys(THEMES);
  }
  const match = candidates.find((candidate) => candidate.startsWith(partial) && candidate !== partial);
  return match ? `${name} ${match}` : null;
}

function onInputKeydown(event: KeyboardEvent) {
  skipIntro();

  if (event.key === 'ArrowUp' && history.length > 0) {
    event.preventDefault();
    historyIndex = Math.max(0, historyIndex - 1);
    command.value = history[historyIndex];
  } else if (event.key === 'ArrowDown' && history.length > 0) {
    event.preventDefault();
    historyIndex = Math.min(history.length, historyIndex + 1);
    command.value = history[historyIndex] ?? '';
  } else if (event.key === 'Tab' && command.value) {
    const completion = complete(command.value);
    // Only keep Tab from moving the focus when there is something to complete.
    if (completion) {
      event.preventDefault();
      command.value = completion;
    }
  }
}

function onTerminalClick(event: MouseEvent) {
  skipIntro();
  const target = event.target as HTMLElement;
  if (target.closest('button, a, input') || window.getSelection()?.toString()) return;
  inputRef.value?.focus({ preventScroll: true });
}

onMounted(() => {
  prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    displayedLines.value = introLines();
    return;
  }
  playIntro().catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Error playing the terminal intro:', error);
  });
});

onBeforeUnmount(() => {
  introRun += 1;
  glitchTimers.forEach((id) => clearTimeout(id));
  glitchTimers.clear();
});
</script>
