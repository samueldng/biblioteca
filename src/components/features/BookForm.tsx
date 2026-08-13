"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ImagePlus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface Category {
  id: string;
  name: string;
}

const NEW_CATEGORY_VALUE = "__new__";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "AVAILABLE", label: "Disponível" },
  { value: "COMING_SOON", label: "Em breve" },
  { value: "MAINTENANCE_LOST", label: "Indisponível" },
];

export function BookForm({ categories: initialCategories }: { categories: Category[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState(initialCategories);
  const [categoryValue, setCategoryValue] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleCoverChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setCoverFile(file);
    setCoverPreview(file ? URL.createObjectURL(file) : null);
  }

  function clearCover() {
    setCoverFile(null);
    setCoverPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function ensureCategoryId(): Promise<string | null> {
    if (categoryValue !== NEW_CATEGORY_VALUE) return categoryValue || null;

    if (!newCategoryName.trim()) {
      toast.error("Digite o nome da nova categoria.");
      return null;
    }

    const response = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategoryName.trim() }),
    });

    const result = await response.json();
    if (!response.ok) {
      toast.error(result.error ?? "Erro ao criar categoria.");
      return null;
    }

    setCategories((prev) => [...prev, result].sort((a, b) => a.name.localeCompare(b.name)));
    setCategoryValue(result.id);
    setNewCategoryName("");
    return result.id as string;
  }

  async function uploadCover(): Promise<string | undefined> {
    if (!coverFile) return undefined;

    const formData = new FormData();
    formData.append("file", coverFile);

    const response = await fetch("/api/upload", { method: "POST", body: formData });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error ?? "Erro ao enviar a capa.");
    }

    return result.url as string;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const categoryId = await ensureCategoryId();
      if (!categoryId) {
        setIsSubmitting(false);
        return;
      }

      const coverUrl = await uploadCover();

      const payload = {
        title: formData.get("title"),
        author: formData.get("author"),
        categoryId,
        isbn: formData.get("isbn") || undefined,
        publisher: formData.get("publisher") || undefined,
        year: formData.get("year") || undefined,
        synopsis: formData.get("synopsis") || undefined,
        status: formData.get("status") || undefined,
        coverUrl,
      };

      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error ?? "Erro ao cadastrar a obra.");
        return;
      }

      toast.success(`"${result.title}" cadastrada com sucesso.`);
      form.reset();
      setCategoryValue("");
      clearCover();
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro inesperado.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
    >
      <h2 className="text-lg font-semibold text-white">Cadastrar nova obra</h2>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-col items-center gap-2">
          <label
            htmlFor="cover-upload"
            className="group relative flex h-40 w-28 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50 transition-colors hover:border-violet-500"
          >
            {coverPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverPreview} alt="Pré-visualização da capa" className="h-full w-full object-cover" />
            ) : (
              <ImagePlus className="h-6 w-6 text-zinc-600 transition-colors group-hover:text-violet-400" />
            )}
          </label>
          <input
            ref={fileInputRef}
            id="cover-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleCoverChange}
            className="hidden"
          />
          {coverPreview && (
            <button
              type="button"
              onClick={clearCover}
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-red-400"
            >
              <X className="h-3 w-3" /> remover
            </button>
          )}
        </div>

        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
          <Input name="title" placeholder="Título *" required />
          <Input name="author" placeholder="Autor *" required />

          <div className="flex flex-col gap-2">
            <Select
              value={categoryValue}
              onChange={(event) => setCategoryValue(event.target.value)}
              required
            >
              <option value="" disabled>
                Categoria *
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
              <option value={NEW_CATEGORY_VALUE}>+ Nova categoria...</option>
            </Select>

            {categoryValue === NEW_CATEGORY_VALUE && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-2"
              >
                <Input
                  value={newCategoryName}
                  onChange={(event) => setNewCategoryName(event.target.value)}
                  placeholder="Nome da nova categoria"
                  className="flex-1"
                />
              </motion.div>
            )}
          </div>

          <Select name="status" defaultValue="AVAILABLE">
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Input name="isbn" placeholder="ISBN" />
          <Input name="publisher" placeholder="Editora" />
          <Input name="year" type="number" placeholder="Ano" />
        </div>
      </div>

      <textarea
        name="synopsis"
        placeholder="Sinopse"
        rows={3}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-white shadow-inner placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
      />

      <Button type="submit" disabled={isSubmitting} className="self-start">
        <Plus className="h-4 w-4" />
        {isSubmitting ? "Salvando..." : "Cadastrar obra"}
      </Button>
    </motion.form>
  );
}
