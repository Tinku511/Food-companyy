/**
 * Seed script — populates sample food products across multiple categories.
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
    description: 'Light and airy popcorn seasoned with Himalayan pink salt. A guilt-free snack that satisfies your crunch cravings without artificial flavours.',
    price: 4.99,
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=600&q=80',
    stock: 150,
    category: 'Snacks',
    isActive: true,
  },
  {
    name: 'Mixed Nut Trail Mix',
    description: 'A premium blend of roasted almonds, cashews, walnuts, and dried cranberries. Packed with protein, healthy fats, and natural energy.',
    price: 8.49,
    imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&q=80',
    stock: 200,
    category: 'Snacks',
    isActive: true,
  },
  {
    name: 'Organic Kale Chips',
    description: 'Crispy, nutrient-rich kale chips baked to perfection with a light dusting of nutritional yeast and sea salt. Vegan & gluten-free.',
    price: 6.29,
    imageUrl: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=600&q=80',
    stock: 5,
    category: 'Snacks',
    isActive: true,
  },
  {
    name: 'Roasted Chickpeas',
    description: 'Crunchy roasted chickpeas with a hint of smoked paprika and sea salt. A high-protein snack for anytime.',
    price: 5.49,
    imageUrl: 'https://images.unsplash.com/photo-1564149504298-00c351fd7f16?w=600&q=80',
    stock: 80,
    category: 'Snacks',
    isActive: true,
  },
  {
    name: 'Dark Chocolate Almonds',
    description: 'Premium roasted almonds generously coated in 70% dark chocolate. The perfect balance of sweet and nutty.',
    price: 9.99,
    imageUrl: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&q=80',
    stock: 120,
    category: 'Snacks',
    isActive: true,
  },

  // ── Beverages ─────────────────────────────────────────────────────────────
  {
    name: 'Cold-Pressed Green Juice',
    description: 'A refreshing blend of spinach, cucumber, celery, apple, and lemon. Cold-pressed to retain maximum nutrients and enzymes.',
    price: 7.99,
    imageUrl: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=600&q=80',
    stock: 80,
    category: 'Beverages',
    isActive: true,
  },
  {
    name: 'Kombucha Ginger Lemon',
    description: 'Naturally fermented kombucha with a zesty ginger-lemon kick. Rich in probiotics and B vitamins to support gut health.',
    price: 5.49,
    imageUrl: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&q=80',
    stock: 60,
    category: 'Beverages',
    isActive: true,
  },
  {
    name: 'Organic Coconut Water',
    description: 'Pure, naturally hydrating coconut water sourced from young green coconuts. No added sugar, no preservatives — just nature.',
    price: 3.99,
    imageUrl: 'https://images.unsplash.com/photo-1550411294-5f5f7e6e3b9e?w=600&q=80',
    stock: 0,
    category: 'Beverages',
    isActive: true,
  },
  {
    name: 'Matcha Green Tea Powder',
    description: 'Ceremonial grade matcha powder imported directly from Uji, Japan. Rich in antioxidants and offers a calm energy boost.',
    price: 24.99,
    imageUrl: 'https://images.unsplash.com/photo-1582793988951-9aed550c69d8?w=600&q=80',
    stock: 45,
    category: 'Beverages',
    isActive: true,
  },
  {
    name: 'Sparkling Berry Elixir',
    description: 'A botanical sparkling water infused with wild berries and hibiscus. Zero calories and intensely refreshing.',
    price: 2.99,
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&q=80',
    stock: 300,
    category: 'Beverages',
    isActive: true,
  },

  // ── Dairy ─────────────────────────────────────────────────────────────────
  {
    name: 'Artisan Greek Yogurt',
    description: 'Thick, creamy Greek yogurt made from whole milk using traditional straining methods. High protein, low sugar, perfect for breakfast or snacks.',
    price: 5.99,
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
    stock: 40,
    category: 'Dairy',
    isActive: true,
  },
  {
    name: 'Aged Cheddar Cheese Block',
    description: 'A sharp, full-flavoured cheddar aged for 12 months. Sourced from grass-fed cows on small family farms. Perfect for cheeseboards or melting.',
    price: 11.99,
    imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&q=80',
    stock: 30,
    category: 'Dairy',
    isActive: true,
  },
  {
    name: 'Farm Fresh Free-Range Eggs',
    description: 'One dozen eggs from free-range hens raised on organic feed. Rich golden yolks, superior flavour, and certified humane.',
    price: 6.49,
    imageUrl: 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=600&q=80',
    stock: 100,
    category: 'Dairy',
    isActive: true,
  },
  {
    name: 'Organic Whole Milk',
    description: 'Creamy, rich, and naturally delicious whole milk from pasture-raised cows. Minimally processed to preserve natural goodness.',
    price: 4.99,
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80',
    stock: 50,
    category: 'Dairy',
    isActive: true,
  },
  {
    name: 'Artisanal Cultured Butter',
    description: 'Slow-churned butter made from cultured cream for a rich, complex, and tangy flavor profile. Excellent for baking and spreading.',
    price: 7.99,
    imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&q=80',
    stock: 25,
    category: 'Dairy',
    isActive: true,
  },

  // ── Bakery ────────────────────────────────────────────────────────────────
  {
    name: 'Sourdough Country Loaf',
    description: 'Slow-fermented for 24 hours for complex flavour and a perfectly chewy crumb. Made with organic stone-ground flour — baked fresh daily.',
    price: 9.99,
    imageUrl: 'https://images.unsplash.com/photo-1568471173242-461f0a730452?w=600&q=80',
    stock: 20,
    category: 'Bakery',
    isActive: true,
  },
  {
    name: 'Blueberry Bran Muffins (6-Pack)',
    description: 'Wholesome muffins packed with wild blueberries and wheat bran. Lightly sweetened with pure maple syrup. Great for on-the-go mornings.',
    price: 7.49,
    imageUrl: 'https://images.unsplash.com/photo-1558303271-0d83cad12668?w=600&q=80',
    stock: 35,
    category: 'Bakery',
    isActive: true,
  },
  {
    name: 'Almond Croissants',
    description: 'Buttery, flaky French-style croissants filled with luscious almond frangipane and topped with toasted almond flakes. A true morning indulgence.',
    price: 4.29,
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80',
    stock: 3,
    category: 'Bakery',
    isActive: true,
  },
  {
    name: 'Gluten-Free Banana Bread',
    description: 'Moist and delicious banana bread made with almond flour and walnuts. Perfectly sweetened with ripe bananas.',
    price: 8.99,
    imageUrl: 'https://images.unsplash.com/photo-1601314986756-324036573b9e?w=600&q=80',
    stock: 12,
    category: 'Bakery',
    isActive: true,
  },
  {
    name: 'Organic French Baguette',
    description: 'Classic Parisian style baguette with a crisp crust and airy interior. Baked fresh every morning.',
    price: 3.49,
    imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&q=80',
    stock: 40,
    category: 'Bakery',
    isActive: true,
  },

  // ── Pantry ────────────────────────────────────────────────────────────────
  {
    name: 'Extra Virgin Olive Oil',
    description: 'Cold-pressed extra virgin olive oil from early harvest olives. Notes of green grass, artichoke, and a peppery finish.',
    price: 18.99,
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80',
    stock: 65,
    category: 'Pantry',
    isActive: true,
  },
  {
    name: 'Raw Wildflower Honey',
    description: 'Unfiltered, unpasteurized honey harvested from local wildflower meadows. Contains natural pollen and enzymes.',
    price: 12.49,
    imageUrl: 'https://images.unsplash.com/photo-1587049352847-8d4e8941b958?w=600&q=80',
    stock: 85,
    category: 'Pantry',
    isActive: true,
  },
  {
    name: 'Organic Quinoa',
    description: 'Pre-washed, premium white quinoa. A versatile, high-protein super grain perfect for salads, bowls, and sides.',
    price: 6.99,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=600&q=80',
    stock: 110,
    category: 'Pantry',
    isActive: true,
  },
  {
    name: 'Artisan Pasta - Fusilli',
    description: 'Bronze-die extruded semolina pasta made in Italy. Its rough texture holds onto sauces perfectly.',
    price: 4.49,
    imageUrl: 'https://images.unsplash.com/photo-1551462147-37885acc36f1?w=600&q=80',
    stock: 150,
    category: 'Pantry',
    isActive: true,
  },
  {
    name: 'Himalayan Sea Salt',
    description: 'Pure pink salt mined from the ancient sea beds of the Himalayas. Rich in trace minerals.',
    price: 5.99,
    imageUrl: 'https://images.unsplash.com/photo-1616172671520-da3e30206fa1?w=600&q=80',
    stock: 200,
    category: 'Pantry',
    isActive: true,
  },

  // ── Fresh Produce ─────────────────────────────────────────────────────────
  {
    name: 'Organic Hass Avocados',
    description: 'Creamy, rich, and perfectly ripe Hass avocados. Ideal for toast, guacamole, or salads.',
    price: 3.99,
    imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&q=80',
    stock: 60,
    category: 'Fresh Produce',
    isActive: true,
  },
  {
    name: 'Heirloom Tomatoes',
    description: 'A vibrant mix of seasonal heirloom tomatoes. Bursting with sweet and tangy flavour, perfect for a Caprese salad.',
    price: 5.49,
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80',
    stock: 45,
    category: 'Fresh Produce',
    isActive: true,
  },
  {
    name: 'Organic Strawberries',
    description: 'Sweet, juicy, and sustainably grown strawberries. Picked at peak ripeness.',
    price: 6.99,
    imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&q=80',
    stock: 20,
    category: 'Fresh Produce',
    isActive: true,
  },
  {
    name: 'Baby Spinach Leaves',
    description: 'Tender and crisp organic baby spinach. Triple-washed and ready to eat in salads or smoothies.',
    price: 4.49,
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80',
    stock: 35,
    category: 'Fresh Produce',
    isActive: true,
  },
  {
    name: 'Sweet Potatoes',
    description: 'Nutrient-dense sweet potatoes, perfect for roasting, mashing, or making fries.',
    price: 2.99,
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80',
    stock: 90,
    category: 'Fresh Produce',
    isActive: true,
  }
];

async function main() {
  console.log('🌱  Seeding products…');

  const existingProducts = await prisma.product.findMany();
  const existingNames = new Set(existingProducts.map(p => p.name));

  let added = 0;
  for (const p of products) {
    if (!existingNames.has(p.name)) {
      await prisma.product.create({ data: p });
      added++;
    }
  }

  console.log(`✅  Created ${added} new products. Skipped ${products.length - added} existing.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
