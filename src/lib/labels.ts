export const BOOK_STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "Disponível",
  COMING_SOON: "Em breve",
  BORROWED: "Emprestado",
  MAINTENANCE_LOST: "Indisponível",
};

export const BOOK_STATUS_TONE: Record<string, "green" | "amber" | "red" | "zinc" | "violet"> = {
  AVAILABLE: "green",
  COMING_SOON: "violet",
  BORROWED: "amber",
  MAINTENANCE_LOST: "red",
};

export const LOAN_STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Em andamento",
  RETURNED_ON_TIME: "Devolvido em dia",
  RETURNED_LATE: "Devolvido com atraso",
  LOST: "Extraviado",
};

export const LOAN_STATUS_TONE: Record<string, "green" | "amber" | "red" | "zinc" | "violet"> = {
  ACTIVE: "amber",
  RETURNED_ON_TIME: "green",
  RETURNED_LATE: "red",
  LOST: "red",
};

export const COURSE_LABEL: Record<string, string> = {
  ELETROTECNICA: "Eletrotécnica",
  REFRIGERACAO: "Refrigeração",
  ZOOTECNIA: "Zootecnia",
  OUTROS: "Outros",
};
