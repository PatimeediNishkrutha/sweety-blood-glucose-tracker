import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "demo@sweety.app";
  const passwordHash = await bcrypt.hash("SweetyDemo123!", 12);
  const user = await prisma.user.upsert({
    where: { email },
    update: { name: "Demo Patient", passwordHash },
    create: { name: "Demo Patient", email, passwordHash }
  });

  const today = new Date();
  const day = (offset) => new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - offset));
  const samples = [
    { date: day(0), timeSlot: "Morning (fasting)", value: 112 },
    { date: day(0), timeSlot: "After breakfast", value: 146 },
    { date: day(0), timeSlot: "After lunch", value: 158 },
    { date: day(0), timeSlot: "After dinner", value: 132 },
    { date: day(1), timeSlot: "Morning (fasting)", value: 108 },
    { date: day(1), timeSlot: "After breakfast", value: 139 },
    { date: day(2), timeSlot: "Morning (fasting)", value: 116 }
  ];

  for (const sample of samples) {
    await prisma.reading.upsert({
      where: { userId_date_timeSlot: { userId: user.id, date: sample.date, timeSlot: sample.timeSlot } },
      update: { value: sample.value },
      create: { ...sample, userId: user.id }
    });
  }
  console.log("Demo user ready: demo@sweety.app / SweetyDemo123!");
}

main().catch((error) => { console.error(error); process.exitCode = 1; })
  .finally(async () => prisma.$disconnect());
