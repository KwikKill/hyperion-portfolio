<template>
  <section id="experience" class="relative min-h-screen py-20">
    <!-- Canyon of towers on three depths, with flying vehicles in the central corridor -->
    <CyberpunkBackground scene="cityCanyon"/>

    <div class="container relative z-10 mx-auto flex flex-col gap-8 px-4">
      <!-- Section header -->
      <CyberpunkSectionHeader
        :title="isEnglish ? 'HYPERION v1.0 - CAREER PATH' : 'HYPERION v1.0 - PARCOURS PROFESSIONNEL'"
      />

      <!-- Experience timeline -->
      <div ref="timeline" class="relative">
        <!-- Vertical timeline line: a dim track, and the line drawn down to the scroll position -->
        <div class="absolute left-1/2 h-full w-1 -translate-x-1/2 bg-primary/20"/>
        <div
          class="absolute left-1/2 h-full w-1 -translate-x-1/2 bg-gradient-to-b from-secondary via-primary to-primary"
          :style="{ clipPath: `inset(0 0 ${(1 - lineProgress) * 100}% 0)` }"
        />

        <div class="space-y-24">
          <CyberpunkExperienceCard
            v-for="(experience, index) in mainExperiences"
            :key="'main-' + index"
            v-reveal="150"
            :experience="experience"
            :index="index"
          />

          <div v-if="internshipExperiences.length" v-reveal="150" class="relative">
            <!-- Timeline node -->
            <div
              class="timeline-node absolute left-1/2 z-20 size-6 -translate-x-1/2 rounded-full border-2 border-secondary bg-bg"
              style="top: -12px;"
            >
              <div class="absolute inset-1 animate-pulse rounded-full bg-secondary"/>
            </div>

            <!-- Group toggle -->
            <div class="relative z-10 flex justify-center pt-6">
              <button
                type="button"
                class="cyberpunk-terminal flex items-center gap-3 rounded-lg border-2 border-primary bg-bg/95 px-6 py-3 font-mono uppercase tracking-wider text-primary transition-all duration-300 hover:border-secondary hover:bg-bg"
                @click="showInternships = !showInternships"
              >
                <span
                  class="text-secondary transition-transform duration-200"
                  :class="{ 'rotate-90': showInternships }"
                >
                  ▶
                </span>
                {{
                  showInternships
                    ? (isEnglish ? 'Hide internships' : 'Masquer les stages')
                    : (isEnglish
                      ? `Show internships ${internshipYearRange} (${internshipExperiences.length})`
                      : `Afficher les stages ${internshipYearRange} (${internshipExperiences.length})`)
                }}
              </button>
            </div>
          </div>

          <template v-if="showInternships">
            <CyberpunkExperienceCard
              v-for="(experience, index) in internshipExperiences"
              :key="'intern-' + index"
              :experience="experience"
              :index="mainExperiences.length + index"
            />
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  computed, nextTick, onBeforeUnmount, onMounted, ref, watch,
} from 'vue';

import { usePreferencesStore } from '../../stores/preferences';
import { useProjectsStore } from '../../stores/projects';
import { vReveal } from '../../directives/reveal';
import { prefersReducedMotion } from '../../utils/motion';
import CyberpunkBackground from './CyberpunkBackground.vue';
import CyberpunkExperienceCard from './CyberpunkExperienceCard.vue';
import CyberpunkSectionHeader from './CyberpunkSectionHeader.vue';

const preferencesStore = usePreferencesStore();
const projectsStore = useProjectsStore();

const isEnglish = computed(() => preferencesStore.isEnglish);
const experiences = computed(() => projectsStore.getLocalizedExperiences);
const mainExperiences = computed(() => experiences.value.filter((experience) => !experience.internship));
const internshipExperiences = computed(() => experiences.value.filter((experience) => experience.internship));
const internshipYearRange = computed(() => {
  const years = internshipExperiences.value
    .flatMap((experience) => experience.localizedPeriod.match(/\d{4}/g) ?? [])
    .map(Number);
  if (!years.length) return '';
  const min = Math.min(...years);
  const max = Math.max(...years);
  return min === max ? `${min}` : `${min}-${max}`;
});

const showInternships = ref(false);

// The timeline line draws itself down to 60% of the screen as the page scrolls, and each
// job's node lights up when the line reaches it. Fully drawn on the server and when the
// visitor reduces motion.
const timeline = ref<HTMLElement | null>(null);
const lineProgress = ref(1);
let timelineFrame = 0;
let followsScroll = false;

function updateTimeline() {
  timelineFrame = 0;
  const element = timeline.value;
  if (!element) return;
  const box = element.getBoundingClientRect();
  const drawnTo = window.innerHeight * 0.6;
  lineProgress.value = Math.min(1, Math.max(0, (drawnTo - box.top) / box.height));
  element.querySelectorAll<HTMLElement>('.timeline-node').forEach((node) => {
    const nodeBox = node.getBoundingClientRect();
    node.dataset.lit = String(nodeBox.top + nodeBox.height / 2 <= drawnTo);
  });
}

function scheduleTimeline() {
  if (!timelineFrame) timelineFrame = requestAnimationFrame(updateTimeline);
}

onMounted(() => {
  if (prefersReducedMotion()) return;
  followsScroll = true;
  window.addEventListener('scroll', scheduleTimeline, { passive: true });
  window.addEventListener('resize', scheduleTimeline, { passive: true });
  updateTimeline();
});

// Showing or hiding the internships changes the timeline's height and its nodes.
watch(showInternships, () => {
  if (followsScroll) nextTick(scheduleTimeline).catch(() => undefined);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', scheduleTimeline);
  window.removeEventListener('resize', scheduleTimeline);
  cancelAnimationFrame(timelineFrame);
});
</script>
