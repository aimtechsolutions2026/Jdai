export async function uploadFileToCloudinary(
  buffer: Buffer,
  filename: string,
  folder: string = "resumes"
): Promise<{ url: string; publicId: string }> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    // If live Cloudinary keys are configured, upload via Cloudinary REST API
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const base64Data = `data:application/pdf;base64,${buffer.toString("base64")}`;
      
      const formData = new FormData();
      formData.append("file", base64Data);
      formData.append("upload_preset", "codifypro_resumes");
      formData.append("folder", folder);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (res.ok) {
        const json = await res.json();
        return { url: json.secure_url, publicId: json.public_id };
      }
    } catch (e) {
      console.warn("Cloudinary upload failed, falling back to local object:", e);
    }
  }

  // Fallback: create an in-app downloadable base64 data URI
  const mimeType = filename.endsWith(".pdf") ? "application/pdf" : "image/jpeg";
  const base64 = buffer.toString("base64");
  const dataUri = `data:${mimeType};base64,${base64}`;

  return {
    url: dataUri,
    publicId: `local-${Date.now()}-${filename}`,
  };
}

