import "dotenv/config";
import app from "./app.js";
import prisma from "./config/prisma.js";

const port = Number(process.env.PORT || 5000);
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is missing. Check backend/.env.");
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 24) {
  throw new Error("JWT_SECRET must be set to a random string of at least 24 characters.");
}

const server = app.listen(port, () => console.log(`Sweety API running at http://localhost:${port}`));

async function shutdown() {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
