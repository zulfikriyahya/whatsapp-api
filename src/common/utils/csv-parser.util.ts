export function parseCsvContacts(
  csvText: string,
): Array<{ name: string; number: string; tag?: string }> {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  return lines
    .slice(1)
    .map((line) => {
      const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
      const obj: any = {};
      headers.forEach((h, i) => (obj[h] = values[i] || ""));
      return {
        name: obj.name || "",
        number: obj.number || obj.phone || "",
        tag: obj.tag || "",
      };
    })
    .filter((c) => c.number);
}
