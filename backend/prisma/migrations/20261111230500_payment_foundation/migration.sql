-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('TENANT', 'LANDLORD', 'AGENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "AgentAuthorizationRole" AS ENUM ('PRIMARY_AGENT', 'AUTHORIZED_AGENT', 'PARTNER_AGENT');

-- CreateEnum
CREATE TYPE "AgentAuthorizationStatus" AS ENUM ('PENDING', 'ACTIVE', 'REVOKED');

-- CreateEnum
CREATE TYPE "RentalTransactionStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "PaymentChargeType" AS ENUM ('RENT', 'AGENCY_FEE', 'LEGAL_FEE', 'OTHER', 'PLATFORM_SUBSCRIPTION', 'FEATURED_LISTING', 'VERIFICATION_SERVICE');

-- CreateEnum
CREATE TYPE "PaymentMethodType" AS ENUM ('EXTERNAL_DIRECT', 'PROVIDER_CHECKOUT', 'MANUAL_ADMIN_RECORD');

-- CreateEnum
CREATE TYPE "PaymentObligationStatus" AS ENUM ('DRAFT', 'AWAITING_PAYMENT', 'PAYMENT_SUBMITTED', 'UNDER_REVIEW', 'PARTIALLY_PAID', 'PAID', 'REJECTED', 'DISPUTED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateEnum
CREATE TYPE "SettlementStatus" AS ENUM ('NOT_APPLICABLE', 'PENDING', 'PROCESSING', 'SETTLED', 'FAILED', 'REVERSED');

-- CreateEnum
CREATE TYPE "PaymentSubmissionStatus" AS ENUM ('SUBMITTED', 'CONFIRMED', 'REJECTED', 'NEEDS_INFORMATION');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'ISSUED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'VOID', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('PAYSTACK', 'FLUTTERWAVE', 'MOCK');

-- CreateEnum
CREATE TYPE "PaymentAttemptStatus" AS ENUM ('CREATED', 'PENDING', 'PROCESSING', 'SUCCESSFUL', 'FAILED', 'EXPIRED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateEnum
CREATE TYPE "WebhookProcessingStatus" AS ENUM ('RECEIVED', 'PROCESSING', 'PROCESSED', 'FAILED', 'IGNORED');

-- AlterTable
ALTER TABLE "PropertyListing" ADD COLUMN     "landlordId" UUID;

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "displayName" VARCHAR(200) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "isDisabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRoleAssignment" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRoleAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tokenHash" CHAR(64) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyAgentAuthorization" (
    "id" UUID NOT NULL,
    "propertyId" UUID NOT NULL,
    "agentUserId" UUID NOT NULL,
    "authorizedByUserId" UUID,
    "role" "AgentAuthorizationRole" NOT NULL,
    "status" "AgentAuthorizationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyAgentAuthorization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalTransaction" (
    "id" UUID NOT NULL,
    "propertyId" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "landlordId" UUID NOT NULL,
    "primaryAgentId" UUID,
    "status" "RentalTransactionStatus" NOT NULL DEFAULT 'DRAFT',
    "currency" CHAR(3) NOT NULL DEFAULT 'NGN',
    "termsSnapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentalTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentObligation" (
    "id" UUID NOT NULL,
    "rentalTransactionId" UUID,
    "invoiceId" UUID,
    "chargeType" "PaymentChargeType" NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "amountMinor" BIGINT NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'NGN',
    "beneficiaryUserId" UUID,
    "beneficiaryNameSnapshot" VARCHAR(200) NOT NULL,
    "beneficiaryAccountInstructionReference" VARCHAR(200),
    "paymentMethodType" "PaymentMethodType" NOT NULL,
    "status" "PaymentObligationStatus" NOT NULL DEFAULT 'DRAFT',
    "settlementStatus" "SettlementStatus" NOT NULL DEFAULT 'NOT_APPLICABLE',
    "dueAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentObligation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentSubmission" (
    "id" UUID NOT NULL,
    "paymentObligationId" UUID NOT NULL,
    "submittedByUserId" UUID NOT NULL,
    "amountMinor" BIGINT NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'NGN',
    "paymentReference" VARCHAR(200) NOT NULL,
    "paymentDate" DATE NOT NULL,
    "status" "PaymentSubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "reviewedByUserId" UUID,
    "reviewedAt" TIMESTAMP(3),
    "reviewNote" VARCHAR(1000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentEvidence" (
    "id" UUID NOT NULL,
    "paymentSubmissionId" UUID NOT NULL,
    "uploadedByUserId" UUID NOT NULL,
    "storageKey" VARCHAR(500) NOT NULL,
    "originalFileName" VARCHAR(255) NOT NULL,
    "mediaType" VARCHAR(100) NOT NULL,
    "sizeBytes" BIGINT NOT NULL,
    "sha256" CHAR(64) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" UUID NOT NULL,
    "invoiceNumber" VARCHAR(40) NOT NULL,
    "customerUserId" UUID NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "amountMinor" BIGINT NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'NGN',
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "issuedAt" TIMESTAMP(3),
    "dueAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentAttempt" (
    "id" UUID NOT NULL,
    "invoiceId" UUID NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "providerReference" VARCHAR(200) NOT NULL,
    "checkoutUrl" TEXT,
    "amountMinor" BIGINT NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'NGN',
    "status" "PaymentAttemptStatus" NOT NULL DEFAULT 'CREATED',
    "initiatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),
    "failureCode" VARCHAR(100),
    "failureMessage" VARCHAR(500),

    CONSTRAINT "PaymentAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" UUID NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "providerEventId" VARCHAR(200) NOT NULL,
    "eventType" VARCHAR(200) NOT NULL,
    "providerReference" VARCHAR(200),
    "signatureValid" BOOLEAN NOT NULL,
    "processingStatus" "WebhookProcessingStatus" NOT NULL DEFAULT 'RECEIVED',
    "payloadRedacted" JSONB,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialAuditLog" (
    "id" UUID NOT NULL,
    "actorUserId" UUID,
    "entityType" VARCHAR(100) NOT NULL,
    "entityId" UUID NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "previousState" JSONB,
    "newState" JSONB,
    "reason" VARCHAR(1000),
    "requestId" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinancialAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_isDisabled_createdAt_idx" ON "User"("isDisabled", "createdAt");

-- CreateIndex
CREATE INDEX "UserRoleAssignment_role_userId_idx" ON "UserRoleAssignment"("role", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRoleAssignment_userId_role_key" ON "UserRoleAssignment"("userId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE INDEX "Session_userId_expiresAt_idx" ON "Session"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "PropertyAgentAuthorization_propertyId_agentUserId_status_idx" ON "PropertyAgentAuthorization"("propertyId", "agentUserId", "status");

-- CreateIndex
CREATE INDEX "PropertyAgentAuthorization_agentUserId_status_idx" ON "PropertyAgentAuthorization"("agentUserId", "status");

-- CreateIndex
CREATE INDEX "RentalTransaction_propertyId_status_idx" ON "RentalTransaction"("propertyId", "status");

-- CreateIndex
CREATE INDEX "RentalTransaction_tenantId_status_idx" ON "RentalTransaction"("tenantId", "status");

-- CreateIndex
CREATE INDEX "RentalTransaction_landlordId_status_idx" ON "RentalTransaction"("landlordId", "status");

-- CreateIndex
CREATE INDEX "RentalTransaction_primaryAgentId_status_idx" ON "RentalTransaction"("primaryAgentId", "status");

-- CreateIndex
CREATE INDEX "PaymentObligation_rentalTransactionId_status_idx" ON "PaymentObligation"("rentalTransactionId", "status");

-- CreateIndex
CREATE INDEX "PaymentObligation_invoiceId_idx" ON "PaymentObligation"("invoiceId");

-- CreateIndex
CREATE INDEX "PaymentObligation_beneficiaryUserId_status_idx" ON "PaymentObligation"("beneficiaryUserId", "status");

-- CreateIndex
CREATE INDEX "PaymentObligation_chargeType_status_idx" ON "PaymentObligation"("chargeType", "status");

-- CreateIndex
CREATE INDEX "PaymentSubmission_paymentObligationId_status_createdAt_idx" ON "PaymentSubmission"("paymentObligationId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "PaymentSubmission_submittedByUserId_createdAt_idx" ON "PaymentSubmission"("submittedByUserId", "createdAt");

-- CreateIndex
CREATE INDEX "PaymentSubmission_reviewedByUserId_reviewedAt_idx" ON "PaymentSubmission"("reviewedByUserId", "reviewedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentEvidence_storageKey_key" ON "PaymentEvidence"("storageKey");

-- CreateIndex
CREATE INDEX "PaymentEvidence_paymentSubmissionId_createdAt_idx" ON "PaymentEvidence"("paymentSubmissionId", "createdAt");

-- CreateIndex
CREATE INDEX "PaymentEvidence_uploadedByUserId_createdAt_idx" ON "PaymentEvidence"("uploadedByUserId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE INDEX "Invoice_customerUserId_status_createdAt_idx" ON "Invoice"("customerUserId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "Invoice_status_dueAt_idx" ON "Invoice"("status", "dueAt");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentAttempt_providerReference_key" ON "PaymentAttempt"("providerReference");

-- CreateIndex
CREATE INDEX "PaymentAttempt_invoiceId_status_initiatedAt_idx" ON "PaymentAttempt"("invoiceId", "status", "initiatedAt");

-- CreateIndex
CREATE INDEX "WebhookEvent_providerReference_processingStatus_idx" ON "WebhookEvent"("providerReference", "processingStatus");

-- CreateIndex
CREATE INDEX "WebhookEvent_processingStatus_receivedAt_idx" ON "WebhookEvent"("processingStatus", "receivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEvent_provider_providerEventId_key" ON "WebhookEvent"("provider", "providerEventId");

-- CreateIndex
CREATE INDEX "FinancialAuditLog_entityType_entityId_createdAt_idx" ON "FinancialAuditLog"("entityType", "entityId", "createdAt");

-- CreateIndex
CREATE INDEX "FinancialAuditLog_actorUserId_createdAt_idx" ON "FinancialAuditLog"("actorUserId", "createdAt");

-- CreateIndex
CREATE INDEX "PropertyListing_landlordId_idx" ON "PropertyListing"("landlordId");

-- AddForeignKey
ALTER TABLE "UserRoleAssignment" ADD CONSTRAINT "UserRoleAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyListing" ADD CONSTRAINT "PropertyListing_landlordId_fkey" FOREIGN KEY ("landlordId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyAgentAuthorization" ADD CONSTRAINT "PropertyAgentAuthorization_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "PropertyListing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyAgentAuthorization" ADD CONSTRAINT "PropertyAgentAuthorization_agentUserId_fkey" FOREIGN KEY ("agentUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyAgentAuthorization" ADD CONSTRAINT "PropertyAgentAuthorization_authorizedByUserId_fkey" FOREIGN KEY ("authorizedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalTransaction" ADD CONSTRAINT "RentalTransaction_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "PropertyListing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalTransaction" ADD CONSTRAINT "RentalTransaction_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalTransaction" ADD CONSTRAINT "RentalTransaction_landlordId_fkey" FOREIGN KEY ("landlordId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalTransaction" ADD CONSTRAINT "RentalTransaction_primaryAgentId_fkey" FOREIGN KEY ("primaryAgentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentObligation" ADD CONSTRAINT "PaymentObligation_rentalTransactionId_fkey" FOREIGN KEY ("rentalTransactionId") REFERENCES "RentalTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentObligation" ADD CONSTRAINT "PaymentObligation_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentObligation" ADD CONSTRAINT "PaymentObligation_beneficiaryUserId_fkey" FOREIGN KEY ("beneficiaryUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentSubmission" ADD CONSTRAINT "PaymentSubmission_paymentObligationId_fkey" FOREIGN KEY ("paymentObligationId") REFERENCES "PaymentObligation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentSubmission" ADD CONSTRAINT "PaymentSubmission_submittedByUserId_fkey" FOREIGN KEY ("submittedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentSubmission" ADD CONSTRAINT "PaymentSubmission_reviewedByUserId_fkey" FOREIGN KEY ("reviewedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentEvidence" ADD CONSTRAINT "PaymentEvidence_paymentSubmissionId_fkey" FOREIGN KEY ("paymentSubmissionId") REFERENCES "PaymentSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentEvidence" ADD CONSTRAINT "PaymentEvidence_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerUserId_fkey" FOREIGN KEY ("customerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentAttempt" ADD CONSTRAINT "PaymentAttempt_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialAuditLog" ADD CONSTRAINT "FinancialAuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "PaymentObligation"
ADD CONSTRAINT "PaymentObligation_amountMinor_positive" CHECK ("amountMinor" > 0);

ALTER TABLE "PaymentSubmission"
ADD CONSTRAINT "PaymentSubmission_amountMinor_positive" CHECK ("amountMinor" > 0);

ALTER TABLE "Invoice"
ADD CONSTRAINT "Invoice_amountMinor_positive" CHECK ("amountMinor" > 0);

ALTER TABLE "PaymentAttempt"
ADD CONSTRAINT "PaymentAttempt_amountMinor_positive" CHECK ("amountMinor" > 0);

ALTER TABLE "PaymentEvidence"
ADD CONSTRAINT "PaymentEvidence_sizeBytes_positive" CHECK ("sizeBytes" > 0);

CREATE FUNCTION prevent_financial_history_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION '% records are immutable', TG_TABLE_NAME;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "FinancialAuditLog_append_only"
BEFORE UPDATE OR DELETE ON "FinancialAuditLog"
FOR EACH ROW EXECUTE FUNCTION prevent_financial_history_mutation();

CREATE TRIGGER "FinancialAuditLog_no_truncate"
BEFORE TRUNCATE ON "FinancialAuditLog"
FOR EACH STATEMENT EXECUTE FUNCTION prevent_financial_history_mutation();

CREATE TRIGGER "PaymentEvidence_immutable"
BEFORE UPDATE OR DELETE ON "PaymentEvidence"
FOR EACH ROW EXECUTE FUNCTION prevent_financial_history_mutation();

CREATE TRIGGER "PaymentEvidence_no_truncate"
BEFORE TRUNCATE ON "PaymentEvidence"
FOR EACH STATEMENT EXECUTE FUNCTION prevent_financial_history_mutation();

CREATE FUNCTION prevent_payment_submission_mutation()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        RAISE EXCEPTION 'PaymentSubmission records cannot be deleted';
    END IF;

    IF OLD."paymentObligationId" IS DISTINCT FROM NEW."paymentObligationId"
       OR OLD."submittedByUserId" IS DISTINCT FROM NEW."submittedByUserId"
       OR OLD."amountMinor" IS DISTINCT FROM NEW."amountMinor"
       OR OLD."currency" IS DISTINCT FROM NEW."currency"
       OR OLD."paymentReference" IS DISTINCT FROM NEW."paymentReference"
       OR OLD."paymentDate" IS DISTINCT FROM NEW."paymentDate"
       OR OLD."createdAt" IS DISTINCT FROM NEW."createdAt" THEN
        RAISE EXCEPTION 'PaymentSubmission claim details are immutable';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "PaymentSubmission_preserve_claim"
BEFORE UPDATE OR DELETE ON "PaymentSubmission"
FOR EACH ROW EXECUTE FUNCTION prevent_payment_submission_mutation();

CREATE TRIGGER "PaymentSubmission_no_truncate"
BEFORE TRUNCATE ON "PaymentSubmission"
FOR EACH STATEMENT EXECUTE FUNCTION prevent_financial_history_mutation();
