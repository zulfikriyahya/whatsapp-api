import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const tiers = [
    {
      name: "Free",
      description: "Tier gratis dengan fitur dasar",
      maxSessions: 1,
      maxApiKeys: 1,
      maxDailyMessages: 100,
      maxMonthlyBroadcasts: 2,
      maxBroadcastRecipients: 100,
      maxWorkflows: 1,
      maxDripCampaigns: 1,
      maxTemplates: 5,
      maxContacts: 100,
      rateLimitPerMinute: 10,
      features: ["auto_reply", "scheduler", "webhook"],
      price: 0,
      isActive: true,
    },
    {
      name: "Basic",
      description: "Tier dasar untuk bisnis kecil",
      maxSessions: 2,
      maxApiKeys: 3,
      maxDailyMessages: 500,
      maxMonthlyBroadcasts: 10,
      maxBroadcastRecipients: 1000,
      maxWorkflows: 3,
      maxDripCampaigns: 2,
      maxTemplates: 20,
      maxContacts: 500,
      rateLimitPerMinute: 30,
      features: [
        "broadcast",
        "auto_reply",
        "workflow",
        "scheduler",
        "webhook",
        "api_access",
        "labels",
      ],
      price: 99000,
      isActive: true,
    },
    {
      name: "Pro",
      description: "Tier profesional dengan semua fitur",
      maxSessions: 5,
      maxApiKeys: 5,
      maxDailyMessages: 2000,
      maxMonthlyBroadcasts: 50,
      maxBroadcastRecipients: 5000,
      maxWorkflows: 10,
      maxDripCampaigns: 5,
      maxTemplates: 50,
      maxContacts: 5000,
      rateLimitPerMinute: 60,
      features: [
        "broadcast",
        "auto_reply",
        "workflow",
        "drip_campaign",
        "ai_smart_reply",
        "channels",
        "labels",
        "customer_note",
        "scheduler",
        "webhook",
        "api_access",
      ],
      price: 299000,
      isActive: true,
    },
    {
      name: "Enterprise",
      description: "Tier enterprise tanpa batas",
      maxSessions: 20,
      maxApiKeys: 10,
      maxDailyMessages: 10000,
      maxMonthlyBroadcasts: 200,
      maxBroadcastRecipients: 10000,
      maxWorkflows: 50,
      maxDripCampaigns: 20,
      maxTemplates: 200,
      maxContacts: 50000,
      rateLimitPerMinute: 300,
      features: [
        "broadcast",
        "auto_reply",
        "workflow",
        "drip_campaign",
        "ai_smart_reply",
        "channels",
        "labels",
        "customer_note",
        "scheduler",
        "webhook",
        "api_access",
      ],
      price: 999000,
      isActive: true,
    },
  ];

  for (const tier of tiers) {
    await prisma.tier.upsert({
      where: { name: tier.name },
      create: { ...tier, features: tier.features as any },
      update: { ...tier, features: tier.features as any },
    });
    console.log(`Tier upserted: ${tier.name}`);
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      create: {
        email: adminEmail,
        name: "Super Admin",
        role: Role.super_admin,
        isActive: true,
      },
      update: { role: Role.super_admin },
    });

    await prisma.userQuota.upsert({
      where: { userId: admin.id },
      create: {
        userId: admin.id,
        messagesSentToday: 0,
        broadcastsThisMonth: 0,
      },
      update: {},
    });

    const enterpriseTier = await prisma.tier.findUnique({
      where: { name: "Enterprise" },
    });
    if (enterpriseTier) {
      await prisma.userTier.upsert({
        where: { userId: admin.id },
        create: { userId: admin.id, tierId: enterpriseTier.id },
        update: { tierId: enterpriseTier.id },
      });
    }

    console.log(`Admin upserted: ${adminEmail}`);
  }

  const globalSettings = [
    { key: "defaultDailyMessageLimit", value: "1000" },
    { key: "defaultMonthlyBroadcastLimit", value: "10" },
    { key: "maintenanceMode", value: "false" },
    { key: "maxBroadcastRecipients", value: "10000" },
  ];

  for (const s of globalSettings) {
    await prisma.globalSetting.upsert({
      where: { key: s.key },
      create: { key: s.key, value: s.value },
      update: { value: s.value },
    });
  }
  console.log("Global settings seeded");

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
