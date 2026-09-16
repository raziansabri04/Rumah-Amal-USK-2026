'use server';

import prisma from '@/lib/prisma';

export async function saveSubscription(data: {
  endpoint: string;
  p256dh: string;
  auth: string;
}) {
  const subscription = await prisma.pushSubscription.upsert({
    where: { endpoint: data.endpoint },
    update: { p256dh: data.p256dh, auth: data.auth },
    create: data,
  });
  return subscription;
}

export async function removeSubscription(endpoint: string) {
  await prisma.pushSubscription.deleteMany({
    where: { endpoint },
  });
}

export async function getAllSubscriptions() {
  return prisma.pushSubscription.findMany();
}