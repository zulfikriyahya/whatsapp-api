export function replacePlaceholders(
  template: string,
  data: { name?: string; date?: string; [key: string]: string },
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => data[key] ?? `{${key}}`);
}
