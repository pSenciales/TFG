import fs from "fs";
import { PDFDocument, StandardFonts, rgb, PDFFont } from 'pdf-lib'
import { compileTemplate, initTransporter } from "@/lib/mail/utils"
import path from "path";
import { Storage } from "@google-cloud/storage";


import { getGCPCredentials } from "../getGCPCredentials";

//Vercel:
const clientGoogle = new Storage(getGCPCredentials());

//Local:
//const clientGoogle = new Storage({ keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS });


export async function generateAndUploadReport(
  content: string,
  context: string,
  source: string,
  result: string,
  reasoning: string,
  to: string
): Promise<string> {
  try {
    // Genera el PDF y obtiene la ruta del archivo temporal.
    const pdfPath = await generateReportPdf(content, context, source, result, reasoning);

    // Selecciona el bucket.
    const bucket = clientGoogle.bucket("fairplay360-reports");
    // Define el destino (por ejemplo, en la carpeta "reports").
    const destination = `reports/${to}/${Date.now()}.pdf`;

    // Sube el archivo al bucket.
    const [uploadedFile] = await bucket.upload(pdfPath, {
      destination,
      gzip: true, // Opcional: comprime el archivo
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });

    // Haz el archivo público (si es lo que deseas)
    await uploadedFile.makePublic();
    const publicUrl = uploadedFile.publicUrl();
    console.log("Upload success:", publicUrl);

    // Elimina el archivo temporal
    fs.unlinkSync(pdfPath);

    return publicUrl;
  } catch (error) {
    console.error("Error en generateAndUploadReport:", error);
    throw error;
  }
}


function sanitizeText(text: string): string {
  return text.replace(/[^\u0020-\u007E\u00A0-\u00FF]/g, "");
}

function wrapText(text: string, maxWidth: number, font: PDFFont, fontSize: number): string[] {
  // Reemplaza los saltos de línea por espacios
  const sanitizedText = sanitizeText(text.replace(/\n/g, " "));
  const words = sanitizedText.split(" ");
  const lines: string[] = [];
  let currentLine = "";
  for (const word of words) {
    const testLine = currentLine ? currentLine + " " + word : word;
    const testLineWidth = font.widthOfTextAtSize(testLine, fontSize);
    if (testLineWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

export async function generateReportPdf(
  content: string,
  context: string,
  source: string,
  result: string,
  reasoning: string
): Promise<string> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;

  const marginLeft = 50;
  const marginRight = 50;
  const availableWidth = width - marginLeft - marginRight;

  const logoPath = path.join(process.cwd(), "public", "logo-no-bg.png");
  const logoBytes = fs.readFileSync(logoPath);
  const logoImage = await pdfDoc.embedPng(logoBytes);

  const logoScale = 0.1;
  const logoDims = logoImage.scale(logoScale);

  // Dibuja el logo
  page.drawImage(logoImage, {
    x: marginLeft,
    y: height - marginLeft - logoDims.height,
    width: logoDims.width,
    height: logoDims.height,
  });

  // Ajusta el punto de partida para el texto: deja espacio para el logo
  let y = height - marginLeft - logoDims.height - 20;

  // Prepara los textos a incluir
  const textItems: string[] = [];
  textItems.push(`Content: ${content}`);
  if (context.trim() !== "") {
    textItems.push(`Context: ${context}`);
  }
  textItems.push(`Source: ${source}`);
  textItems.push(`Result: ${result}`);
  textItems.push(`Reasoning: ${reasoning}`);

  // Recorre cada ítem y dibuja el texto con wrapping
  for (const text of textItems) {
    const lines = wrapText(text, availableWidth, font, fontSize);
    for (const line of lines) {
      // Si se acaba el espacio vertical, añade nueva página
      if (y < marginLeft) {
        page = pdfDoc.addPage();
        y = page.getHeight() - marginLeft;
      }
      page.drawText(line, {
        x: marginLeft,
        y: y,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
      y -= fontSize + 5; // Ajusta el interlineado
    }
    y -= 10; // Espacio extra entre párrafos
  }

  // Guarda el PDF en bytes
  const pdfBytes = await pdfDoc.save();
  // Genera un nombre temporal
  const tempFilePath = path.join(process.cwd(), `temp_report_${Date.now()}.pdf`);
  fs.writeFileSync(tempFilePath, pdfBytes);
  return tempFilePath;
}

const subject = "Creación reporte en Fairplay360"
export default async function generateAndSendPDF(
  content: string,
  context: string,
  source: string,
  result: string,
  reasoning: string,
  to: string): Promise<string> {
  try {
    const linkToPDF = await generateAndUploadReport(content, context, source, result, reasoning, to);

    const html = compileTemplate("pdfReport", { name: to, result });

    const transporter = initTransporter();
    transporter.sendMail({
      from: `Fairplay360 <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments: [{
        filename: 'report.pdf',
        path: linkToPDF,
        contentType: 'application/pdf'
      }]
    }


    );
    return "success";
  } catch (error) {
    console.error("Error al generar y enviar el PDF: " + error);
    return "error";
  }
}
