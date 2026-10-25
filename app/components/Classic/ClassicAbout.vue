<template>
  <section id="about" class="bg-white py-20 dark:bg-gray-800">
    <div class="container mx-auto px-4">
      <h2 class="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
        {{ isEnglish ? 'About Me' : 'À Propos de Moi' }}
      </h2>

      <div class="mb-16 grid grid-cols-1 gap-10 md:grid-cols-1">
        <div class="rounded-lg bg-gray-50 p-8 shadow-md dark:bg-gray-700">
          <h3 class="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            {{ isEnglish ? 'Who I Am ?' : 'Qui Suis-Je ?' }}
          </h3>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            <template v-if="isEnglish">
              I'm a software engineer at Sopra Steria and a freelance web developer from France, passionate about web development and software engineering. I
              love creating innovative solutions to complex problems and continuously learning new technologies.
            </template>
            <template v-else>
              Ingénieur informatique chez Sopra Steria et développeur web freelance, passionné par le développement web et l'ingénierie logicielle.
              J'apprécie la technologie et apprendre de nouvelles choses.
            </template>
          </p>
          <p class="text-gray-700 dark:text-gray-300">
            <template v-if="isEnglish">
              When I'm not coding, you can find me exploring new technologies, or expanding my knowledge in various
              computer science domains.
              <br/>
              Apart from these subjects, I enjoy video games, films and books (mainly science fiction), board games,
              role-playing games and Greek mythology.
              <br/>
              I also played table tennis in a club for 5 years.
            </template>
            <template v-else>
              Quand je ne code pas, vous pouvez me trouver en train d'explorer de nouvelles technologies, ou d'élargir
              mes connaissances dans divers domaines de l'informatique.
              <br/>
              En dehors de ces sujets, j'apprécie les jeux vidéo, les films et les livres (principalement la
              science-fiction), les jeux de société, les jeux de rôles et la mythologie grecque.
              <br/>
              J'ai également fait 5 ans de tennis de table en club.
            </template>
          </p>
        </div>

        <div class="rounded-lg bg-gray-50 p-8 shadow-md dark:bg-gray-700">
          <h3 class="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            {{ isEnglish ? 'Skills & Technologies' : 'Compétences & Technologies' }}
          </h3>

          <!-- Current stack: the tools of the job and of the freelance activity, and where they are used -->
          <h4 class="text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            {{ isEnglish ? 'Current stack' : 'Stack actuelle' }}
          </h4>
          <ul class="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            <li v-for="tool in stack" :key="tool.name" class="rounded-md bg-white p-3 shadow-sm dark:bg-gray-800">
              <span class="block font-semibold text-gray-900 dark:text-white">{{ tool.name }}</span>
              <span class="mt-0.5 block text-sm text-gray-600 dark:text-gray-400">{{ tool.where }}</span>
            </li>
          </ul>

          <!-- Skills used at least twice, by category, the most used first -->
          <h4 class="mt-8 text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            {{ isEnglish ? 'Used in projects' : 'Utilisées en projet' }}
          </h4>
          <dl class="mt-3 space-y-3">
            <div v-for="category in usedCategories" :key="category.name" class="sm:grid sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-4">
              <dt class="mb-1 text-sm font-medium text-blue-600 sm:mb-0 sm:pt-1 dark:text-blue-300">
                {{ category.name }}
              </dt>
              <dd class="flex flex-wrap items-start gap-2">
                <span
                  v-for="skill in category.used"
                  :key="skill"
                  class="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {{ skill }}
                </span>
              </dd>
            </div>
          </dl>

          <!-- The rest, folded, in the same layout as above -->
          <details class="group mt-8" @toggle="onOthersToggle">
            <!-- A centred button; blue-300 on this card's grey, where blue-400 lacks contrast -->
            <summary
              class="mx-auto flex w-fit cursor-pointer list-none items-center gap-2 rounded-md border border-blue-600 px-5 py-2.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 dark:border-blue-300 dark:text-blue-300 dark:hover:bg-blue-900/30 [&::-webkit-details-marker]:hidden"
            >
              <template v-if="othersOpen">
                {{ isEnglish ? 'Hide the other skills' : 'Masquer les autres compétences' }}
              </template>
              <template v-else>
                {{ isEnglish ? `Show the ${otherCount} other skills` : `Voir les ${otherCount} autres compétences` }}
              </template>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-4 transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </summary>
            <dl class="mt-4 space-y-3">
              <div v-for="category in otherCategories" :key="category.name" class="sm:grid sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-4">
                <dt class="mb-1 text-sm font-medium text-blue-600 sm:mb-0 sm:pt-1 dark:text-blue-300">
                  {{ category.name }}
                </dt>
                <dd class="flex flex-wrap items-start gap-2">
                  <span
                    v-for="skill in category.others"
                    :key="skill"
                    class="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {{ skill }}
                  </span>
                </dd>
              </div>
            </dl>
          </details>
        </div>
      </div>

      <!-- Associations Section -->
      <div class="mt-12 rounded-lg bg-gray-50 p-8 shadow-md dark:bg-gray-700">
        <h3 class="mb-6 text-center text-2xl font-semibold text-gray-900 dark:text-white">
          {{ isEnglish ? 'Associations & Involvement' : 'Associations & Engagement' }}
        </h3>

        <p class="mx-auto mb-6 max-w-3xl text-gray-700 dark:text-gray-300">
          <template v-if="isEnglish">
            Being actively involved in associations has been a significant part of my life. I have been an active member
            of several student and technology-focused organizations. These experiences have allowed me to develop
            skills in project management, teamwork, and event organization.
          </template>
          <template v-else>
            L'associatif étant une part importante de ma vie, j'ai été membre actif de plusieurs associations étudiantes
            et technologiques. Ces expériences m'ont permis de développer des compétences en gestion de projet, en
            travail d'équipe et en organisation d'événements.
          </template>
        </p>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(role, index) in associationRoles"
            :key="index"
            class="rounded-md bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800"
          >
            <div class="font-medium text-blue-600 dark:text-blue-400">
              {{ role.title }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ role.period }}
            </div>
          </div>
        </div>
      </div>

      <!-- Freelance Section -->
      <div class="mt-12 rounded-lg bg-gray-50 p-8 shadow-md dark:bg-gray-700">
        <h3 class="mb-6 text-center text-2xl font-semibold text-gray-900 dark:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="mr-2 inline-block size-6 text-blue-600 dark:text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {{ isEnglish ? 'Freelance Work' : 'Travail en Freelance' }}
        </h3>

        <p class="mx-auto mb-6 max-w-3xl text-center text-gray-700 dark:text-gray-300">
          <template v-if="isEnglish">
            Needing a website?
            <br/>
            Access my complete service catalog and get a personalized quote.
          </template>
          <template v-else>
            Besoin d'un site web ?
            <br/>
            Accédez à mon catalogue complet de services et obtenez un devis personnalisé.
          </template>
        </p>

        <div class="text-center">
          <a
            href="https://freelance.somi.blaisot.org"
            class="inline-block rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {{ isEnglish ? 'View My Freelance Work' : 'Voir Mon Travail en Freelance' }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import { useProfile } from '../../composables/useProfile';
import { usePreferencesStore } from '../../stores/preferences';
import { useProjectsStore } from '../../stores/projects';

const preferencesStore = usePreferencesStore();
const projectsStore = useProjectsStore();
const {
  projects, job, freelance, currentStack, usesOf,
} = useProfile();

const isEnglish = computed(() => preferencesStore.isEnglish);
const skills = computed(() => projectsStore.getLocalizedSkills);

// Used at least this often (projects, jobs, education): listed one by one, else folded
const LISTED_FROM = 2;

// Each tool of the current stack, with where it is used
const stack = computed(() => currentStack.value.map((name) => {
  const en = isEnglish.value;
  const count = projects.value.filter((project) => project.technologies.includes(name)).length;
  const where = [
    job.value?.technologies.includes(name) ? (en ? 'Permanent job' : 'CDI') : '',
    freelance.value?.technologies.includes(name) ? 'Freelance' : '',
    count ? `${count} ${en ? 'project' : 'projet'}${count > 1 ? 's' : ''}` : '',
  ].filter(Boolean).join(' · ');
  return { name, where };
}));

// The other skills of each category: used often enough to be listed, or only mentioned
const categories = computed(() => {
  const inStack = new Set(currentStack.value);
  return skills.value.map((category) => {
    const rest = category.skills.filter((skill) => !inStack.has(skill));
    const uses = new Map(rest.map((skill) => [skill, usesOf(skill)]));
    const usesOfSkill = (skill: string) => uses.get(skill) ?? 0;
    return {
      name: category.name,
      used: rest.filter((skill) => usesOfSkill(skill) >= LISTED_FROM)
        .sort((a, b) => usesOfSkill(b) - usesOfSkill(a) || a.localeCompare(b)),
      others: rest.filter((skill) => usesOfSkill(skill) < LISTED_FROM).sort((a, b) => a.localeCompare(b)),
    };
  });
});
const usedCategories = computed(() => categories.value.filter((category) => category.used.length));
const otherCategories = computed(() => categories.value.filter((category) => category.others.length));
const otherCount = computed(() => otherCategories.value.reduce((count, category) => count + category.others.length, 0));

// The folded list's button says whether it shows or hides them
const othersOpen = ref(false);
function onOthersToggle(event: Event) {
  othersOpen.value = (event.target as HTMLDetailsElement).open;
}

const associationRoles = computed(() => {
  if (isEnglish.value) {
    return [
      { title: 'Development Manager INSALAN', period: '2023-2025' },
      { title: 'Volunteer Secur\'INSA', period: '2023-2024' },
      { title: 'Treasurer Night Fury', period: '2023-2024' },
      { title: 'Development Manager Night Fury', period: '2022-2023' },
      { title: 'E-sport LoL Manager Night Fury', period: '2021-2022' },
      { title: 'Volunteer FOG', period: '2021' },
    ];
  }
  return [
    { title: 'Responsable Développement INSALAN', period: '2023-2025' },
    { title: 'Bénévole Secur\'INSA', period: '2023-2024' },
    { title: 'Trésorier Night Fury', period: '2023-2024' },
    { title: 'Responsable Développement Night Fury', period: '2022-2023' },
    { title: 'Responsable E-sport LoL Night Fury', period: '2021-2022' },
    { title: 'Bénévole FOG', period: '2021' },
  ];
});
</script>
