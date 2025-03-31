<template>
  <div
    class="cyberpunk-terminal bg-black/90 border-2 border-theme-foreground/70 rounded-md p-4 text-green-400 font-mono text-sm overflow-hidden h-full"
  >
    <div class="terminal-header flex justify-between items-center mb-2 pb-2 border-b border-theme-foreground/30">
      <div class="text-theme-foreground">kwikkill@hyperion:~</div>
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div class="w-3 h-3 rounded-full bg-red-500"></div>
      </div>
    </div>

    <div
      class="terminal-content overflow-y-auto max-h-[360px] scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-gray-800"
    >
      <div v-for="(line, index) in terminalLines" :key="index" class="mb-1">
        <template v-if="line.type === 'command'">
          <span class="text-cyan-400">kwikkill@hyperion:~$</span>
          <span
            class="text-theme-foreground ml-2"
          >
            {{ line.text }}
          </span>
        </template>
        <template v-else-if="line.type === 'response'">
          <span
            v-if="line.inline"
            class="text-red-500 mr-2"
          >
            >>
          </span>
          <a
            :href="line.link"
            class="text-green-400 hover:text-green-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            v-if="line.link"
          >
            {{ line.text }}
          </a>
          <span
            class="text-green-400"
            v-else
          >
            {{ line.text }}
          </span>
        </template>
        <template v-else-if="line.type === 'error'">
          <span
            v-if="line.inline"
            class="text-red-500 mr-2"
          >
            >>
          </span>
          <a
            :href="line.link"
            class="text-red-400 hover:text-red-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            v-if="line.link"
          >
            {{ line.text }}
          </a>
          <span
            class="text-red-400"
            v-else
          >
            {{ line.text }}
          </span>
        </template>
      </div>

      <div class="flex items-center mt-2 animate-pulse">
        <span class="text-cyan-400">kwikkill@hyperion:~$</span>
        <span
          class="ml-2 w-2 h-4 bg-theme-foreground blink-cursor"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { usePreferencesStore } from '../stores/preferences'
import { useProjectsStore } from '../stores/projects'

const preferencesStore = usePreferencesStore()
const isEnglish = computed(() => preferencesStore.isEnglish)

const projectsStore = useProjectsStore()
const projects = computed(() => projectsStore.getLocalizedProjects)
const skills = computed(() => projectsStore.getLocalizedSkills)

const terminalLines = ref([])

onMounted(() => {
  let lines = []

  if (isEnglish.value) {

    lines = [
      { type: 'command', text: 'whoami' },
      { type: 'response', text: 'Gabriel Blaisot (kwikkill) - Computer Science Student' },
      { type: 'response', text: 'Passionate about web development and software engineering.', inline: true },
      { type: 'response', text: 'Interested in AI and Machine Learning.', inline: true },
      { type: 'response', text: 'Always eager to learn new technologies and improve my skills.', inline: true },
      { type: 'command', text: 'cat skills.txt' },
    ]
    skills.value.forEach(skill => {
      lines.push({
        type: 'response',
        text: skill['name'] + ': ' + skill['skills'].join(', '),
        inline: true
      })
    })
    lines.push({ type: 'command', text: 'ls -la projects/' })
    // format the date string to be the same length
    projects.value.forEach(project => {
      lines.push({
        type: 'response',
        text: 'drwxr-xr-x 23 root root   4096 '
        + project.file['en']
      })
    })
    lines.push(
      { type: 'command', text: 'ping github.com' },
      { type: 'response', text: 'Connected to github.com - Check out my repositories!', link: 'https://github.com/kwikkill' }
    )
  } else {
    lines = [
      { type: 'command', text: 'whoami' },
      { type: 'response', text: 'Gabriel Blaisot (kwikkill) - Étudiant en Informatique' },
      { type: 'response', text: 'Passionné par le développement web et l\'ingénierie logicielle.', inline: true },
      { type: 'response', text: 'Intéressé par l\'IA et le Machine Learning.', inline: true },
      { type: 'response', text: 'Toujours désireux d\'apprendre de nouvelles technologies et d\'améliorer mes compétences.', inline: true },
      { type: 'command', text: 'cat competences.txt' }
    ]
    skills.value.forEach(skill => {
      lines.push({
        type: 'response',
        text: skill['name']
        + ' : '
        + skill['skills'].join(', '),
        inline: true
      })
    })
    lines.push({ type: 'command', text: 'ls -la projets/' })
    projects.value.forEach(project => {
      lines.push({
        type: 'response',
        text: 'drwxr-xr-x 23 root root   4096 '
        + project.file['fr']
      })
    })
    lines.push(
      { type: 'command', text: 'ping github.com' },
      { type: 'response', text: 'Connecté à github.com - Consultez mes dépôts!', link: 'https://github.com/kwikkill' },
    )
  }

  // Simulate typing effect
  let currentIndex = 0
  const interval = setInterval(() => {
    if (currentIndex < lines.length) {
      terminalLines.value.push(lines[currentIndex])
      currentIndex++
    } else {
      clearInterval(interval)
    }
  }, 500)
})
</script>
