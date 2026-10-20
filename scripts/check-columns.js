const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const cols = await prisma.$queryRawUnsafe(`
    SELECT column_name, data_type, udt_name 
    FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name IN ('transferPrice', 'cardPrice', 'hasVariants', 'sizes', 'colors')
  `);
  console.log('Columns definition:');
  console.log(cols);

  const sample = await prisma.$queryRawUnsafe(`
    SELECT id, name, price, "transferPrice", "cardPrice", "hasVariants", sizes, colors
    FROM products
    WHERE "publicadoWeb" = true
    LIMIT 5
  `);
  console.log('Sample products:');
  console.log(JSON.stringify(sample, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
