/**
 * Seed script — populates 12 sample food products across 4 categories.
 * Run: npm run db:seed
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const products = [
  // ── Snacks ────────────────────────────────────────────────────────────────
  {
    name: 'Himalayan Pink Salt Popcorn',
    description:
      'Light and airy popcorn seasoned with Himalayan pink salt. A guilt-free snack that satisfies your crunch cravings without artificial flavours.',
    price: 4.99,
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=600&q=80',
    stock: 150,
    category: 'Snacks',
    isActive: true,
  },
  {
    name: 'Mixed Nut Trail Mix',
    description:
      'A premium blend of roasted almonds, cashews, walnuts, and dried cranberries. Packed with protein, healthy fats, and natural energy.',
    price: 8.49,
    imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&q=80',
    stock: 200,
    category: 'Snacks',
    isActive: true,
  },
  {
    name: 'Organic Kale Chips',
    description:
      'Crispy, nutrient-rich kale chips baked to perfection with a light dusting of nutritional yeast and sea salt. Vegan & gluten-free.',
    price: 6.29,
    imageUrl: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=600&q=80',
    stock: 5,
    category: 'Snacks',
    isActive: true,
  },

  // ── Beverages ─────────────────────────────────────────────────────────────
  {
    name: 'Cold-Pressed Green Juice',
    description:
      'A refreshing blend of spinach, cucumber, celery, apple, and lemon. Cold-pressed to retain maximum nutrients and enzymes.',
    price: 7.99,
    imageUrl: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=600&q=80',
    stock: 80,
    category: 'Beverages',
    isActive: true,
  },
  {
    name: 'Kombucha Ginger Lemon',
    description:
      'Naturally fermented kombucha with a zesty ginger-lemon kick. Rich in probiotics and B vitamins to support gut health.',
    price: 5.49,
    imageUrl: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&q=80',
    stock: 60,
    category: 'Beverages',
    isActive: true,
  },
  {
    name: 'Organic Coconut Water',
    description:
      'Pure, naturally hydrating coconut water sourced from young green coconuts. No added sugar, no preservatives — just nature.',
    price: 3.99,
    imageUrl: 'https://images.unsplash.com/photo-1550411294-5f5f7e6e3b9e?w=600&q=80',
    stock: 0,
    category: 'Beverages',
    isActive: true,
  },

  // ── Dairy ─────────────────────────────────────────────────────────────────
  {
    name: 'Artisan Greek Yogurt',
    description:
      'Thick, creamy Greek yogurt made from whole milk using traditional straining methods. High protein, low sugar, perfect for breakfast or snacks.',
    price: 5.99,
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
    stock: 40,
    category: 'Dairy',
    isActive: true,
  },
  {
    name: 'Aged Cheddar Cheese Block',
    description:
      'A sharp, full-flavoured cheddar aged for 12 months. Sourced from grass-fed cows on small family farms. Perfect for cheeseboards or melting.',
    price: 11.99,
    imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&q=80',
    stock: 30,
    category: 'Dairy',
    isActive: true,
  },
  {
    name: 'Farm Fresh Free-Range Eggs',
    description:
      'One dozen eggs from free-range hens raised on organic feed. Rich golden yolks, superior flavour, and certified humane.',
    price: 6.49,
    imageUrl: 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=600&q=80',
    stock: 100,
    category: 'Dairy',
    isActive: true,
  },

  // ── Bakery ────────────────────────────────────────────────────────────────
  {
    name: 'Sourdough Country Loaf',
    description:
      'Slow-fermented for 24 hours for complex flavour and a perfectly chewy crumb. Made with organic stone-ground flour — baked fresh daily.',
    price: 9.99,
    imageUrl: 'https://images.unsplash.com/photo-1568471173242-461f0a730452?w=600&q=80',
    stock: 20,
    category: 'Bakery',
    isActive: true,
  },
  {
    name: 'Blueberry Bran Muffins (6-Pack)',
    description:
      'Wholesome muffins packed with wild blueberries and wheat bran. Lightly sweetened with pure maple syrup. Great for on-the-go mornings.',
    price: 7.49,
    imageUrl: 'https://images.unsplash.com/photo-1558303271-0d83cad12668?w=600&q=80',
    stock: 35,
    category: 'Bakery',
    isActive: true,
  },
  {
    name: 'Almond Croissants',
    description:
      'Buttery, flaky French-style croissants filled with luscious almond frangipane and topped with toasted almond flakes. A true morning indulgence.',
    price: 4.29,
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80',
    stock: 3,
    category: 'Bakery',
    isActive: true,
  },
];

async function main() {
  console.log('🌱  Seeding products…');

  // Clear existing products
  await prisma.product.deleteMany({});
  console.log('   Cleared existing products.');

  // Insert all
  const created = await prisma.product.createMany({ data: products });
  console.log(`✅  Created ${created.count} products.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
