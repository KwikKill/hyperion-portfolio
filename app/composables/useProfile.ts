import { computed } from 'vue';

import type { LocalizedExperience } from '../models/experience';
import { usePreferencesStore } from '../stores/preferences';
import { useProjectsStore } from '../stores/projects';
import { firstYear } from '../utils/years';

// Part of any web work, so not worth listing among the daily tools.
const BASICS = ['HTML', 'CSS', 'JavaScript'];

// Facts about the profile computed from the store, shared by the cyberpunk neofetch and the
// classic hero, so both follow the career as it changes.
export function useProfile() {
  const preferencesStore = usePreferencesStore();
  const projectsStore = useProjectsStore();

  const projects = computed(() => projectsStore.getLocalizedProjects);
  const experiences = computed(() => projectsStore.getLocalizedExperiences);
  const skills = computed(() => projectsStore.getLocalizedSkills.flatMap((category) => category.skills));

  // The current permanent job, and the freelance activity
  const job = computed(() => experiences.value.find((experience) => !experience.internship && !experience.freelance));
  const freelance = computed(() => experiences.value.find((experience) => experience.freelance));
  const internshipCount = computed(() => experiences.value.filter((experience) => experience.internship).length);
  const sinceYear = computed(() => Math.min(...projects.value.map((project) => firstYear(project.date) ?? Infinity)));

  const formation = computed(() => projectsStore.formation);
  const degree = computed(() => projectsStore.formation.degree[preferencesStore.lang]);

  // Technologies of an experience that appear among the skills, without the web basics
  function toolsOf(experience: LocalizedExperience | undefined) {
    return (experience?.technologies ?? []).filter((tech) => skills.value.includes(tech) && !BASICS.includes(tech));
  }

  const dailyTools = computed(() => toolsOf(job.value).slice(0, 4));

  return {
    projects, experiences, skills, job, freelance, internshipCount, sinceYear, formation, degree, toolsOf, dailyTools,
  };
}
