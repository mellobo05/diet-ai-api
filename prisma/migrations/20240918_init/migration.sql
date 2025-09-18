-- Initial schema for PostgreSQL generated manually to match Prisma models

-- Users table
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "name" TEXT,
  "onDiet" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS "Product" (
  "id" TEXT PRIMARY KEY,
  "externalId" TEXT UNIQUE,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "category" TEXT,
  "price" DOUBLE PRECISION NOT NULL,
  "discountPct" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "finalPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "calories" INTEGER,
  "proteinGrams" DOUBLE PRECISION,
  "fatGrams" DOUBLE PRECISION,
  "carbsGrams" DOUBLE PRECISION,
  "keywords" TEXT[] NOT NULL DEFAULT '{}',
  "isDiet" BOOLEAN,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS "Order" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- OrderItems table
CREATE TABLE IF NOT EXISTS "OrderItem" (
  "id" TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "unitPrice" DOUBLE PRECISION NOT NULL,
  "isDiet" BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS "Order_userId_idx" ON "Order" ("userId");
CREATE INDEX IF NOT EXISTS "OrderItem_orderId_idx" ON "OrderItem" ("orderId");
CREATE INDEX IF NOT EXISTS "OrderItem_productId_idx" ON "OrderItem" ("productId");


