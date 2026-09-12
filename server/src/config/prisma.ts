import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../../prisma/generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to connect to the database");
}

const adapter = new PrismaNeon({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});


export default prisma;
