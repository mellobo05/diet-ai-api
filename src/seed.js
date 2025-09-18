import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

function parseCsvSimple(csvText) {
  const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length === 0) return [];
  const header = lines[0].split(',').map(h => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row = {};
    header.forEach((key, idx) => {
      row[key] = (values[idx] ?? '').trim();
    });
    rows.push(row);
  }
  return rows;
}

async function seedDemoUser() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: { email: 'demo@example.com', name: 'Demo User' }
  });
  console.log('Seeded user', user);
}

async function seedProductsFromCsv() {
  const csvPath = path.join(process.cwd(), 'data', 'products.csv');
  if (!fs.existsSync(csvPath)) {
    console.log('No CSV found at', csvPath, '- skipping product seed');
    return;
  }
  const csvText = fs.readFileSync(csvPath, 'utf8');
  const records = parseCsvSimple(csvText);
  if (records.length === 0) {
    console.log('CSV has no records - skipping');
    return;
  }

  let createdCount = 0;
  for (const rec of records) {
    const price = parseFloat(rec.price ?? '0');
    const discountPct = parseFloat(rec.discountPct ?? '0');
    const finalPrice = price * (1 - (isNaN(discountPct) ? 0 : discountPct) / 100);

    await prisma.product.upsert({
      where: { externalId: rec.externalId || null },
      update: {
        title: rec.title,
        description: rec.description || null,
        category: rec.category || null,
        price: isNaN(price) ? 0 : price,
        discountPct: isNaN(discountPct) ? 0 : discountPct,
        finalPrice,
        calories: rec.calories ? parseInt(rec.calories, 10) : null,
        proteinGrams: rec.proteinGrams ? parseFloat(rec.proteinGrams) : null,
        fatGrams: rec.fatGrams ? parseFloat(rec.fatGrams) : null,
        carbsGrams: rec.carbsGrams ? parseFloat(rec.carbsGrams) : null,
        keywords: (rec.keywords || '').split('|').filter(Boolean),
        isDiet: rec.isDiet ? rec.isDiet.toLowerCase() === 'true' : null
      },
      create: {
        externalId: rec.externalId || null,
        title: rec.title,
        description: rec.description || null,
        category: rec.category || null,
        price: isNaN(price) ? 0 : price,
        discountPct: isNaN(discountPct) ? 0 : discountPct,
        finalPrice,
        calories: rec.calories ? parseInt(rec.calories, 10) : null,
        proteinGrams: rec.proteinGrams ? parseFloat(rec.proteinGrams) : null,
        fatGrams: rec.fatGrams ? parseFloat(rec.fatGrams) : null,
        carbsGrams: rec.carbsGrams ? parseFloat(rec.carbsGrams) : null,
        keywords: (rec.keywords || '').split('|').filter(Boolean),
        isDiet: rec.isDiet ? rec.isDiet.toLowerCase() === 'true' : null
      }
    });
    createdCount += 1;
  }

  console.log(`Seeded ${createdCount} products from CSV`);
}

async function main() {
  await seedDemoUser();
  await seedProductsFromCsv();
}

main().finally(async () => {
  await prisma.$disconnect();
});