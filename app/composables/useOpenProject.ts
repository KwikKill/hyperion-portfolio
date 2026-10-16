import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import { usePreferencesStore } from '../stores/preferences';
import { useProjectsStore } from '../stores/projects';

// Opens a project's page the way the terminal's `open` command does:
// scroll to the projects section and show the project modal.
export function useOpenProject() {
  const preferencesStore = usePreferencesStore();
  const projectsStore = useProjectsStore();
  const { selectedProject } = storeToRefs(projectsStore);

  // The project modal would end up under a full-screen terminal window.
  const canOpenProject = computed(() => !preferencesStore.isAnyFullScreen);

  function openProject(file: string) {
    if (!canOpenProject.value) return false;
    const project = projectsStore.getLocalizedProjects.find((item) => item.localizedFile === file);
    if (!project) return false;

    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    selectedProject.value = project;
    return true;
  }

  return { canOpenProject, openProject };
}
