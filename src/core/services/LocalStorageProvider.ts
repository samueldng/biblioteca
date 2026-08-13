import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { StorageProvider, UploadInput } from "@/core/services/StorageProvider";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "books");
const PUBLIC_PREFIX = "/uploads/books";

export class LocalStorageProvider implements StorageProvider {
  async upload({ buffer, filename }: UploadInput) {
    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(path.join(UPLOAD_DIR, filename), buffer);
    return `${PUBLIC_PREFIX}/${filename}`;
  }
}
