<template>
  <div
    class="cyberpunk-terminal bg-black/90 border-2 border-theme-foreground/70 rounded-md p-4 text-green-400 font-mono text-sm overflow-hidden h-full">
    <div class="terminal-header flex justify-between items-center mb-2 pb-2 border-b border-theme-foreground/30">
      <div class="text-theme-foreground">kwikkill@hyperion:~</div>
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div class="w-3 h-3 rounded-full bg-red-500"></div>
      </div>
    </div>

    <div ref="terminalContentRef"
      class="terminal-content overflow-y-auto max-h-[360px] scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-gray-800">
      <div v-for="(line, index) in displayedLines" :key="index" class="mb-1">
        <template v-if="line.type === 'command'">
          <span class="text-cyan-400">kwikkill@hyperion:~$</span>
          <span class="text-theme-foreground ml-2">
            {{ line.text }}
          </span>
        </template>
        <template v-else-if="line.type === 'response'">
          <span v-if="line.inline" class="text-red-500 mr-2">
            >>
          </span>
          <span class="text-green-400 cursor-pointer hover:text-green-600 transition-colors" v-if="line.link"
            @click.prevent="handleProjectClick(line.link, $event)">
            {{ line.displayText || line.text }}
          </span>
          <span class="text-green-400" v-else>
            {{ line.displayText || line.text }}
          </span>
        </template>
        <template v-else-if="line.type === 'error'">
          <span v-if="line.inline" class="text-red-500 mr-2">
            >>
          </span>
          <a :href="line.link" class="text-red-400 hover:text-red-600 transition-colors" target="_blank"
            rel="noopener noreferrer" v-if="line.link">
            {{ line.displayText || line.text }}
          </a>
          <span class="text-red-400" v-else>
            {{ line.displayText || line.text }}
          </span>
        </template>
      </div>

      <div class="flex items-center mt-2 animate-pulse">
        <span class="text-cyan-400">kwikkill@hyperion:~$</span>
        <span class="ml-2 w-2 h-4 bg-theme-foreground blink-cursor" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia';

import { usePreferencesStore } from '../stores/preferences'
import { useProjectsStore } from '../stores/projects'

const preferencesStore = usePreferencesStore()
const isEnglish = computed(() => preferencesStore.isEnglish)

const projectsStore = useProjectsStore()
const projects = computed(() => projectsStore.getLocalizedProjects)
const skills = computed(() => projectsStore.getLocalizedSkills)

const { selectedProject } = storeToRefs(projectsStore)

// Terminal content reference for scrolling
const terminalContentRef = ref(null)

// Store the complete lines
const terminalLines = ref([])
// Store the lines that are currently displayed (with typing animation)
const displayedLines = ref([])
// Track the current line being typed
const currentTypingLine = ref(null)
// Track if we're currently typing
const isTyping = ref(false)
// Track the current character index for typing animation
const currentCharIndex = ref(0)
// Track the current character's randomization state
const charRandomizationCount = ref(0)
// Maximum number of randomizations per character
const MAX_RANDOMIZATIONS = 2
// Characters to use for randomization and glitching
const RANDOM_CHARS = '0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/'

// Glitch effect configuration
const GLITCH_INTERVAL_MIN = 300  // Minimum time between glitches (ms)
const GLITCH_INTERVAL_MAX = 1000  // Maximum time between glitches (ms)
const GLITCH_DURATION_MIN = 100   // Minimum duration of a glitch (ms)
const GLITCH_DURATION_MAX = 300   // Maximum duration of a glitch (ms)
const GLITCH_PROBABILITY = 0.7    // Probability of a line being eligible for glitches (0-1)

// Store active glitch timeouts to clear them when component is unmounted
const activeGlitchTimeouts = ref([])

// Function to handle project link clicks
function handleProjectClick(link, event) {
  if (link && link.startsWith('#project-')) {
    // Extract the project file name from the link
    const projectFile = link.replace('#project-', '')

    // Scroll to the project
    const element = document.getElementById("projects")
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }

    // Set the selected project in the store
    const project = projects.value.find(project => project.file[isEnglish.value ? 'en' : 'fr'] === projectFile)
    if (project) {
      selectedProject.value = project
    }
  } else if (link) {
    // For external links, just follow the link
    window.open(link, '_blank')
  }
}

// Function to scroll to the bottom of the terminal
function scrollToBottom() {
  nextTick(() => {
    if (terminalContentRef.value) {
      terminalContentRef.value.scrollTop = terminalContentRef.value.scrollHeight
    }
  })
}

// Function to get a random character
function getRandomChar() {
  return RANDOM_CHARS.charAt(Math.floor(Math.random() * RANDOM_CHARS.length))
}

// Function to get a random number between min and max
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Function to apply a glitch to a random character in a line
function applyGlitch(lineIndex) {
  if (lineIndex >= displayedLines.value.length) return

  const line = displayedLines.value[lineIndex]

  // Skip command lines and empty lines
  if (line.type === 'command' || !line.text || line.text.length === 0) return

  // Make sure the line has a displayText property (copy from text if not)
  if (!line.displayText) {
    line.displayText = line.text
  }

  // Select a random character position
  const charIndex = Math.floor(Math.random() * line.text.length)

  // Skip spaces and special characters
  if (line.text[charIndex] === ' ' || line.text[charIndex] === '\n') {
    // Try again with a different line
    applyGlitch(lineIndex)
    return
  }

  // Create a new string with the glitched character
  const glitchedText =
    line.displayText.substring(0, charIndex) +
    getRandomChar() +
    line.displayText.substring(charIndex + 1)

  // Update the displayed text
  displayedLines.value[lineIndex] = {
    ...line,
    displayText: glitchedText
  }

  // Schedule the glitch to be reverted
  const glitchDuration = getRandomNumber(GLITCH_DURATION_MIN, GLITCH_DURATION_MAX)
  const timeoutId = setTimeout(() => {
    // Revert the glitch
    if (lineIndex < displayedLines.value.length) {
      displayedLines.value[lineIndex] = {
        ...displayedLines.value[lineIndex],
        displayText: line.text
      }
    }
  }, glitchDuration)

  // Store the timeout ID
  activeGlitchTimeouts.value.push(timeoutId)
}

// Function to schedule the next glitch
function scheduleNextGlitch() {
  // Randomly select a line to glitch
  const eligibleLines = displayedLines.value
    .map((line, index) => ({ line, index }))
    .filter(item =>
      item.line.type !== 'command' &&
      item.line.text &&
      item.line.text.length > 0 &&
      Math.random() < GLITCH_PROBABILITY
    )

  if (eligibleLines.length > 0) {
    const randomLine = eligibleLines[Math.floor(Math.random() * eligibleLines.length)]
    applyGlitch(randomLine.index)
  }

  // Schedule the next glitch
  const nextGlitchTime = getRandomNumber(GLITCH_INTERVAL_MIN, GLITCH_INTERVAL_MAX)
  const timeoutId = setTimeout(scheduleNextGlitch, nextGlitchTime)

  // Store the timeout ID
  activeGlitchTimeouts.value.push(timeoutId)
}

// Function to type the next character with randomization effect
function typeNextChar() {
  if (!currentTypingLine.value) return

  const targetText = currentTypingLine.value.text
  const lineIndex = displayedLines.value.length - 1

  // If we've finished typing all characters
  if (currentCharIndex.value >= targetText.length) {
    isTyping.value = false
    return
  }

  // If we're still randomizing the current character
  if (charRandomizationCount.value < MAX_RANDOMIZATIONS) {
    // Increment randomization count
    charRandomizationCount.value++

    // Create a partially randomized string
    let displayText = targetText.substring(0, currentCharIndex.value)

    // Add the current character as a random character
    displayText += getRandomChar()

    // Update the displayed text
    if (lineIndex >= 0) {
      displayedLines.value[lineIndex] = {
        ...displayedLines.value[lineIndex],
        text: targetText, // Store the original text
        displayText: displayText // Display the randomized text
      }
    }

    // Schedule the next randomization
    setTimeout(typeNextChar, 1)
  } else {
    // We've finished randomizing, set the correct character
    charRandomizationCount.value = 0
    currentCharIndex.value++

    // Update the displayed text with the correct characters so far
    if (lineIndex >= 0) {
      displayedLines.value[lineIndex] = {
        ...displayedLines.value[lineIndex],
        text: targetText, // Store the original text
        displayText: targetText.substring(0, currentCharIndex.value) // Display the correct text so far
      }
    }

    // Schedule the next character
    setTimeout(typeNextChar, 1)
  }

  // Scroll to bottom with each update
  scrollToBottom()
}

// Function to add a new line with typing animation
function addLineWithTyping(line) {
  // If we're already typing, wait until it's done
  if (isTyping.value) {
    setTimeout(() => addLineWithTyping(line), 100)
    return
  }

  // Set up for typing animation
  currentTypingLine.value = line
  currentCharIndex.value = 0
  charRandomizationCount.value = 0
  isTyping.value = true

  // Add the line to displayed lines with empty text initially
  const initialLine = { ...line, text: line.text, displayText: '' }
  displayedLines.value.push(initialLine)

  // Start typing animation
  typeNextChar()
}

// Function to process the next line from the queue
function processNextLine() {
  if (terminalLines.value.length === 0) {
    // All lines have been processed, start the glitch effect
    scheduleNextGlitch()
    return
  }

  const line = terminalLines.value.shift()

  // For command lines, add them immediately without typing animation
  if (line.type === 'command') {
    displayedLines.value.push(line)
    scrollToBottom()
    setTimeout(processNextLine, 500) // Delay before processing the next line
  } else {
    // For response lines, use typing animation
    addLineWithTyping(line)

    // Wait for typing to complete before processing the next line
    const checkTyping = setInterval(() => {
      if (!isTyping.value) {
        clearInterval(checkTyping)
        setTimeout(processNextLine, 200) // Delay before processing the next line
      }
    }, 100)
  }
}

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
          + project.file['en'],
        link: '#project-' + project.file['en']
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
          + project.file['fr'],
        link: '#project-' + project.file['fr']
      })
    })
    lines.push(
      { type: 'command', text: 'ping github.com' },
      { type: 'response', text: 'Connecté à github.com - Consultez mes dépôts!', link: 'https://github.com/kwikkill' },
    )
  }

  // Store the lines in the queue
  terminalLines.value = [...lines]

  // Start processing lines
  processNextLine()
})

// Clean up all timeouts when component is unmounted
onBeforeUnmount(() => {
  activeGlitchTimeouts.value.forEach(timeoutId => {
    clearTimeout(timeoutId)
  })
})

// Watch for changes in displayed lines to scroll to bottom
/*watch(displayedLines, () => {
  scrollToBottom()
}, { deep: true })*/
</script>
