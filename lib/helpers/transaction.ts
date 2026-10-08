// @/lib/helpers/transaction.ts
import { prisma } from "@/lib/prisma";
import { TransactionType, TransactionStatus } from "@prisma/client";

interface CreateTransactionParams {
  userId: string;
  orderId?: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  gateway?: string;
  refNumber?: string;
  description?: string;
}

/**
 * Helper function to create a transaction record
 */
export async function createTransaction(params: CreateTransactionParams) {
  return await prisma.transaction.create({
    data: {
      userId: params.userId,
      orderId: params.orderId,
      amount: params.amount,
      type: params.type,
      status: params.status,
      gateway: params.gateway,
      refNumber: params.refNumber,
      description: params.description,
    },
  });
}

/**
 * Helper function to update transaction status
 */
export async function updateTransactionStatus(
  transactionId: string,
  status: TransactionStatus,
  refNumber?: string
) {
  return await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      status,
      ...(refNumber && { refNumber }),
    },
  });
}

/**
 * Helper function to create enrollment after successful payment
 */
export async function createEnrollmentsFromOrder(
  userId: string,
  orderId: string
) {
  // Get order with items
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // Extract course IDs from items
  const courseIds = (order.items as { courseId: string }[]).map(
    (item) => item.courseId
  );

  // Database uniqueness makes callback retries safe even across app instances.
  return prisma.enrollment.createMany({
    data: [...new Set(courseIds)].map((courseId) => ({ userId, courseId, progress: 0 })),
    skipDuplicates: true,
  });
}
