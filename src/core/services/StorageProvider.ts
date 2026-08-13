export interface UploadInput {
  buffer: Buffer;
  filename: string;
  contentType: string;
}

// Contrato de armazenamento: hoje implementado localmente (public/uploads),
// amanhã basta plugar uma implementação para S3 (ou outro bucket) sem tocar
// nas regras de negócio que o consomem.
export interface StorageProvider {
  upload(input: UploadInput): Promise<string>;
}
