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
      <div ref="terminalContentRef">
        <div v-for="(line, index) in displayedLines" :key="index" class="mb-1">
          <template v-if="line.type === 'command'">
            <span class="text-secondary">kwikkill@hyperion:~$</span>
            <span class="ml-2 text-primary">
              {{ line.text }}
            </span>
          </template>
          <template v-else-if="line.type === 'response'">
            <span v-if="line.inline" class="mr-2 text-red-500">
              >>
            </span>
            <span
              v-if="line.link"
              class="cursor-pointer text-terminal transition-colors hover:text-terminal-hover"
              @click.prevent="handleProjectClick(line.link)"
              @keydown.enter.prevent="handleProjectClick(line.link)"
            >
              {{ line.displayText || line.text }}
            </span>
            <span v-else class="text-terminal">
              {{ line.displayText || line.text }}
            </span>
          </template>
          <template v-else-if="line.type === 'error'">
            <span v-if="line.inline" class="mr-2 text-red-500">
              >>
            </span>
            <a
              v-if="line.link"
              :href="line.link"
              class="text-red-400 transition-colors hover:text-red-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ line.displayText || line.text }}
            </a>
            <span v-else class="text-red-400">
              {{ line.displayText || line.text }}
            </span>
          </template>
        </div>

        <div class="mt-2 flex animate-pulse items-center">
          <span class="text-secondary">kwikkill@hyperion:~$</span>
          <span class="blink-cursor ml-2 h-4 w-2 bg-primary"/>
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
import CyberpunkTerminalWindow from './CyberpunkTerminalWindow.vue';

const preferencesStore = usePreferencesStore();
const isEnglish = computed(() => preferencesStore.isEnglish);

const projectsStore = useProjectsStore();
const projects = computed(() => projectsStore.getLocalizedProjects);
const skills = computed(() => projectsStore.getLocalizedSkills);

const { selectedProject } = storeToRefs(projectsStore);

// Terminal content reference for scrolling
const terminalContentRef = ref<HTMLElement | null>(null);

// Store the complete lines
const terminalLines = ref<Command[]>([]);
// Store the lines that are currently displayed (with typing animation)
const displayedLines = ref<
(Command & {
  displayText?: string;
})[]
>([]);
// Track the current line being typed
const currentTypingLine = ref<Command | null>(null);
// Track if we're currently typing
const isTyping = ref(false);
// Track the current character index for typing animation
const currentCharIndex = ref(0);
// Track the current character's randomization state
const charRandomizationCount = ref(0);
// Maximum number of randomizations per character
const MAX_RANDOMIZATIONS = 1;
// Characters to use for randomization and glitching
const RANDOM_CHARS = '0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/';

// Glitch effect configuration
const GLITCH_INTERVAL_MIN = 300; // Minimum time between glitches (ms)
const GLITCH_INTERVAL_MAX = 1000; // Maximum time between glitches (ms)
const GLITCH_DURATION_MIN = 100; // Minimum duration of a glitch (ms)
const GLITCH_DURATION_MAX = 300; // Maximum duration of a glitch (ms)
const GLITCH_PROBABILITY = 0.7; // Probability of a line being eligible for glitches (0-1)

// Store active glitch timeouts to clear them when component is unmounted
const activeGlitchTimeouts = ref<NodeJS.Timeout[]>([]);

// Function to handle project link clicks
function handleProjectClick(link: string | URL | undefined) {
  if (typeof link === 'string' && link.startsWith('#project-')) {
    if (preferencesStore.isAnyFullScreen) {
      return;
    }
    // Extract the project file name from the link
    const projectFile = link.replace('#project-', '');

    // Scroll to the project
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }

    // Set the selected project in the store
    const selectedProj = projects.value.find((project) => project.localizedFile === projectFile);
    if (selectedProj) {
      selectedProject.value = selectedProj;
    }
  } else if (link) {
    // For external links, just follow the link
    window.open(link, '_blank');
  }
}

// Function to scroll to the bottom of the terminal
async function scrollToBottom() {
  await nextTick(() => {
    if (terminalContentRef.value?.parentElement) {
      terminalContentRef.value.parentElement.scrollTop = terminalContentRef.value.parentElement.scrollHeight;
    }
  });
}

// Function to get a random character
function getRandomChar() {
  return RANDOM_CHARS.charAt(Math.floor(Math.random() * RANDOM_CHARS.length));
}

// Function to get a random number between min and max
function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to apply a glitch to a random character in a line
function applyGlitch(lineIndex: number) {
  if (lineIndex >= displayedLines.value.length) return;

  const line = displayedLines.value[lineIndex];

  // Skip command lines and empty lines
  if (line.type === 'command' || !line.text || line.text.length === 0) return;

  // Make sure the line has a displayText property (copy from text if not)
  if (!line.displayText) {
    line.displayText = line.text;
  }

  // Select a random character position
  const charIndex = Math.floor(Math.random() * line.text.length);

  // Skip spaces and special characters
  if (line.text[charIndex] === ' ' || line.text[charIndex] === '\n') {
    // Try again with a different line
    applyGlitch(lineIndex);
    return;
  }

  // Create a new string with the glitched character
  const glitchedText = line.displayText.substring(0, charIndex)
    + getRandomChar()
    + line.displayText.substring(charIndex + 1);

  // Update the displayed text
  displayedLines.value[lineIndex] = {
    ...line,
    displayText: glitchedText,
  };

  // Schedule the glitch to be reverted
  const glitchDuration = getRandomNumber(GLITCH_DURATION_MIN, GLITCH_DURATION_MAX);
  const timeoutId = setTimeout(() => {
    // Revert the glitch
    if (lineIndex < displayedLines.value.length) {
      displayedLines.value[lineIndex] = {
        ...displayedLines.value[lineIndex],
        displayText: line.text,
      };
    }
  }, glitchDuration);

  // Store the timeout ID
  activeGlitchTimeouts.value.push(timeoutId);
}

// Function to schedule the next glitch
function scheduleNextGlitch() {
  // Randomly select a line to glitch
  const eligibleLines = displayedLines.value
    .map((line, index) => ({ line, index }))
    .filter((item) => item.line.type !== 'command'
      && item.line.text
      && item.line.text.length > 0
      && Math.random() < GLITCH_PROBABILITY);

  if (eligibleLines.length > 0) {
    const randomLine = eligibleLines[Math.floor(Math.random() * eligibleLines.length)];
    applyGlitch(randomLine.index);
  }

  if (activeGlitchTimeouts.value.length < 10000) {
    // Schedule the next glitch
    const nextGlitchTime = getRandomNumber(GLITCH_INTERVAL_MIN, GLITCH_INTERVAL_MAX);
    const timeoutId = setTimeout(scheduleNextGlitch, nextGlitchTime);

    // Store the timeout ID
    activeGlitchTimeouts.value.push(timeoutId);
  }
}

// Function to type the next character with randomization effect
function typeNextChar() {
  if (!currentTypingLine.value) return;

  const targetText = currentTypingLine.value.text;
  const lineIndex = displayedLines.value.length - 1;

  // If we've finished typing all characters
  if (currentCharIndex.value >= targetText.length) {
    isTyping.value = false;
    return;
  }

  // If we're still randomizing the current character
  if (charRandomizationCount.value < MAX_RANDOMIZATIONS) {
    // Increment randomization count
    charRandomizationCount.value += 1;

    // Create a partially randomized string
    let displayText = targetText.substring(0, currentCharIndex.value);

    // Add the current character as a random character
    displayText += getRandomChar();

    // Update the displayed text
    if (lineIndex >= 0) {
      displayedLines.value[lineIndex] = {
        ...displayedLines.value[lineIndex],
        text: targetText, // Store the original text
        displayText, // Display the randomized text
      };
    }

    // Schedule the next randomization
    setTimeout(typeNextChar, 1);
  } else {
    // We've finished randomizing, set the correct character
    charRandomizationCount.value = 0;
    currentCharIndex.value += 1;

    // Update the displayed text with the correct characters so far
    if (lineIndex >= 0) {
      displayedLines.value[lineIndex] = {
        ...displayedLines.value[lineIndex],
        text: targetText, // Store the original text
        displayText: targetText.substring(0, currentCharIndex.value), // Display the correct text so far
      };
    }

    // Schedule the next character
    setTimeout(typeNextChar, 1);
  }

  // Scroll to bottom with each update
  scrollToBottom().catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Error scrolling to bottom:', error);
  });
}

// Function to add a new line with typing animation
function addLineWithTyping(line: Command) {
  // If we're already typing, wait until it's done
  if (isTyping.value) {
    setTimeout(() => addLineWithTyping(line), 100);
    return;
  }

  // Set up for typing animation
  currentTypingLine.value = line;
  currentCharIndex.value = 0;
  charRandomizationCount.value = 0;
  isTyping.value = true;

  // Add the line to displayed lines with empty text initially
  const initialLine = { ...line, text: line.text, displayText: '' };
  displayedLines.value.push(initialLine);

  // Start typing animation
  typeNextChar();
}

// Function to process the next line from the queue
function processNextLine() {
  if (terminalLines.value.length === 0) {
    // All lines have been processed, start the glitch effect
    scheduleNextGlitch();
    return;
  }

  const line = terminalLines.value.shift();

  if (!line) {
    // No more lines to process
    return;
  }

  // For command lines, add them immediately without typing animation
  if (line.type === 'command') {
    displayedLines.value.push(line);
    scrollToBottom().catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error scrolling to bottom:', error);
    });
    setTimeout(processNextLine, 500); // Delay before processing the next line
  } else {
    // For response lines, use typing animation
    addLineWithTyping(line);

    // Wait for typing to complete before processing the next line
    const checkTyping = setInterval(() => {
      if (!isTyping.value) {
        clearInterval(checkTyping);
        setTimeout(processNextLine, 200); // Delay before processing the next line
      }
    }, 100);
  }
}

onMounted(() => {
  let lines: Command[] = [];

  if (isEnglish.value) {
    lines = [
      { type: 'command', text: 'whoami' },
      { type: 'response', text: 'Gabriel Blaisot (kwikkill) - Computer Science Student' },
      { type: 'response', text: 'Passionate about web development and software engineering.', inline: true },
      { type: 'response', text: 'Interested in AI and Machine Learning.', inline: true },
      { type: 'response', text: 'Always eager to learn new technologies and improve my skills.', inline: true },
      { type: 'command', text: 'cat skills.txt' },
    ];
    skills.value.forEach((skill) => {
      lines.push({
        type: 'response',
        text: `${skill.name}: ${skill.skills.join(', ')}`,
        inline: true,
      });
    });
    lines.push({ type: 'command', text: 'ls -la projects/' });
    // format the date string to be the same length
    projects.value.forEach((project) => {
      lines.push({
        type: 'response',
        text: `drwxr-xr-x 23 root root   4096 ${
          project.localizedFile}`,
        link: `#project-${project.localizedFile}`,
      });
    });
    lines.push(
      { type: 'command', text: 'ping github.com' },
      { type: 'response', text: 'Connected to github.com - Check out my repositories!', link: 'https://github.com/kwikkill' },
    );
  } else {
    lines = [
      { type: 'command', text: 'whoami' },
      { type: 'response', text: 'Gabriel Blaisot (kwikkill) - Étudiant en Informatique' },
      { type: 'response', text: 'Passionné par le développement web et l\'ingénierie logicielle.', inline: true },
      { type: 'response', text: 'Intéressé par l\'IA et le Machine Learning.', inline: true },
      { type: 'response', text: 'Toujours désireux d\'apprendre de nouvelles technologies et d\'améliorer mes compétences.', inline: true },
      { type: 'command', text: 'cat competences.txt' },
    ];
    skills.value.forEach((skill) => {
      lines.push({
        type: 'response',
        text: `${skill.name
        } : ${
          skill.skills.join(', ')}`,
        inline: true,
      });
    });
    lines.push({ type: 'command', text: 'ls -la projets/' });
    projects.value.forEach((project) => {
      lines.push({
        type: 'response',
        text: `drwxr-xr-x 23 root root   4096 ${
          project.localizedFile}`,
        link: `#project-${project.localizedFile}`,
      });
    });
    lines.push(
      { type: 'command', text: 'ping github.com' },
      { type: 'response', text: 'Connecté à github.com - Consultez mes dépôts!', link: 'https://github.com/kwikkill' },
    );
  }

  // Store the lines in the queue
  terminalLines.value = [...lines];

  // Start processing lines
  processNextLine();
});

// Clean up all timeouts when component is unmounted
onBeforeUnmount(() => {
  activeGlitchTimeouts.value.forEach((timeoutId) => {
    clearTimeout(timeoutId);
  });
});

// Watch for changes in displayed lines to scroll to bottom
/* watch(displayedLines, () => {
  scrollToBottom()
}, { deep: true }) */
</script>
