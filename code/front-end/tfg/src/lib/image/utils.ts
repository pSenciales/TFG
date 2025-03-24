import cloudinary from "cloudinary";
import streamifier from "streamifier";
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImageBuffer = async (buffer: Buffer): Promise<string> => {
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
