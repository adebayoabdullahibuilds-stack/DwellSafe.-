CREATE TYPE "VerificationDecision" AS ENUM ('PENDING', 'IN_REVIEW', 'VERIFIED', 'REJECTED');

CREATE TABLE "PropertyListing" (
    "id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "location" VARCHAR(200) NOT NULL,
    "annualRent" DECIMAL(14,2) NOT NULL,
    "bedrooms" INTEGER NOT NULL DEFAULT 0,
    "bathrooms" INTEGER NOT NULL DEFAULT 0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PropertyListing_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Verification" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "decision" "VerificationDecision" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Verification_listingId_key" ON "Verification"("listingId");
CREATE INDEX "PropertyListing_isAvailable_location_idx" ON "PropertyListing"("isAvailable", "location");
CREATE INDEX "Verification_decision_updatedAt_idx" ON "Verification"("decision", "updatedAt");

ALTER TABLE "Verification"
ADD CONSTRAINT "Verification_listingId_fkey"
FOREIGN KEY ("listingId") REFERENCES "PropertyListing"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
