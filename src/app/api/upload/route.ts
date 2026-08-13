import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { LocalStorageProvider } from "@/core/services/LocalStorageProvider";
import { requireAdmin } from "@/lib/api-guard";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    const extension = ALLOWED_TYPES[file.type];
    if (!extension) {
      return NextResponse.json(
        { error: "Formato não suportado. Envie JPG, PNG ou WEBP." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Arquivo maior que 5MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${randomUUID()}.${extension}`;

    const storage = new LocalStorageProvider();
    const url = await storage.upload({ buffer, filename, contentType: file.type });

    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    console.error("[UPLOAD_ERROR]", error);
    return NextResponse.json({ error: "Erro ao enviar arquivo." }, { status: 500 });
  }
}
