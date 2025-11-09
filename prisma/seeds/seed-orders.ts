/**
 * Seed Orders and Transactions
 * Creates order and transaction records
 */

import { PrismaClient, OrderStatus, TransactionType, TransactionStatus } from '@prisma/client';
import { PersianDataGenerator } from './persian-data-generator';

const prisma = new PrismaClient();
const generator = new PersianDataGenerator(12345);

export async function seedOrders() {
  console.log('🌱 Starting to seed orders and transactions...');

  try {
    const users = await prisma.user.findMany();
    const courses = await prisma.course.findMany();

    if (users.length === 0 || courses.length === 0) {
      console.log('⚠️  Please seed users and courses first!');
      return { created: 0, updated: 0, total: 0 };
    }

    let orderCount = 0;
    let transactionCount = 0;
    let orderItemCount = 0;

    for (const user of users) {
      // Each user has 0-3 orders
      const numOrders = generator.randomInt(0, 4);

      for (let i = 0; i < numOrders; i++) {
        // Select 1-3 courses for this order
        const numCourses = generator.randomInt(1, 4);
        const orderCourses = [];
        let total = 0;

        for (let c = 0; c < numCourses; c++) {
          const course = generator.choice(courses);
          const discount = course.discountPercent || 0;
          const price = course.price - (course.price * discount / 100);
          orderCourses.push({ course, price, discount });
          total += price;
        }

        const status = generator.choice([OrderStatus.PAID, OrderStatus.PAID, OrderStatus.PENDING, OrderStatus.FAILED]);

        const order = await prisma.order.create({
          data: {
            userId: user.id,
            items: JSON.stringify(orderCourses.map(oc => ({
              courseId: oc.course.id,
              subject: oc.course.subject,
              price: oc.price,
              discount: oc.discount
            }))),
            total,
            status,
            paymentRef: status === OrderStatus.PAID ? `REF-${generator.randomInt(100000, 999999)}` : null,
            createdAt: generator.generatePastDate(365)
          }
        });

        orderCount++;

        // Create OrderItems
        for (const { course, price, discount } of orderCourses) {
          await prisma.orderItem.create({
            data: {
              orderId: order.id,
              courseId: course.id,
              price,
              discountPercent: discount
            }
          });
          orderItemCount++;
        }

        // Create Transaction
        const transaction = await prisma.transaction.create({
          data: {
            userId: user.id,
            orderId: order.id,
            amount: total,
            type: TransactionType.PAYMENT,
            status: status === OrderStatus.PAID ? TransactionStatus.SUCCESS :
                    status === OrderStatus.FAILED ? TransactionStatus.FAILED :
                    TransactionStatus.PENDING,
            gateway: generator.choice(['زرین‌پال', 'پی‌پینگ', 'آیدی‌پی', 'به‌پرداخت']),
            refNumber: status === OrderStatus.PAID ? `TRX-${generator.randomInt(1000000000, 9999999999)}` : null,
            description: `خرید ${numCourses} دوره آموزشی`,
            createdAt: order.createdAt
          }
        });

        transactionCount++;
      }

      if (orderCount % 20 === 0) {
        console.log(`  ✓ Created ${orderCount} orders, ${orderItemCount} items, ${transactionCount} transactions...`);
      }
    }

    console.log(`\n✅ Orders and transactions seeded successfully!`);
    console.log(`   📝 Orders: ${orderCount}`);
    console.log(`   📝 Order Items: ${orderItemCount}`);
    console.log(`   📝 Transactions: ${transactionCount}`);

    return { created: orderCount + orderItemCount + transactionCount, updated: 0, total: orderCount + orderItemCount + transactionCount };
  } catch (error) {
    console.error('❌ Error seeding orders:', error);
    throw error;
  }
}

if (require.main === module) {
  seedOrders()
    .catch(error => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
