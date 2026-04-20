import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const services = [
  {
    slug: "box-braids",
    nameFr: "Box Braids",
    nameEn: "Box Braids",
    nameDe: "Box Braids",
    descFr: "Tresses individuelles classiques, disponibles en différentes tailles et longueurs. Un style protecteur intemporel.",
    descEn: "Classic individual braids, available in various sizes and lengths. A timeless protective style.",
    descDe: "Klassische Einzelzöpfe in verschiedenen Größen und Längen. Ein zeitloser Schutzstil.",
    priceMin: 80,
    priceMax: 120,
    durationMin: 180,
    durationMax: 360,
    order: 0,
  },
  {
    slug: "cornrows",
    nameFr: "Cornrows",
    nameEn: "Cornrows",
    nameDe: "Cornrows",
    descFr: "Tresses plaquées près du cuir chevelu en lignes droites ou motifs créatifs. Élégant et polyvalent.",
    descEn: "Braids close to the scalp in straight lines or creative patterns. Elegant and versatile.",
    descDe: "Zöpfe nah an der Kopfhaut in geraden Linien oder kreativen Mustern. Elegant und vielseitig.",
    priceMin: 50,
    priceMax: 100,
    durationMin: 120,
    durationMax: 240,
    order: 1,
  },
  {
    slug: "twists",
    nameFr: "Twists",
    nameEn: "Twists",
    nameDe: "Twists",
    descFr: "Vanilles classiques ou passion twists. Un style doux et naturel qui protège vos cheveux.",
    descEn: "Classic two-strand twists or passion twists. A soft, natural style that protects your hair.",
    descDe: "Klassische Zweisträhnen-Twists oder Passion Twists. Ein weicher, natürlicher Schutzstil.",
    priceMin: 70,
    priceMax: 110,
    durationMin: 150,
    durationMax: 300,
    order: 2,
  },
  {
    slug: "locs",
    nameFr: "Locs",
    nameEn: "Locs",
    nameDe: "Locs",
    descFr: "Faux locs ou locs au crochet pour un look naturel et tendance. Installation soignée et durable.",
    descEn: "Faux locs or crochet locs for a natural, trendy look. Careful and long-lasting installation.",
    descDe: "Faux Locs oder Häkel-Locs für einen natürlichen, trendigen Look. Sorgfältige und langlebige Installation.",
    priceMin: 80,
    priceMax: 120,
    durationMin: 180,
    durationMax: 360,
    order: 3,
  },
  {
    slug: "crochet",
    nameFr: "Crochet",
    nameEn: "Crochet",
    nameDe: "Häkelzöpfe",
    descFr: "Installation rapide au crochet avec différentes textures. Léger et confortable.",
    descEn: "Quick crochet installation with various textures. Lightweight and comfortable.",
    descDe: "Schnelle Häkelinstallation mit verschiedenen Texturen. Leicht und bequem.",
    priceMin: 50,
    priceMax: 90,
    durationMin: 90,
    durationMax: 180,
    order: 4,
  },
  {
    slug: "men",
    nameFr: "Coiffures Hommes",
    nameEn: "Men's Styles",
    nameDe: "Herrenfrisuren",
    descFr: "Cornrows, twists et tresses pour hommes. Des styles nets et modernes.",
    descEn: "Cornrows, twists and braids for men. Clean and modern styles.",
    descDe: "Cornrows, Twists und Zöpfe für Herren. Saubere und moderne Stile.",
    priceMin: 40,
    priceMax: 80,
    durationMin: 60,
    durationMax: 180,
    order: 5,
  },
];

async function main() {
  console.log("Seeding services...");

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
    console.log(`  -> ${service.slug}`);
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
