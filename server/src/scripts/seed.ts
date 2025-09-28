import { UserModel } from '../models/User';
import { ProductModel } from '../models/Product';
import { ReviewModel } from '../models/Review';
import { MessageModel } from '../models/Message';
import { localStorage } from '../storage/localStorage';

async function seedDatabase() {
  console.log('🌱 Seeding HarvestLink database...');

  // Clear existing data
  localStorage.clear();

  try {
    // Create demo farmer
    const farmer = await UserModel.create({
      email: 'farmer@harvestlink.com',
      password: 'password123',
      name: 'Klark Kent',
      role: 'farmer',
    });

    // Create farmer profile
    const farmerProfile = UserModel.createFarmerProfile({
      userId: farmer.id,
      farmName: 'Green Valley Organic Farm',
      description: 'Family-owned organic farm specializing in fresh vegetables and sustainable farming practices. We have been serving the local community for over 20 years with the highest quality produce.',
      location: 'Saskatoon, Saskatchewan',
      farmHistory: 'Founded in 2003 by the Johnson family, Green Valley Organic Farm started as a small 5-acre plot and has grown to a 50-acre certified organic operation. We focus on sustainable farming methods, crop rotation, and natural pest management to provide the freshest, healthiest produce to our community.',
    });

    // Create demo customer
    const customer = await UserModel.create({
      email: 'customer@harvestlink.com',
      password: 'password123',
      name: 'Lois Lane',
      role: 'customer',
    });

    // Create sample products
    const products = [
      {
        farmerId: farmer.id,
        name: 'Organic Heirloom Tomatoes',
        category: 'vegetables' as const,
        price: 4.99,
        quantity: 50,
        unit: 'lb',
        description: 'Vine-ripened heirloom tomatoes in various colors including red, yellow, and purple. Perfect for salads, sandwiches, or cooking. Grown without pesticides or synthetic fertilizers.',
        isActive: true,
      },
      {
        farmerId: farmer.id,
        name: 'Fresh Spinach Bunches',
        category: 'vegetables' as const,
        price: 3.50,
        quantity: 30,
        unit: 'bunch',
        description: 'Tender, fresh spinach leaves perfect for salads, smoothies, or cooking. Harvested this morning and packed with nutrients. Grown using organic methods.',
        isActive: true,
      },
      {
        farmerId: farmer.id,
        name: 'Artisan Goat Cheese',
        category: 'dairy' as const,
        price: 12.99,
        quantity: 15,
        unit: 'wheel',
        description: 'Creamy, handcrafted goat cheese made from milk from our grass-fed goats. Aged for 30 days for the perfect tangy flavor. Great for cheese boards or cooking.',
        isActive: true,
      }
    ];

    const createdProducts = products.map(product => ProductModel.create(product));

    // Create sample reviews
    const reviews = [
      {
        customerId: customer.id,
        farmerId: farmer.id,
        rating: 5,
        comment: 'Amazing tomatoes! The flavor is incredible and you can really taste the difference from store-bought. Sarah\'s farm is doing great work in sustainable agriculture.',
      }
    ];

    const createdReviews = reviews.map(review => ReviewModel.create(review));

    // Create sample messages
    const messages = [
      {
        fromUserId: customer.id,
        toUserId: farmer.id,
        content: 'Hi Sarah! I\'m interested in your heirloom tomatoes. Do you have any available for pickup this weekend?',
      },
      {
        fromUserId: farmer.id,
        toUserId: customer.id,
        content: 'Hi Mike! Yes, I have plenty of heirloom tomatoes available. You can come by Saturday morning between 9-11 AM. The farm is located at 123 Green Valley Road.',
      },
      {
        fromUserId: customer.id,
        toUserId: farmer.id,
        content: 'Perfect! I\'ll be there around 10 AM. Should I bring cash or do you accept cards?',
      },
      {
        fromUserId: farmer.id,
        toUserId: customer.id,
        content: 'Both cash and cards work fine! Looking forward to seeing you. Feel free to walk around the farm and see our other produce too.',
      }
    ];

    const createdMessages = messages.map(message => MessageModel.create(message));

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Created:`);
    console.log(`   👨‍🌾 1 farmer: ${farmer.email}`);
    console.log(`   🛒 1 customer: ${customer.email}`);
    console.log(`   🥕 ${createdProducts.length} products`);
    console.log(`   ⭐ ${createdReviews.length} reviews`);
    console.log(`   💬 ${createdMessages.length} messages`);
    console.log('');
    console.log('🔑 Demo Login Credentials:');
    console.log('   Farmer: farmer@harvestlink.com / password123');
    console.log('   Customer: customer@harvestlink.com / password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase().then(() => {
    console.log('🌱 Seeding completed!');
    process.exit(0);
  });
}

export default seedDatabase;
