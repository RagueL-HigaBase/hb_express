/*
  Warnings:

  - You are about to drop the `core_identity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `core_users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_pr_address` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "core"."core_identity" DROP CONSTRAINT "core_identity_cr_uuid_fkey";

-- DropForeignKey
ALTER TABLE "core"."user_current_address" DROP CONSTRAINT "user_current_address_cr_uuid_fkey";

-- DropForeignKey
ALTER TABLE "core"."user_pr_address" DROP CONSTRAINT "user_pr_address_cr_uuid_fkey";

-- DropTable
DROP TABLE "core"."core_identity";

-- DropTable
DROP TABLE "core"."core_users";

-- DropTable
DROP TABLE "core"."user_pr_address";

-- CreateTable
CREATE TABLE "core"."users" (
    "cr_uuid" TEXT NOT NULL,
    "cr_email" TEXT NOT NULL,
    "cr_password" TEXT NOT NULL,
    "cr_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cr_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("cr_uuid")
);

-- CreateTable
CREATE TABLE "core"."user_identity" (
    "cr_uuid" TEXT NOT NULL,
    "cr_firstname" TEXT,
    "cr_lastname" TEXT,
    "cr_middlename" TEXT,
    "cr_gender" "core"."GENDER" NOT NULL DEFAULT 'UNKNOWN',
    "cr_birthdate" TIMESTAMP(3),
    "cr_nationality" JSONB,
    "cr_placeofbirth" JSONB,
    "cr_updated" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "core"."user_permanent_address" (
    "cr_uuid" TEXT NOT NULL,
    "cr_pr_country" TEXT,
    "cr_pr_city" TEXT,
    "cr_pr_street" TEXT,
    "cr_pr_postcode" TEXT,
    "cr_pr_housenumber" TEXT,
    "cr_pr_aditional" TEXT,
    "cr_pr_latitude" TEXT,
    "cr_pr_longitude " TEXT,
    "cr_pr_updated" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "users_cr_email_key" ON "core"."users"("cr_email");

-- CreateIndex
CREATE UNIQUE INDEX "user_identity_cr_uuid_key" ON "core"."user_identity"("cr_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "user_permanent_address_cr_uuid_key" ON "core"."user_permanent_address"("cr_uuid");

-- AddForeignKey
ALTER TABLE "core"."user_identity" ADD CONSTRAINT "user_identity_cr_uuid_fkey" FOREIGN KEY ("cr_uuid") REFERENCES "core"."users"("cr_uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."user_permanent_address" ADD CONSTRAINT "user_permanent_address_cr_uuid_fkey" FOREIGN KEY ("cr_uuid") REFERENCES "core"."users"("cr_uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."user_current_address" ADD CONSTRAINT "user_current_address_cr_uuid_fkey" FOREIGN KEY ("cr_uuid") REFERENCES "core"."users"("cr_uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
