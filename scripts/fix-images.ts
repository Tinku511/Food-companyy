import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const updates = [
  { name: 'Himalayan Pink Salt Popcorn', imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=600&q=80' },
  { name: 'Mixed Nut Trail Mix', imageUrl: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=600&q=80' },
  { name: 'Organic Kale Chips', imageUrl: 'https://images.unsplash.com/photo-1616405612684-6f48b9ae2e4a?w=600&q=80' },
  { name: 'Roasted Chickpeas', imageUrl: 'https://images.unsplash.com/photo-1506917728037-b6af01a7d403?w=600&q=80' },
  { name: 'Dark Chocolate Almonds', imageUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600&q=80' },
  { name: 'Cold-Pressed Green Juice', imageUrl: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=600&q=80' },
  { name: 'Kombucha Ginger Lemon', imageUrl: 'https://images.unsplash.com/photo-1463797221720-6b07e6426c24?w=600&q=80' },
  { name: 'Organic Coconut Water', imageUrl: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&q=80' },
  { name: 'Matcha Green Tea Powder', imageUrl: 'https://images.unsplash.com/photo-1582793988951-9aed550c69d8?w=600&q=80' },
  { name: 'Sparkling Berry Elixir', imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&q=80' },
  { name: 'Artisan Greek Yogurt', imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80' },
  { name: 'Aged Cheddar Cheese Block', imageUrl: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=600&q=80' },
  { name: 'Farm Fresh Free-Range Eggs', imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&q=80' },
  { name: 'Organic Whole Milk', imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80' },
  { name: 'Artisanal Cultured Butter', imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&q=80' },
  { name: 'Sourdough Country Loaf', imageUrl: 'https://images.unsplash.com/photo-1574085733277-851d9d856a3a?w=600&q=80' },
  { name: 'Blueberry Bran Muffins (6-Pack)', imageUrl: 'https://images.unsplash.com/photo-1558303271-0d83cad12668?w=600&q=80' },
  { name: 'Almond Croissants', imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80' },
  { name: 'Gluten-Free Banana Bread', imageUrl: 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=600&q=80' },
  { name: 'Organic French Baguette', imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&q=80' },
  { name: 'Extra Virgin Olive Oil', imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80' },
  { name: 'Raw Wildflower Honey', imageUrl: 'https://images.unsplash.com/photo-1587049352847-8d4e8941b958?w=600&q=80' },
  { name: 'Organic Quinoa', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=600&q=80' },
  { name: 'Artisan Pasta - Fusilli', imageUrl: 'https://images.unsplash.com/photo-1509482560494-4126f8225994?w=600&q=80' },
  { name: 'Himalayan Sea Salt', imageUrl: 'https://images.unsplash.com/photo-1616172671520-da3e30206fa1?w=600&q=80' },
  { name: 'Organic Hass Avocados', imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&q=80' },
  { name: 'Heirloom Tomatoes', imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80' },
  { name: 'Organic Strawberries', imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&q=80' },
  { name: 'Baby Spinach Leaves', imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80' },
  { name: 'Sweet Potatoes', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80' },
];

async function main() {
  console.log('🔄  Refreshing product image URLs...');
  let count = 0;
  for (const u of updates) {
    const result = await prisma.product.updateMany({
      where: { name: u.name },
      data: { imageUrl: u.imageUrl },
    });
    if (result.count > 0) {
      console.log(`  ✅  Updated: ${u.name}`);
      count++;
    }
  }
  console.log(`\n✅  Done. Updated ${count} products.`);
}

main()
  .catch((e) => { console.error('❌ Failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
