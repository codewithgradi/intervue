import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.EXPO_PUBLIC_CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.EXPO_PUBLIC_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.EXPO_PUBLIC_R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToR2(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
): Promise<string> {
  const fileKey = `resumes/${Date.now()}-${fileName.replace(/\s+/g, "_")}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.EXPO_PUBLIC_R2_BUCKET_NAME!,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: mimeType,
    }),
  );

  // Returns the public URL of the uploaded resume file
  return `${process.env.EXPO_PUBLIC_R2_PUBLIC_URL}/${fileKey}`;
}
