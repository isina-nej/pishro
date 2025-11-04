// // app/api/payment/verify/route.ts
// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import Zarinpal from "zarinpal-node-sdk";
// const prisma = new PrismaClient();
// const zarinpal = Zarinpal.create(process.env.ZARINPAL_MERCHANT_ID);

// export async function GET(req: Request) {
//   const url = new URL(req.url);
//   const authority = url.searchParams.get("Authority");
//   const status = url.searchParams.get("Status");
//   const orderId = url.searchParams.get("orderId");

//   if (status !== "OK") {
//     await prisma.order.update({
//       where: { id: orderId },
//       data: { status: "failed" },
//     });
//     return NextResponse.redirect(
//       `${process.env.NEXTAUTH_URL}/checkout?status=failed`
//     );
//   }

//   // verify
//   const verification = await zarinpal.PaymentVerification({
//     Authority: authority,
//     Amount: /* fetch order total */ 0,
//   });

//   if (verification && verification.Status === 100) {
//     await prisma.order.update({
//       where: { id: orderId },
//       data: { status: "paid", paymentRef: verification.RefID },
//     });
//     return NextResponse.redirect(
//       `${process.env.NEXTAUTH_URL}/checkout?status=success`
//     );
//   }

//   await prisma.order.update({
//     where: { id: orderId },
//     data: { status: "failed" },
//   });
//   return NextResponse.redirect(
//     `${process.env.NEXTAUTH_URL}/checkout?status=failed`
//   );
// }
