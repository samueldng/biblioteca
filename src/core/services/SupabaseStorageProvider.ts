import { StorageProvider, UploadInput } from "@/core/services/StorageProvider";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = "book-covers";

export class SupabaseStorageProvider implements StorageProvider {
  async upload({ buffer, filename, contentType }: UploadInput) {
    const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filename}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": contentType,
        // upsert avoids 409 if same filename is re-uploaded
        "x-upsert": "true",
      },
      body: buffer,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Supabase Storage upload failed (${response.status}): ${error}`);
    }

    // Public URL for the uploaded object
    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filename}`;
  }
}
