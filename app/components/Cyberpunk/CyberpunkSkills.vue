<template>
  <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
    <!-- htop: every skill as a process, linked to the projects, jobs and education that use it -->
    <CyberpunkTerminalWindow class="lg:col-span-2">
      <template #title>
        {{ isEnglish ? 'SKILLS.EXE — htop' : 'COMPETENCES.EXE — htop' }}
      </template>

      <template #body>
        <div class="mb-4">
          <span class="text-secondary">kwikkill@hyperion:~$</span>
          <span class="ml-2 text-primary">htop --tree=categories</span>
        </div>

        <!-- Category meters, which also filter the list -->
        <div class="mb-3 grid gap-x-5 gap-y-1 sm:grid-cols-2">
          <button
            v-for="meter in meters"
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
                <span class="absolute inset-y-0 left-0 bg-terminal" :style="{ width: `${meter.ratio * 100}%` }"/>
              </span>]
            </span>
            <span class="text-right tabular-nums text-terminal">{{ meter.linked }}/{{ meter.total }}</span>
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

        <div class="overflow-x-auto">
          <div class="min-w-[500px] text-sm">
            <div class="htop-row bg-terminal font-bold text-black">
              <span>PID</span>
              <span>{{ isEnglish ? 'COMMAND' : 'COMMANDE' }}</span>
              <span>{{ isEnglish ? 'USES' : 'USAGES' }}</span>
              <span>SRC</span>
              <span>{{ isEnglish ? 'SINCE' : 'DEPUIS' }}</span>
              <span>CAT</span>
            </div>
            <!-- Rows are keyed: selecting one only changes classes, so the list keeps its scroll -->
            <div class="max-h-[300px] overflow-y-auto">
              <button
                v-for="(skill, index) in visibleLinked"
                :key="skill.name"
                type="button"
                class="htop-row w-full text-left transition-colors"
                :class="selected?.name === skill.name ? 'bg-secondary/30' : 'hover:bg-primary/10'"
                :aria-pressed="selected?.name === skill.name"
                @click="selectSkill(skill.name)"
              >
                <span class="text-gray-500">{{ 101 + index }}</span>
                <span class="break-words font-bold" :class="selected?.name === skill.name ? 'text-primary' : 'text-terminal'">
                  {{ skill.name }}
                </span>
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
              </button>
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
            <template v-for="(skill, index) in visiblePersonal" :key="skill.name">
              <button
                type="button"
                class="transition-colors hover:text-terminal hover:underline"
                :class="{ 'text-terminal underline': selected?.name === skill.name }"
                :aria-pressed="selected?.name === skill.name"
                @click="selectSkill(skill.name)"
              >
                {{ skill.name }}
              </button><template v-if="index < visiblePersonal.length - 1">
                ·
              </template>
            </template>
          </p>
        </div>
      </template>
    </CyberpunkTerminalWindow>

    <!-- ps: where the selected skill is used. On large screens it takes the htop's height. -->
    <CyberpunkTerminalWindow fill-height>
      <template #title>
        PS — {{ selected?.name }}
      </template>

      <template #body>
        <div v-if="selected" class="flex min-h-0 flex-1 flex-col">
          <div class="mb-3">
            <span class="text-secondary">kwikkill@hyperion:~$</span>
            <span class="ml-2 break-all text-primary">ps aux | grep -i {{ selected.name.toLowerCase() }}</span>
          </div>

          <template v-if="selected.linked">
            <div class="max-h-[60vh] min-h-0 flex-1 overflow-y-auto text-sm lg:max-h-none lg:min-h-48">
              <div
                v-for="project in selected.projects"
                :key="project.localizedFile"
                class="flex justify-between gap-3 border-b border-primary/10 py-1"
              >
                <button
                  type="button"
                  class="break-all text-left text-terminal transition-colors hover:text-terminal-hover hover:underline"
                  @click="open(project.localizedFile)"
                >
                  {{ project.localizedFile }}
                </button>
                <span class="shrink-0 text-gray-500">{{ project.date }}</span>
              </div>
              <div
                v-for="experience in selected.experiences"
                :key="experience.localizedTitle"
                class="flex justify-between gap-3 border-b border-primary/10 py-1"
              >
                <span class="text-secondary">{{ experienceLabel(experience) }}</span>
                <span class="shrink-0 text-gray-500">{{ firstYear(experience.localizedPeriod) }}</span>
              </div>
              <div v-if="selected.sources.formation" class="flex justify-between gap-3 border-b border-primary/10 py-1">
                <span class="text-secondary">{{ school }}</span>
                <span class="shrink-0 text-gray-500">{{ isEnglish ? 'education' : 'formation' }}</span>
              </div>
            </div>
            <p class="mt-3 text-xs text-gray-500">
              {{ summary }}
            </p>
          </template>
          <p v-else class="leading-relaxed text-terminal">
            {{ isEnglish
              ? 'Personal use: not tied to a project, a job or my education yet.'
              : 'Utilisation personnelle : pas encore reliée à un projet, une expérience ou ma formation.' }}
          </p>

          <!-- Echo of the `open` command, as in the hero terminal -->
          <div v-if="openedFile" class="mt-4">
            <div class="mb-1">
              <span class="text-secondary">kwikkill@hyperion:~$</span>
              <span class="ml-2 text-primary">open {{ fileStem(openedFile) }}</span>
            </div>
            <p :class="openFailed ? 'text-red-400' : 'text-terminal'">
              {{ openMessage }}
            </p>
          </div>
        </div>
      </template>
    </CyberpunkTerminalWindow>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import { useOpenProject } from '../../composables/useOpenProject';
import { usePreferencesStore } from '../../stores/preferences';
import { useProjectsStore } from '../../stores/projects';
import { firstYear } from '../../utils/years';
import CyberpunkTerminalWindow from './CyberpunkTerminalWindow.vue';

const preferencesStore = usePreferencesStore();
const projectsStore = useProjectsStore();
const { openProject } = useOpenProject();

const isEnglish = computed(() => preferencesStore.isEnglish);
const projects = computed(() => projectsStore.getLocalizedProjects);
const experiences = computed(() => projectsStore.getLocalizedExperiences);
const skillCategories = computed(() => projectsStore.getLocalizedSkills);
const school = computed(() => projectsStore.formation.school);

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
const selectedName = ref<string | null>(null);
const openedFile = ref<string | null>(null);
const openFailed = ref(false);

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

const selected = computed(() => rows.value.find((row) => row.name === selectedName.value)
  ?? visibleLinked.value[0]
  ?? visiblePersonal.value[0]
  ?? null);

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

const summary = computed(() => {
  const skill = selected.value;
  if (!skill) return '';
  const en = isEnglish.value;
  const parts = [
    usageDetail(skill),
    skill.since ? (en ? `since ${skill.since}` : `depuis ${skill.since}`) : '',
    skill.projects.length ? (en ? 'click a project to open it' : 'cliquez sur un projet pour ouvrir sa fiche') : '',
  ];
  return parts.filter(Boolean).join(' · ');
});

const openMessage = computed(() => {
  if (openFailed.value) {
    return isEnglish.value ? 'Exit full screen to open the project.' : 'Quittez le plein écran pour ouvrir la fiche.';
  }
  return isEnglish.value ? `Opening ${openedFile.value}…` : `Ouverture de ${openedFile.value}…`;
});

function sourceLabels(skill: SkillRow) {
  const labels = SOURCES.filter((source) => skill.sources[source.key]).map((source) => (isEnglish.value ? source.en : source.fr));
  if (labels.length) return labels.join(' · ');
  return isEnglish.value ? 'projects only' : 'projets uniquement';
}

function experienceLabel(experience: ExperienceItem) {
  if (experience.freelance) return 'Freelance';
  if (experience.internship) return `${experience.company} (${isEnglish.value ? 'internship' : 'stage'})`;
  return `${experience.company} (${isEnglish.value ? 'permanent' : 'CDI'})`;
}

const fileStem = (file: string) => file.replace(/\.[^.]+$/, '');

function selectSkill(name: string) {
  selectedName.value = name;
  openedFile.value = null;
}

function filterCategory(index: number | null) {
  activeCategory.value = index === null || activeCategory.value === index ? null : index;
  selectedName.value = null;
  openedFile.value = null;
}

function open(file: string) {
  openedFile.value = file;
  openFailed.value = !openProject(file);
}
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
