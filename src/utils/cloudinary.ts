import cloudinary from "cloudinary";
import { ENV } from "../config/env.config";

const cloud = cloudinary.v2;

cloud.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  resource_type?: string;
}

// Local type — avoids Express.Multer.File namespace issues
interface UploadFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

export const extractPublicId = (url: string | undefined): string | null => {
  if (!url) return null;
  const matches = url.match(/\/v\d+\/(.+?)\./);
  return matches?.[1] ?? null;
};

export const deleteFromCloudinary = async (
  publicId: string | null,
): Promise<void> => {
  if (!publicId) return;
  try {
    await cloud.uploader.destroy(publicId);
    console.log(`Deleted from Cloudinary: ${publicId}`);
  } catch (error) {
    console.error(`Failed to delete ${publicId} from Cloudinary:`, error);
  }
};

export const uploadToCloudinary = async (
  file: UploadFile,
  folder: "avatars" | "resumes" = "avatars",
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloud.uploader.upload_stream(
      {
        folder: `devadmin/${folder}`,
        resource_type: "auto",
        access_mode: "public",
        transformation:
          folder === "avatars"
            ? [{ width: 500, height: 500, crop: "fill", quality: "auto" }]
            : undefined,
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Upload failed"));
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          resource_type: result.resource_type,
        });
      },
    );
    uploadStream.end(file.buffer);
  });
};
