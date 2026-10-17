// Same in both languages, built from the English file name: "polis.html" -> "project-polis".
// Used as the URL hash of the open project and as the id of its folder in the explorer.
export function projectAnchor(project: { file: { en: string } }): string {
  return `project-${project.file.en.replace(/\.[^.]+$/, '')}`;
}
