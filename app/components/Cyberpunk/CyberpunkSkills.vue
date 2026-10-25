<template>
  <!-- htop: every skill as a process, linked to the projects, jobs and education that use it -->
  <CyberpunkTerminalWindow>
    <template #title>
      {{ isEnglish ? 'SKILLS.EXE — htop' : 'COMPETENCES.EXE — htop' }}
    </template>

    <template #body>
      <div class="mb-4">
        <span class="text-secondary">kwikkill@hyperion:~$</span>
        <span class="ml-2 text-primary">htop --tree=categories</span>
      </div>

      <!-- Category meters, which also filter the list. They fill in when first seen. -->
      <div ref="meterGrid" class="mb-3 grid gap-x-5 gap-y-1 sm:grid-cols-2">
        <button
          v-for="(meter, index) in meters"
          :key="meter.key"
          type="button"
          class="grid grid-cols-[6.5em_minmax(0,1fr)_3em] items-center gap-1.5 px-1 py-0.5 text-left text-sm transition-colors"
          :class="activeCategory === meter.index ? 'bg-secondary/20' : 'hover:bg-primary/10'"
          :aria-pressed="activeCategory === meter.index"
          @click="filterCategory(meter.index)"
        >
          <span class="text-secondary">{{ meter.label }}</span>
          <span class="flex items-center gap-0.5 text-gray-500">
            [<span class="relative h-2 flex-1 bg-terminal/10">
              <span class="absolute inset-y-0 left-0 bg-terminal" :style="{ width: `${meter.ratio * meterFill(index) * 100}%` }"/>
            </span>]
          </span>
          <span class="text-right tabular-nums text-terminal">{{ Math.round(meter.linked * meterFill(index)) }}/{{ meter.total }}</span>
        </button>
      </div>

      <p class="mb-3 text-sm text-terminal">
        {{ isEnglish ? 'Tasks:' : 'Tâches :' }}
        <span class="text-primary">{{ rows.length }}</span>
        · <span class="text-primary">{{ linkedCount }}</span>
        {{ isEnglish ? 'tied to a project, a job or my education' : 'liées à un projet, une expérience ou ma formation' }}
        · <span class="text-primary">{{ rows.length - linkedCount }}</span>
        {{ isEnglish ? 'for personal use' : 'en utilisation personnelle' }}
      </p>

      <!-- Scroll areas are focusable, so they can be scrolled with the keyboard -->
      <div
        class="overflow-x-auto"
        tabindex="0"
        role="region"
        :aria-label="isEnglish ? 'Skills table' : 'Tableau des compétences'"
      >
        <div class="min-w-[500px] text-sm">
          <div class="htop-row bg-terminal font-bold text-on-primary">
            <span>PID</span>
            <span>{{ isEnglish ? 'COMMAND' : 'COMMANDE' }}</span>
            <span>{{ isEnglish ? 'USES' : 'USAGES' }}</span>
            <span>SRC</span>
            <span>{{ isEnglish ? 'SINCE' : 'DEPUIS' }}</span>
            <span>CAT</span>
          </div>
          <div
            class="max-h-[300px] overflow-y-auto"
            tabindex="0"
            role="region"
            :aria-label="isEnglish ? 'Skills list' : 'Liste des compétences'"
          >
            <div
              v-for="(skill, index) in visibleLinked"
              :key="skill.name"
              class="htop-row transition-colors hover:bg-primary/10"
            >
              <span class="text-gray-500">{{ 101 + index }}</span>
              <span class="break-words font-bold text-terminal">{{ skill.name }}</span>
              <span class="flex items-center gap-1.5" :title="usageDetail(skill)">
                <span class="relative h-2 flex-1 bg-terminal/10">
                  <span
                    class="absolute inset-y-0 left-0 bg-primary"
                    :style="{ width: `${(skill.uses / maxUses) * 100}%` }"
                  />
                </span>
                <span class="min-w-[1.6em] text-right tabular-nums text-terminal">{{ skill.uses }}</span>
              </span>
              <span
                class="grid grid-cols-4 text-center font-bold"
                :title="sourceLabels(skill)"
                :aria-label="sourceLabels(skill)"
              >
                <span
                  v-for="source in SOURCES"
                  :key="source.letter"
                  :class="skill.sources[source.key] ? 'text-terminal' : 'text-gray-600'"
                >{{ skill.sources[source.key] ? source.letter : '·' }}</span>
              </span>
              <span class="text-gray-500">{{ skill.since ?? '—' }}</span>
              <span class="text-xs text-gray-500">{{ skill.category }}</span>
            </div>
            <p v-if="!visibleLinked.length" class="px-1.5 py-1 text-gray-500">
              {{ isEnglish ? 'no running process' : 'aucun processus actif' }}
            </p>
          </div>
        </div>
      </div>

      <p class="mt-2 text-xs text-gray-500">
        SRC :
        <template v-for="(source, index) in SOURCES" :key="source.letter">
          <span class="font-bold text-terminal">{{ source.letter }}</span>
          {{ isEnglish ? source.en : source.fr }}<template v-if="index < SOURCES.length - 1">
            ·
          </template>
        </template>
      </p>

      <div v-if="visiblePersonal.length" class="mt-4 border-t border-dashed border-primary/25 pt-3 text-sm">
        <p class="mb-1 text-terminal">
          {{ isEnglish ? 'Personal use' : 'Utilisation personnelle' }} · {{ visiblePersonal.length }}
          <span class="text-gray-500">
            · {{ isEnglish ? 'not tied to a project, a job or my education yet' : 'pas encore reliées à un projet, une expérience ou ma formation' }}
          </span>
        </p>
        <p class="leading-relaxed text-gray-500">
          {{ visiblePersonal.map((skill) => skill.name).join(' · ') }}
        </p>
      </div>
    </template>
  </CyberpunkTerminalWindow>
</template>

<script setup lang="ts">
import {
  computed, onBeforeUnmount, onMounted, ref,
} from 'vue';

import { usePreferencesStore } from '../../stores/preferences';
import { useProjectsStore } from '../../stores/projects';
import { prefersReducedMotion } from '../../utils/motion';
import { firstYear } from '../../utils/years';
import CyberpunkTerminalWindow from './CyberpunkTerminalWindow.vue';

const preferencesStore = usePreferencesStore();
const projectsStore = useProjectsStore();

const isEnglish = computed(() => preferencesStore.isEnglish);
const projects = computed(() => projectsStore.getLocalizedProjects);
const experiences = computed(() => projectsStore.getLocalizedExperiences);
const skillCategories = computed(() => projectsStore.getLocalizedSkills);

type ProjectItem = (typeof projects.value)[number];
type ExperienceItem = (typeof experiences.value)[number];
type SourceKey = 'job' | 'internship' | 'freelance' | 'formation';

interface SkillRow {
  name: string;
  category: string;
  categoryIndex: number;
  projects: ProjectItem[];
  experiences: ExperienceItem[];
  sources: Record<SourceKey, boolean>;
  // Projects + jobs (permanent, internships, freelance) + the INSA education, which counts once.
  uses: number;
  since: number | null;
  linked: boolean;
}

// One fixed slot per source in the SRC column, like the permission bits of `ls -l`.
const SOURCES: { key: SourceKey; letter: string; fr: string; en: string }[] = [
  { key: 'job', letter: 'C', fr: 'CDI', en: 'permanent contract' },
  { key: 'internship', letter: 'S', fr: 'stage', en: 'internship' },
  { key: 'freelance', letter: 'F', fr: 'freelance', en: 'freelance' },
  { key: 'formation', letter: 'I', fr: 'formation INSA', en: 'INSA education' },
];

const activeCategory = ref<number | null>(null);

const rows = computed<SkillRow[]>(() => skillCategories.value.flatMap((category, categoryIndex) => category.skills.map((name) => {
  const usedIn = projects.value.filter((project) => project.technologies.includes(name));
  const jobs = experiences.value.filter((experience) => experience.technologies.includes(name));
  const fromFormation = projectsStore.formation.technologies.includes(name);
  const years = [
    ...usedIn.map((project) => firstYear(project.date)),
    ...jobs.map((experience) => firstYear(experience.localizedPeriod)),
  ].filter((year): year is number => year !== null);

  return {
    name,
    category: category.short ?? category.name,
    categoryIndex,
    projects: usedIn,
    experiences: jobs,
    sources: {
      job: jobs.some((experience) => !experience.internship && !experience.freelance),
      internship: jobs.some((experience) => experience.internship),
      freelance: jobs.some((experience) => experience.freelance),
      formation: fromFormation,
    },
    uses: usedIn.length + jobs.length + (fromFormation ? 1 : 0),
    since: years.length ? Math.min(...years) : null,
    linked: usedIn.length > 0 || jobs.length > 0 || fromFormation,
  };
})));

const byUsage = (a: SkillRow, b: SkillRow) => b.uses - a.uses
  || b.projects.length - a.projects.length
  || a.name.localeCompare(b.name);
const inCategory = (row: SkillRow) => activeCategory.value === null || row.categoryIndex === activeCategory.value;

const visibleLinked = computed(() => rows.value.filter((row) => row.linked && inCategory(row)).sort(byUsage));
const visiblePersonal = computed(() => rows.value.filter((row) => !row.linked && inCategory(row)));
const linkedCount = computed(() => rows.value.filter((row) => row.linked).length);
const maxUses = computed(() => Math.max(1, ...rows.value.map((row) => row.uses)));

const meters = computed(() => {
  const all = { index: null, label: isEnglish.value ? 'All' : 'Tout', items: rows.value };
  const perCategory = skillCategories.value.map((category, index) => ({
    index,
    label: category.short ?? category.name,
    items: rows.value.filter((row) => row.categoryIndex === index),
  }));
  return [all, ...perCategory].map(({ index, label, items }) => {
    const linked = items.filter((row) => row.linked).length;
    return {
      key: index ?? 'all', index, label, linked, total: items.length, ratio: items.length ? linked / items.length : 0,
    };
  });
});

const plural = (count: number, word: string) => `${count} ${word}${count > 1 ? 's' : ''}`;

// "3 projects · 2 jobs · INSA education": what the USES count is made of.
function usageDetail(skill: SkillRow) {
  const en = isEnglish.value;
  return [
    skill.projects.length ? plural(skill.projects.length, en ? 'project' : 'projet') : '',
    skill.experiences.length ? plural(skill.experiences.length, en ? 'job' : 'expérience') : '',
    skill.sources.formation ? (en ? 'INSA education' : 'formation INSA') : '',
  ].filter(Boolean).join(' · ');
}

function sourceLabels(skill: SkillRow) {
  const labels = SOURCES.filter((source) => skill.sources[source.key]).map((source) => (isEnglish.value ? source.en : source.fr));
  if (labels.length) return labels.join(' · ');
  return isEnglish.value ? 'projects only' : 'projets uniquement';
}

function filterCategory(index: number | null) {
  activeCategory.value = index === null || activeCategory.value === index ? null : index;
}

// The category meters fill one after the other the first time they scroll into view, and
// their counters roll up with them. null: filled (server render, reduced motion, done).
const METER_DURATION = 600;
const METER_STAGGER = 90;
const meterGrid = ref<HTMLElement | null>(null);
const meterClock = ref<number | null>(null);
let meterObserver: IntersectionObserver | null = null;
let meterFrame = 0;

// Share of the meter drawn, 0 to 1, eased out.
function meterFill(index: number) {
  if (meterClock.value === null) return 1;
  const progress = Math.min(1, Math.max(0, (meterClock.value - index * METER_STAGGER) / METER_DURATION));
  return 1 - (1 - progress) ** 3;
}

function playMeters() {
  // A short wait: the htop window is still rising into place (v-reveal).
  const start = performance.now() + 250;
  const end = METER_DURATION + METER_STAGGER * (meters.value.length - 1);
  const tick = (now: number) => {
    meterClock.value = now - start;
    if (meterClock.value < end) {
      meterFrame = requestAnimationFrame(tick);
    } else {
      meterClock.value = null;
    }
  };
  meterFrame = requestAnimationFrame(tick);
}

onMounted(() => {
  const grid = meterGrid.value;
  if (!grid || !('IntersectionObserver' in window) || prefersReducedMotion()) return;
  // Already on screen: leave the meters as they are.
  if (grid.getBoundingClientRect().top < window.innerHeight) return;

  meterClock.value = 0;
  meterObserver = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    meterObserver?.disconnect();
    playMeters();
  }, { threshold: 0.6 });
  meterObserver.observe(grid);
});

onBeforeUnmount(() => {
  meterObserver?.disconnect();
  cancelAnimationFrame(meterFrame);
});
</script>

<style scoped>
.htop-row {
  display: grid;
  grid-template-columns: 3em minmax(7.5em, 1.3fr) minmax(5.5em, 1fr) 4.8em 3.6em 4.6em;
  gap: 10px;
  align-items: center;
  padding: 3px 6px;
}
</style>
