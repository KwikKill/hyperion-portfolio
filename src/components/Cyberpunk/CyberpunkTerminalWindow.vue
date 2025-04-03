<template>
  <div
    class="cyberpunk-terminal border-2 border-theme-foreground/70 rounded-md bg-black/95 transition-all duration-300"
    :class="{
      'p-2': !noTitle,
      'fixed inset-0 z-50 terminal-fullscreen': isFullscreen,
      'relative': !isFullscreen,
      'border-2 border-dashed border-theme-foreground/50 rounded-md cursor-pointer bg-black/0 transition-all': isClosed
    }"
    :style="terminalStyle"
  >
    <div
      :class="{
        invisible: isClosed,
      }"
    >
      <!-- Terminal header -->
      <div
        class="terminal-header flex justify-between items-center"
        :class="{
          'border-b border-theme-foreground/30 pb-2': !noBody,
          'mb-0': isMinimized,
        }"
        v-if="!noTitle"
      >
        <div class="flex items-center">
          <div v-if="showIcon" class="w-4 h-4 bg-theme-foreground mr-2"></div>
          <div class="text-theme-foreground font-mono uppercase tracking-wider">
            <slot name="title">Terminal Window</slot>
          </div>
        </div>
        <slot name="buttons">
          <div class="flex space-x-2">
            <!-- Minimize button -->
            <div
              class="w-3 h-3 rounded-full cursor-pointer transition-all bg-gray-500 cursor-not-allowed"
              v-if="noBody"
              title="Disabled"
            />
            <div
              class="w-3 h-3 rounded-full cursor-pointer transition-all bg-green-500 hover:ring-1 hover:ring-white/50"
              v-else
              @click.prevent="toggleMinimize"
              title="Minimize"
            />

            <!-- Fullscreen button -->
            <div
              class="w-3 h-3 rounded-full cursor-pointer transition-all bg-gray-500 cursor-not-allowed"
              v-if="noBody"
              title="Disabled"
            />
            <div
              class="w-3 h-3 rounded-full cursor-pointer transition-all bg-yellow-500 hover:ring-1 hover:ring-white/50"
              v-else
              @click.prevent="toggleFullscreen"
              title="Fullscreen"
            />

            <!-- Close button -->
            <div
              class="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:ring-1 hover:ring-white/50 transition-all"
              @click.prevent="closeTerminal"
              title="Close"
            />
          </div>
        </slot>
      </div>

      <!-- Terminal content -->
      <div
        class="font-mono p-2 transition-all duration-300"
        :class="{
          [body_class]: !isFullscreen,
          'max-h-0 overflow-hidden': isMinimized,
          'max-h-screen overflow-auto': isFullscreen,
          'overflow-hidden': !isFullscreen && !isMinimized,
        }"
        v-if="!noBody && !isMinimized"
        :style="bodyStyle"
      >
        <slot
          name="body"
        >
          <!-- Default content if no body is provided -->
          <div class="text-cyan-400">
            kwikkill@hyperion:~$ echo "Terminal content goes here"
          </div>
        </slot>
      </div>
    </div>
    <div
      class="font-mono p-2 transition-all duration-300 overflow-hidden text-theme-foreground/50"
      v-if="isMinimized"
    >
      {{ isEnglish
        ? 'Terminal is minimized. Click the button to restore.'
        : 'Le terminal est minimisé. Cliquez sur le bouton pour le restaurer.'
      }}
    </div>

    <div
      v-if="isClosed"
      class="absolute w-full h-full top-0 left-0 flex items-center justify-center rounded-md bg-black z-5"
      @click="reopenTerminal"
    >
      <span
        class="text-theme-foreground font-mono glitch-text"
        :data-text="isEnglish
          ? '[ CLICK TO RESTORE TERMINAL ]'
          : '[ CLIQUEZ POUR RESTAURER LE TERMINAL ]'"
      >
        {{
          isEnglish
            ? '[ CLICK TO RESTORE TERMINAL ]'
            : '[ CLIQUEZ POUR RESTAURER LE TERMINAL ]'
        }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { usePreferencesStore } from '../../stores/preferences';

const preferencesStore = usePreferencesStore();
const isEnglish = computed(() => preferencesStore.isEnglish);

const props = defineProps({
  showIcon: {
    type: Boolean,
    default: true
  },
  borderColor: {
    type: String,
    default: 'theme-foreground/70'
  },
  noBody: {
    type: Boolean,
    default: false
  },
  noTitle: {
    type: Boolean,
    default: false
  },
  body_class: {
    type: String,
    default: ''
  }
});

// Terminal state
const isMinimized = ref(false);
const isFullscreen = ref(false);
const isClosed = ref(false);

// Toggle minimize state
const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value;
  if (isMinimized.value) {
    isFullscreen.value = false;
    preferencesStore.isAnyFullScreen = false;
    document.body.style.overflow = '';
  }
};

// Toggle fullscreen state
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
  if (isFullscreen.value) {
    preferencesStore.isAnyFullScreen = true;
    isMinimized.value = false;
    document.body.style.overflow = 'hidden';
  } else {
    preferencesStore.isAnyFullScreen = false;
    document.body.style.overflow = '';
  }
};

// Close terminal
const closeTerminal = () => {
  isClosed.value = true;
  isMinimized.value = false;
  isFullscreen.value = false;
  preferencesStore.isAnyFullScreen = false;
  document.body.style.overflow = '';
};

// Reopen terminal
const reopenTerminal = () => {
  isClosed.value = false;
  isMinimized.value = false;
  isFullscreen.value = false;
  preferencesStore.isAnyFullScreen = false;
};

// Computed styles
const terminalStyle = computed(() => {
  if (isFullscreen.value) {
    return {
      borderRadius: '0',
      maxWidth: '100%',
      maxHeight: '100%',
      overflow: 'auto',
      zIndex: 1000
    };
  }
  return {};
});

const bodyStyle = computed(() => {
  if (isMinimized.value) {
    return {
      maxHeight: '0px',
      padding: '0px'
    };
  }
  if (isFullscreen.value) {
    return {
      maxHeight: '100%'
    };
  }
  return {};
});
</script>

<style scoped>
.cyberpunk-terminal {
  overflow: hidden;
}

.terminal-fullscreen {
  display: flex;
  flex-direction: column;
}

.terminal-fullscreen .terminal-header {
  flex-shrink: 0;
}

.terminal-fullscreen .font-mono {
  flex-grow: 1;
  overflow: auto;
}

.glitch-text {
  position: relative;
  display: inline-block;
  z-index: 10;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
}

.glitch-text::before {
  color: #0ff;
  z-index: -1;
  animation: glitch 1s cubic-bezier(0.5, 0, 0.5, 1) both infinite;
  animation-delay: 0.1s;
}

.glitch-text::after {
  color: #f0f;
  z-index: -1;
  animation: glitch 1s cubic-bezier(0.5, 0, 0.5, 1) reverse both infinite;
  animation-delay: 0.2s;
}

@keyframes glitch {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 1px);
  }
  40% {
    transform: translate(-2px, 1px);
  }
  60% {
    transform: translate(2px, 1px);
  }
  80% {
    transform: translate(2px, 1px);
  }
  100% {
    transform: translate(0);
  }
}
</style>

