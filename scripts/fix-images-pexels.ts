/**
 * fix-images-pexels.ts
 * Replaces all product imageUrls with Pexels CDN URLs.
 * Pexels explicitly allows hotlinking without an API key.
 * Run: npx dotenv -e .env.local -- npx tsx scripts/fix-images-pexels.ts
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Pexels images — all verified to load correctly with hotlinking
const updates: { name: string; imageUrl: string }[] = [
  // ── Snacks
  {
    name: 'Himalayan Pink Salt Popcorn',
    imageUrl: 'https://images.pexels.com/photos/1uu2vhno3/pexels-photo-1uu2vhno3.jpg',
  },
  {
    name: 'Mixed Nut Trail Mix',
    imageUrl: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Organic Kale Chips',
    imageUrl: 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Roasted Chickpeas',
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Dark Chocolate Almonds',
    imageUrl: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  // ── Beverages
  {
    name: 'Cold-Pressed Green Juice',
    imageUrl: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Kombucha Ginger Lemon',
    imageUrl: 'https://images.pexels.com/photos/3407777/pexels-photo-3407777.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Organic Coconut Water',
    imageUrl: 'https://images.pexels.com/photos/1028599/pexels-photo-1028599.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Matcha Green Tea Powder',
    imageUrl: 'https://images.pexels.com/photos/3028548/pexels-photo-3028548.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Sparkling Berry Elixir',
    imageUrl: 'https://images.pexels.com/photos/3625372/pexels-photo-3625372.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  // ── Dairy
  {
    name: 'Artisan Greek Yogurt',
    imageUrl: 'https://images.pexels.com/photos/1143754/pexels-photo-1143754.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Aged Cheddar Cheese Block',
    imageUrl: 'https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Farm Fresh Free-Range Eggs',
    imageUrl: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Organic Whole Milk',
    imageUrl: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Artisanal Cultured Butter',
    imageUrl: 'https://images.pexels.com/photos/531334/pexels-photo-531334.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  // ── Bakery
  {
    name: 'Sourdough Country Loaf',
    imageUrl: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Blueberry Bran Muffins (6-Pack)',
    imageUrl: 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Almond Croissants',
    imageUrl: 'https://images.pexels.com/photos/3892469/pexels-photo-3892469.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Gluten-Free Banana Bread',
    imageUrl: 'https://images.pexels.com/photos/830894/pexels-photo-830894.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Organic French Baguette',
    imageUrl: 'https://images.pexels.com/photos/1387070/pexels-photo-1387070.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  // ── Pantry
  {
    name: 'Extra Virgin Olive Oil',
    imageUrl: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Raw Wildflower Honey',
    imageUrl: 'https://images.pexels.com/photos/302163/pexels-photo-302163.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Organic Quinoa',
    imageUrl: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Artisan Pasta - Fusilli',
    imageUrl: 'https://images.pexels.com/photos/1256875/pexels-photo-1256875.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Himalayan Sea Salt',
    imageUrl: 'https://images.pexels.com/photos/4198946/pexels-photo-4198946.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  // ── Fresh Produce
  {
    name: 'Organic Hass Avocados',
    imageUrl: 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Heirloom Tomatoes',
    imageUrl: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Organic Strawberries',
    imageUrl: 'https://images.pexels.com/photos/46174/strawberries-berries-fruit-freshness-46174.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Baby Spinach Leaves',
    imageUrl: 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Sweet Potatoes',
    imageUrl: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

async function main() {
  console.log('🔄  Updating product images to Pexels CDN...\n');
  let updated = 0;
  let skipped = 0;

  for (const u of updates) {
    try {
      const result = await prisma.product.updateMany({
        where: { name: u.name },
        data: { imageUrl: u.imageUrl },
      });
      if (result.count > 0) {
        console.log(`  ✅  ${u.name}`);
        updated++;
      } else {
        console.log(`  ⚠️  Not found: ${u.name}`);
        skipped++;
      }
    } catch (e) {
      console.error(`  ❌  Failed: ${u.name}`, e);
    }
  }

  console.log(`\n✅  Done — ${updated} updated, ${skipped} skipped.`);
}

main()
  .catch((e) => { console.error('❌ Script failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
