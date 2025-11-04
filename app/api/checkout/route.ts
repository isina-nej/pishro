// // app/api/checkout/route.ts
// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import Zarinpal from "zarinpal-node-sdk"; // or use REST v3

// const prisma = new PrismaClient();
// const zarinpal = Zarinpal.create(process.env.ZARINPAL_MERCHANT_ID);

// // client sends { userId?, items: [{courseId, qty}], total }
// export async function POST(req: Request) {
//   const body = await req.json();
//   const { userId, items, total, callbackUrl } = body;
//   if (!items || !total) return NextResponse.json({ error: "missing" }, { status: 400 });

//   // create order
//   const order = await prisma.order.create({
//     data: {
//       userId,
//       items,
//       total,
//       status: "pending",
//     },
//   });

//   // create zarinpal payment request
//   // Using SDK example - adjust according to package API
//   const description = `Payment for order ${order.id}`;
//   const res = await zarinpal.PaymentRequest({
//     Amount: total,
//     CallbackURL: `${callbackUrl || process.env.NEXTAUTH_URL}/api/payment/verify?orderId=${order.id}`,
//     Description: description,
//   });

//   // SDK may return an authority or url
//   if (res && res.Status === 100) {
//     const payUrl = `https://www.zarinpal.com/pg/StartPay/${res.Authority}`;
//     return NextResponse.json({ ok: true, payUrl, orderId: order.id });
//   }

//   return NextResponse.json({ error: "payment_init_failed" }, { status: 500 });
// }
