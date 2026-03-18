import * as PDFDocument from "pdfkit";

export function generatePdf(
  title: string,
  rows: Record<string, any>[],
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const chunks: Buffer[] = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(18).text(title, { align: "center" }).moveDown();
    doc.fontSize(10);

    if (rows.length) {
      const keys = Object.keys(rows[0]);
      const colW = Math.floor((doc.page.width - 80) / keys.length);

      keys.forEach((k, i) => {
        doc.text(k, 40 + i * colW, doc.y, {
          width: colW,
          continued: i < keys.length - 1,
        });
      });
      doc.moveDown(0.5);

      rows.forEach((row) => {
        const y = doc.y;
        keys.forEach((k, i) => {
          doc.text(String(row[k] ?? ""), 40 + i * colW, y, {
            width: colW,
            continued: i < keys.length - 1,
          });
        });
        doc.moveDown(0.3);
      });
    }
    doc.end();
  });
}
