<template>
  <div
    class="cyberpunk-terminal rounded-md border-2 border-theme-foreground/70 bg-black/95 transition-all duration-300"
    :class="{
      'p-2': !noTitle,
      'terminal-fullscreen fixed inset-0 z-50': isFullscreen,
      relative: !isFullscreen,
      'cursor-pointer rounded-md border-2 border-dashed border-theme-foreground/50 bg-black/0 transition-all': isClosed,
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
        v-if="!noTitle"
        class="terminal-header flex items-center"
        :class="{
          'border-b border-theme-foreground/30 pb-2': !noBody,
          'mb-0': isMinimized,
          'justify-center text-center': noButtons,
          'justify-between': !noButtons,
        }"
      >
        <div class="flex items-center">
          <div v-if="showIcon" class="mr-2 size-4 bg-theme-foreground"/>
          <div class="font-mono uppercase tracking-wider text-theme-foreground">
            <slot name="title">
              Terminal Window
            </slot>
          </div>
        </div>
        <slot v-if="!noButtons" name="buttons">
          <div class="flex space-x-2">
            <!-- Minimize button -->
            <div
              v-if="noBody"
              class="size-3 cursor-not-allowed rounded-full bg-gray-500 transition-all"
              title="Disabled"
            />
            <div
              v-else
              class="size-3 cursor-pointer rounded-full bg-green-500 transition-all hover:ring-1 hover:ring-white/50"
              title="Minimize"
              @click.prevent="toggleMinimize"
              @keydown.enter.prevent="toggleMinimize"
            />

            <!-- Fullscreen button -->
            <div
              v-if="noBody"
              class="size-3 cursor-not-allowed rounded-full bg-gray-500 transition-all"
              title="Disabled"
            />
            <div
              v-else
              class="size-3 cursor-pointer rounded-full bg-yellow-500 transition-all hover:ring-1 hover:ring-white/50"
              title="Fullscreen"
              @click.prevent="toggleFullscreen"
              @keydown.enter.prevent="toggleFullscreen"
            />

            <!-- Close button -->
            <div
              class="size-3 cursor-pointer rounded-full bg-red-500 transition-all hover:ring-1 hover:ring-white/50"
              title="Close"
              @click.prevent="closeTerminal"
              @keydown.enter.prevent="closeTerminal"
            />
          </div>
        </slot>
      </div>

      <!-- Terminal content -->
      <div
        v-if="!noBody && !isMinimized"
        class="font-mono p-2 transition-all duration-300"
        :class="{
          [bodyClass]: !isFullscreen,
          'max-h-0 overflow-hidden': isMinimized,
          'max-h-screen overflow-auto': isFullscreen,
          'overflow-hidden': !isFullscreen && !isMinimized,
        }"
        :style="bodyStyle"
      >
        <slot name="body">
          <!-- Default content if no body is provided -->
          <div class="text-cyan-400">
            kwikkill@hyperion:~$ echo "Terminal content goes here"
          </div>
        </slot>
      </div>
    </div>
    <div v-if="isMinimized" class="font-mono overflow-hidden p-2 text-theme-foreground/50 transition-all duration-300">
      {{ isEnglish
        ? 'Terminal is minimized. Click the button to restore.'
        : 'Le terminal est minimisé. Cliquez sur le bouton pour le restaurer.'
      }}
    </div>

    <div
      v-if="isClosed"
      class="z-5 absolute left-0 top-0 flex size-full items-center justify-center rounded-md bg-black"
      @click="reopenTerminal"
      @keydown.enter="reopenTerminal"
    >
      <span
        class="font-mono glitch-text text-theme-foreground"
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

<script setup lang="ts">
import { computed, ref } from 'vue';

import { usePreferencesStore } from '../../stores/preferences';

const preferencesStore = usePreferencesStore();
const isEnglish = computed(() => preferencesStore.isEnglish);

defineProps({
  showIcon: {
    type: Boolean,
    default: true,
  },
  borderColor: {
    type: String,
    default: 'theme-foreground/70',
  },
  noBody: {
    type: Boolean,
    default: false,
  },
  noTitle: {
    type: Boolean,
    default: false,
  },
  noButtons: {
    type: Boolean,
    default: false,
  },
  bodyClass: {
    type: String,
    default: '',
  },
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
      zIndex: 1000,
    };
  }
  return {};
});

const bodyStyle = computed(() => {
  if (isMinimized.value) {
    return {
      maxHeight: '0px',
      padding: '0px',
    };
  }
  if (isFullscreen.value) {
    return {
      maxHeight: '100%',
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
