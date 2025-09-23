-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "core";

-- CreateTable
CREATE TABLE "core"."core_register" (
    "cr_id" TEXT NOT NULL,
    "cr_email" TEXT NOT NULL,
    "cr_password" TEXT NOT NULL,
    "cr_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cr_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "core_register_pkey" PRIMARY KEY ("cr_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "core_register_cr_email_key" ON "core"."core_register"("cr_email");
