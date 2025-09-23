/*
  Warnings:

  - You are about to drop the `core_register` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "core"."GENDER" AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "core"."ROLE" AS ENUM ('GUEST', 'USER', 'MODERATOR', 'ADMIN', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "core"."SYSTEM_STATUS" AS ENUM ('PENDING', 'INVITED', 'ACTIVE', 'LOCKED', 'SUSPENDED', 'DEACTIVATED', 'BANNED', 'DELETED');

-- CreateEnum
CREATE TYPE "core"."EMPLOYMENT_STATUS" AS ENUM ('SEEKING', 'NOT_SEEKING', 'EMPLOYED', 'UNEMPLOYED', 'OPEN', 'FREELANCE', 'SELF_EMPLOYED', 'UNKNOWN');

-- DropTable
DROP TABLE "core"."core_register";

-- CreateTable
CREATE TABLE "core"."core_users" (
    "cr_uuid" TEXT NOT NULL,
    "cr_email" TEXT NOT NULL,
    "cr_password" TEXT NOT NULL,
    "cr_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cr_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "core_users_pkey" PRIMARY KEY ("cr_uuid")
);

-- CreateTable
CREATE TABLE "core"."core_identity" (
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
CREATE TABLE "core"."user_pr_address" (
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

-- CreateTable
CREATE TABLE "core"."user_current_address" (
    "cr_uuid" TEXT NOT NULL,
    "cr_cu_country" TEXT,
    "cr_cu_city" TEXT,
    "cr_cu_street" TEXT,
    "cr_cu_postcode" TEXT,
    "cr_cu_housenumber" TEXT,
    "cr_cu_aditional" TEXT,
    "cr_cu_latitude" TEXT,
    "cr_cu_longitude " TEXT,
    "cr_cu_updated" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "core"."user_system_credentials" (
    "cr_uuid" TEXT NOT NULL,
    "cr_role" "core"."ROLE" NOT NULL DEFAULT 'USER',
    "cr_status" "core"."SYSTEM_STATUS" NOT NULL DEFAULT 'PENDING',
    "cr_emloyment" "core"."EMPLOYMENT_STATUS" NOT NULL DEFAULT 'UNKNOWN',
    "cr_created" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "core_users_cr_email_key" ON "core"."core_users"("cr_email");

-- CreateIndex
CREATE UNIQUE INDEX "core_identity_cr_uuid_key" ON "core"."core_identity"("cr_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "user_pr_address_cr_uuid_key" ON "core"."user_pr_address"("cr_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "user_current_address_cr_uuid_key" ON "core"."user_current_address"("cr_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "user_system_credentials_cr_uuid_key" ON "core"."user_system_credentials"("cr_uuid");

-- AddForeignKey
ALTER TABLE "core"."core_identity" ADD CONSTRAINT "core_identity_cr_uuid_fkey" FOREIGN KEY ("cr_uuid") REFERENCES "core"."core_users"("cr_uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."user_pr_address" ADD CONSTRAINT "user_pr_address_cr_uuid_fkey" FOREIGN KEY ("cr_uuid") REFERENCES "core"."core_users"("cr_uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."user_current_address" ADD CONSTRAINT "user_current_address_cr_uuid_fkey" FOREIGN KEY ("cr_uuid") REFERENCES "core"."core_users"("cr_uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
