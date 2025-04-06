<template>
  <div
    class="font-mono h-full overflow-hidden rounded-lg border border-gray-700 bg-gray-900 text-sm text-green-400 shadow-lg"
  >
    <div class="flex items-center justify-between bg-gray-800 px-4 py-2">
      <div class="text-white">
        terminal@portfolio:~
      </div>
      <div class="flex space-x-2">
        <div class="size-3 rounded-full bg-green-500"/>
        <div class="size-3 rounded-full bg-yellow-500"/>
        <div class="size-3 rounded-full bg-red-500"/>
      </div>
    </div>

    <div ref="terminalContentRef" class="h-[600px] overflow-y-auto p-4 lg:h-[500px] xl:h-[410px]">
      <div v-for="(line, index) in terminalLines" :key="index" class="mb-1">
        <template v-if="line.type === 'command'">
          <span class="text-blue-400">terminal@portfolio:~$</span>
          <span class="ml-2 text-white">{{ line.text }}</span>
        </template>
        <template v-else>
          <span v-if="line.inline" class="text-blue-400">>> </span>
          <a
            v-if="line.link"
            :href="line.link"
            class="text-green-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ line.text }}
          </a>
          <span v-else class="text-green-400">
            {{ line.text }}
          </span>
        </template>
      </div>

      <div class="mt-2 flex items-center">
        <span class="text-blue-400">terminal@portfolio:~$</span>
        <span class="ml-2 inline-block h-4 w-2 animate-pulse bg-white"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed, nextTick, onMounted, ref, watch,
} from 'vue';

import type { Command } from '../../models/command';
import { usePreferencesStore } from '../../stores/preferences';
import { useProjectsStore } from '../../stores/projects';

const preferencesStore = usePreferencesStore();
const isEnglish = computed(() => preferencesStore.isEnglish);
const projectsStore = useProjectsStore();
const projects = computed(() => projectsStore.getLocalizedProjects);
const skills = computed(() => projectsStore.getLocalizedSkills);

const terminalLines = ref<Command[]>([]);
const terminalContentRef = ref<HTMLElement | null>(null);

// Function to scroll to the bottom of the terminal
function scrollToBottom() {
  nextTick(() => {
    if (terminalContentRef.value) {
      terminalContentRef.value.scrollTop = terminalContentRef.value.scrollHeight;
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Error scrolling to bottom:', error);
  });
}

// Watch for changes in terminal lines to scroll to bottom
watch(terminalLines, () => {
  scrollToBottom();
}, { deep: true });

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
          project.file.en}`,
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
          project.file.fr}`,
      });
    });
    lines.push(
      { type: 'command', text: 'ping github.com' },
      { type: 'response', text: 'Connecté à github.com - Consultez mes dépôts!', link: 'https://github.com/kwikkill' },
    );
  }

  terminalLines.value = lines;

  // Scroll to bottom after initial content is loaded
  scrollToBottom();
});
</script>
