import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const email = 'admin@example.com';
  const password = 'adminpassword123';
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: 'ADMIN', passwordHash },
    create: {
      email,
      name: 'Super Admin',
      role: 'ADMIN',
      passwordHash,
    },
  });

  console.log('Admin seeded:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
