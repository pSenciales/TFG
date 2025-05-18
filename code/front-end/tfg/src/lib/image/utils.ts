import cloudinary from "cloudinary";
import streamifier from "streamifier";
import vision from "@google-cloud/vision";
import { getGCPCredentials } from '@/lib/getGCPCredentials'; // ajusta la ruta si hace falta
import axios from "axios";

//Vercel:
const clientGoogle = new vision.v1.ImageAnnotatorClient(getGCPCredentials());

//Local:
//const clientGoogle = new vision.v1.ImageAnnotatorClient({key: process.env.GOOGLE_APPLICATION_CREDENTIALS});


cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});




export const uploadImageBuffer = async (file: File): Promise<string> => {

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: "ocr" },
      (error, result) => {
        if (error) {
          console.error("Error al subir la imagen:", error);
          return reject(error);
        }
        if (result && result.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(new Error("No se obtuvo la URL segura"));
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};


export const ocr = async (url: string): Promise<JSON> => {
  return new Promise(async (resolve, reject) => {
    try {
      const [result] = await clientGoogle.textDetection(url);
      const annotations = result.textAnnotations;

      const filteredAnnotations = annotations && annotations.length > 0
        ? {
          locale: annotations[0].locale,
          description: annotations[0].description,
        }
        : {};

      resolve(filteredAnnotations as JSON);
    } catch (error) {
      console.error("Error en OCR:", error);
      reject(error);
    }
  });
};


export const caption = async (url: string): Promise<string> => {
  try {
    const { data } = await axios.post(
      "https://fairplay360-image-caption.cognitiveservices.azure.com/vision/v3.2/describe?maxCandidates=1",
      { url: url }, 
      {
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.AZURE_VISION_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    const caps = data.description.captions;
    return caps.length > 0 ? caps[0].text : "";
  } catch (err) {
    console.error("❌ error calling HF image-to-text pipeline:", err);
    throw err;
  }
};



