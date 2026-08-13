import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Senha inicial = data de nascimento no formato DDMMAAAA (o aluno pode trocar depois).
function birthDateToInitialPassword(birthDate: Date) {
  const day = String(birthDate.getUTCDate()).padStart(2, "0");
  const month = String(birthDate.getUTCMonth() + 1).padStart(2, "0");
  const year = birthDate.getUTCFullYear();
  return `${day}${month}${year}`;
}

const CATEGORIES = [
  "Literatura",
  "Técnico - Eletrotécnica",
  "Técnico - Refrigeração e Climatização",
  "Técnico - Zootecnia",
  "Didático",
  "Outros",
];

async function main() {
  const categories = await Promise.all(
    CATEGORIES.map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  const literatura = categories.find((c) => c.name === "Literatura")!;
  const eletrotecnica = categories.find(
    (c) => c.name === "Técnico - Eletrotécnica"
  )!;

  await prisma.book.upsert({
    where: { isbn: "9788535902778" },
    update: {},
    create: {
      title: "Dom Casmurro",
      author: "Machado de Assis",
      synopsis: "Clássico da literatura brasileira narrado por Bentinho.",
      isbn: "9788535902778",
      publisher: "Ática",
      year: 1899,
      categoryId: literatura.id,
      status: "AVAILABLE",
    },
  });

  await prisma.book.upsert({
    where: { isbn: "9788521618918" },
    update: {},
    create: {
      title: "Instalações Elétricas",
      author: "Julio Niskier",
      synopsis: "Fundamentos e normas de instalações elétricas prediais.",
      isbn: "9788521618918",
      publisher: "LTC",
      year: 2013,
      categoryId: eletrotecnica.id,
      status: "AVAILABLE",
    },
  });

  const studentBirthDate = new Date(Date.UTC(2008, 4, 20)); // 20/05/2008
  const studentPassword = birthDateToInitialPassword(studentBirthDate);

  await prisma.user.upsert({
    where: { matricula: "2024001" },
    update: {},
    create: {
      name: "Aluno Demonstração",
      matricula: "2024001",
      birthDate: studentBirthDate,
      hashedPassword: await bcrypt.hash(studentPassword, 10),
      role: "STUDENT",
      course: "ELETROTECNICA",
      turma: "3º Ano A",
    },
  });

  await prisma.user.upsert({
    where: { matricula: "admin" },
    update: {},
    create: {
      name: "Bibliotecário(a)",
      matricula: "admin",
      hashedPassword: await bcrypt.hash("iema@2026", 10),
      role: "ADMIN",
    },
  });

  console.log(`Seed concluído: ${categories.length} categorias.`);
  console.log(`Login aluno de teste -> matrícula: 2024001 | senha: ${studentPassword}`);
  console.log(`Login admin de teste -> matrícula: admin | senha: iema@2026`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
