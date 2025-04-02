<template>
  <div
    class="cyberpunk-terminal border-2 border-theme-foreground/70 rounded-md bg-black/80"
    :class="{
      'p-2': !noTitle,
    }"
  >
    <!-- Terminal header -->
    <div
      class="terminal-header flex justify-between items-center"
      :class="{
        'border-b border-theme-foreground/30 pb-2': !noBody,
      }"
      v-if="!noTitle"
    >
      <div class="flex items-center">
        <div v-if="showIcon" class="w-4 h-4 bg-theme-foreground mr-2"></div>
        <div class="text-theme-foreground font-mono uppercase tracking-wider">
          <slot name="title">Terminal Window</slot>
        </div>
      </div>
      <div class="flex space-x-2">
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div class="w-3 h-3 rounded-full bg-red-500"></div>
      </div>
    </div>

    <!-- Terminal content -->
    <div
      class="font-mono p-2"
      v-if="!noBody"
    >
      <slot name="body">
        <!-- Default content if no body is provided -->
        <div class="text-cyan-400">
          kwikkill@hyperion:~$ echo "Terminal content goes here"
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
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
  }
})
</script>
