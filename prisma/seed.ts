import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create ADMIN user
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ceibus.com' },
    update: {},
    create: {
      email: 'admin@ceibus.com',
      password_hash: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create USER
  const userPassword = await bcrypt.hash('User123!', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@ceibus.com' },
    update: {},
    create: {
      email: 'user@ceibus.com',
      password_hash: userPassword,
      role: 'USER',
    },
  });
  console.log('✅ User created:', user.email);

  // Create products
  const products = [
    {
      name: 'Laptop Gaming',
      price_cents: 150000, // $1,500.00
      stock: 10,
      is_active: true,
    },
    {
      name: 'Mouse Inalámbrico',
      price_cents: 2500, // $25.00
      stock: 50,
      is_active: true,
    },
    {
      name: 'Teclado Mecánico',
      price_cents: 8000, // $80.00
      stock: 25,
      is_active: true,
    },
  ];

  for (const productData of products) {
    const existingProduct = await prisma.product.findFirst({
      where: { name: productData.name },
    });
    
    if (!existingProduct) {
      const product = await prisma.product.create({
        data: productData,
      });
      console.log('✅ Product created:', product.name);
    } else {
      console.log('⚠️ Product already exists:', productData.name);
    }
  }

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
