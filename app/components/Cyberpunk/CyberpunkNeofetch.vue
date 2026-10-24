<template>
  <CyberpunkTerminalWindow>
    <template #title>
      NEOFETCH
    </template>

    <template #body>
      <div class="mb-4">
        <span class="text-secondary">kwikkill@hyperion:~$</span>
        <span class="ml-2 text-primary">neofetch</span>
      </div>

      <div class="mb-4 grid gap-4 lg:grid-cols-[110px_minmax(0,1fr)]">
        <img src="@/assets/logo.png" alt="" loading="lazy" decoding="async" class="neofetch-logo size-24"/>

        <div>
          <div class="font-bold">
            <span class="text-primary">kwikkill</span><span class="text-secondary">@</span><span class="text-primary">hyperion</span>
          </div>
          <div class="mb-2 mt-1 leading-none text-gray-500" aria-hidden="true">
            -----------------
          </div>

          <dl class="text-sm">
            <div
              v-for="row in rows"
              :key="row.label"
              class="grid grid-cols-[8.5em_minmax(0,1fr)] gap-2 leading-relaxed"
            >
              <dt class="font-bold text-primary">
                {{ row.label }}
              </dt>
              <dd class="break-words text-terminal">
                {{ row.value }}
              </dd>
            </div>
          </dl>

          <!-- Theme palette, like neofetch's colour blocks -->
          <div class="mt-3 flex" aria-hidden="true">
            <span v-for="color in colors" :key="color" class="h-3.5 w-6" :class="color"/>
          </div>
        </div>
      </div>

      <div class="mb-4">
        <span class="text-secondary">kwikkill@hyperion:~$</span>
        <span class="ml-2 text-primary">{{ isEnglish ? 'cat profile.txt' : 'cat profil.txt' }}</span>
      </div>
      <p class="leading-relaxed text-terminal">
        {{ bio }}
      </p>
    </template>
  </CyberpunkTerminalWindow>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { useProfile } from '../../composables/useProfile';
import { usePreferencesStore } from '../../stores/preferences';
import { useProjectsStore } from '../../stores/projects';
import CyberpunkTerminalWindow from './CyberpunkTerminalWindow.vue';

const preferencesStore = usePreferencesStore();
const projectsStore = useProjectsStore();
const {
  projects, skills, job, internshipCount, sinceYear, formation, dailyTools,
} = useProfile();

const isEnglish = computed(() => preferencesStore.isEnglish);
const skillCategories = computed(() => projectsStore.getLocalizedSkills);
const school = computed(() => formation.value.school);

const colors = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-terminal', 'bg-hover', 'bg-text'];

const rows = computed(() => {
  const en = isEnglish.value;
  const company = job.value?.company ?? '';
  const years = new Date().getFullYear() - sinceYear.value;
  const featured = projects.value.filter((project) => project.starred).length;

  return [
    { label: en ? 'Role' : 'Rôle', value: en ? `Software engineer · ${company} (permanent)` : `Ingénieur logiciel · ${company} (CDI)` },
    { label: en ? 'Location' : 'Lieu', value: 'Rennes, France' },
    { label: en ? 'Education' : 'Formation', value: school.value },
    { label: 'Uptime', value: en ? `${years} years of projects (since ${sinceYear.value})` : `${years} ans de projets (depuis ${sinceYear.value})` },
    {
      label: en ? 'Projects' : 'Projets',
      value: en ? `${projects.value.length} published · ${featured} featured` : `${projects.value.length} publiés · ${featured} mis en avant`,
    },
    { label: en ? 'Daily' : 'Au quotidien', value: dailyTools.value.join(' · ') },
    {
      label: en ? 'Packages' : 'Paquets',
      value: en
        ? `${skills.value.length} skills · ${skillCategories.value.length} categories`
        : `${skills.value.length} compétences · ${skillCategories.value.length} catégories`,
    },
    { label: en ? 'Users' : 'Utilisateurs', value: en ? '600+ RankUp · 1,000+ Insaplace' : '600+ RankUp · 1 000+ Insaplace' },
    { label: en ? 'Ranking' : 'Classement', value: en ? '4th / 42 · Break the Code' : '4e / 42 · Break the Code' },
  ];
});

const bio = computed(() => {
  const company = job.value?.company ?? '';
  return isEnglish.value
    ? `Software engineer at ${company} in Rennes, I build web applications end to end. I trained at ${school.value}, `
      + `then went through ${internshipCount.value} internships, a freelance activity and ${projects.value.length} projects `
      + `published since ${sinceYear.value}.`
    : `Ingénieur logiciel chez ${company} à Rennes, je conçois des applications web de bout en bout. Formé à l'${school.value}, `
      + `j'ai enchaîné ${internshipCount.value} stages, une activité freelance et ${projects.value.length} projets `
      + `publiés depuis ${sinceYear.value}.`;
});
</script>

<style scoped>
.neofetch-logo {
  filter: drop-shadow(0 0 10px rgb(var(--color-primary) / 0.45));
}
</style>
