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
    const pdfPath = await generateReportPdf(content, context, source, result, reasoning, to);

    // Selecciona el bucket.
    const bucket = clientGoogle.bucket("fairplay360-reports");
    const destination = `reports/${to}/${Date.now()}.pdf`;

    // Sube el archivo al bucket.
    const [uploadedFile] = await bucket.upload(pdfPath, {
      destination,
      gzip: true, // Opcional: comprime el archivo
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });

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


function wrapText(text: string, maxWidth: number, font: any, fontSize: number): string[] {
  // Remplaza saltos de línea por espacios
  const sanitizedText = sanitizeText(text.replace(/\n/g, " "));
  const words = sanitizedText.split(" ");
  const lines: string[] = [];
  let currentLine = "";
  for (let word of words) {
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
  reasoning: string,
  to: string
): Promise<string> {
  // Crear el documento PDF
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 10;

  const marginLeft = 50;
  const marginRight = 150; 
  const marginTop = 25;
  const availableWidth = width - marginLeft - marginRight;

  const headerMarginRight = 50;
  const headerAvailableWidth = width - marginLeft - headerMarginRight;

  const logoPath = path.join(process.cwd(), "public", "logo-no-bg.png");
  const logoBytes = fs.readFileSync(logoPath);
  const logoImage = await pdfDoc.embedPng(logoBytes);
  const logoScale = 0.1;
  const logoDims = logoImage.scale(logoScale);
  const logoX = width - marginRight - logoDims.width;
  page.drawImage(logoImage, {
    x: logoX,
    y: height - marginTop - logoDims.height,
    width: logoDims.width,
    height: logoDims.height,
  });

  const gap = 3;
  const logoText = "Fairplay360";
  page.drawText(logoText, {
    x: logoX + logoDims.width + gap,
    y: height - marginTop - logoDims.height + (logoDims.height - 20) / 2,
    size: 20,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  let y = height - marginTop - logoDims.height - 40;

  function drawWrappedText(
    text: string,
    startY: number,
    fontUsed: any,
    size: number,
    availWidth: number
  ): number {
    const lines = wrapText(text, availWidth, fontUsed, size);
    for (const line of lines) {
      if (startY < marginTop + 50) {
        page = pdfDoc.addPage();
        startY = page.getHeight() - marginTop;
      }
      page.drawText(line, {
        x: marginLeft,
        y: startY,
        size: size,
        font: fontUsed,
        color: rgb(0, 0, 0),
      });
      startY -= size + 5;
    }
    return startY;
  }

  const headerParagraph = `Dear ${to},
Thank you for submitting your report. 
We have successfully received your report and our advanced AI system has thoroughly analyzed the provided information. 
We take these matters very seriously and will review your report promptly.
Sincerely,
The Fairplay360 Team`;

  const headerLines = headerParagraph.split("\n");
  for (const line of headerLines) {
    const trimmed = line.trim();
    let usedFont = font;
    let usedSize = fontSize;
    if (trimmed.startsWith("Dear") || trimmed === "The Fairplay360 Team") {
      usedFont = fontBold;
      usedSize = fontSize;
    }
    y = drawWrappedText(line, y, usedFont, usedSize, headerAvailableWidth);
    y -= 3; //espacio extra entre párrafos en el heading
  }
  const fields = [
    { label: "Content", value: content },
    { label: "Context", value: context },
    { label: "Source", value: source },
    { label: "Result", value: result },
    { label: "Reasoning", value: reasoning },
  ];
    y-=30;
  for (const field of fields) {
    if (field.value.trim() !== "") {
      const headerSize = fontSize + 2;
      y = drawWrappedText(field.label, y, fontBold, headerSize, availableWidth);
      y -= 10;
      y = drawWrappedText(field.value, y, font, fontSize, availableWidth);
      y -= 20;
    }
  }

  // Guarda el PDF en bytes y lo escribe en un archivo temporal.
  const pdfBytes = await pdfDoc.save();
  /*
  * ----VERCEL---
  */ 
  const tempFilePath = path.join("/tmp", `temp_report_${Date.now()}.pdf`);
  /* ---LOCAL---
  * const tempFilePath = path.join(process.cwd(), `temp_report_${Date.now()}.pdf`);
  */
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
    await transporter.sendMail({
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
