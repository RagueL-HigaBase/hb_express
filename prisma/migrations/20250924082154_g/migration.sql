-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "core";

-- CreateEnum
CREATE TYPE "core"."GENDER" AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "core"."ROLE" AS ENUM ('GUEST', 'USER', 'MODERATOR', 'ADMIN', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "core"."SYSTEM_STATUS" AS ENUM ('PENDING', 'INVITED', 'ACTIVE', 'LOCKED', 'SUSPENDED', 'DEACTIVATED', 'BANNED', 'DELETED');

-- CreateEnum
CREATE TYPE "core"."EMPLOYMENT_STATUS" AS ENUM ('SEEKING', 'NOT_SEEKING', 'EMPLOYED', 'UNEMPLOYED', 'OPEN', 'FREELANCE', 'SELF_EMPLOYED', 'UNKNOWN');

-- CreateTable
CREATE TABLE "core"."user" (
    "cr_uuid" TEXT NOT NULL,
    "cr_email" TEXT NOT NULL,
    "cr_password" TEXT NOT NULL,
    "cr_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cr_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("cr_uuid")
);

-- CreateTable
CREATE TABLE "core"."user_identity" (
    "cr_uuid" TEXT NOT NULL,
    "cr_first_name" TEXT,
    "cr_last_name" TEXT,
    "cr_middle_name" TEXT,
    "cr_gender" "core"."GENDER" NOT NULL DEFAULT 'UNKNOWN',
    "cr_birthdate" TIMESTAMP(3),
    "cr_nationality" JSONB,
    "cr_place_of_birth" JSONB,
    "cr_updated" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "core"."user_permanent_address" (
    "cr_uuid" TEXT NOT NULL,
    "cr_pr_country" TEXT,
    "cr_pr_city" TEXT,
    "cr_pr_street" TEXT,
    "cr_pr_post_code" TEXT,
    "cr_pr_house_number" TEXT,
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
    "cr_cu_house_number" TEXT,
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
    "cr_updated" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "core"."user_session" (
    "cr_uuid" TEXT NOT NULL,
    "cr_useruuid" TEXT NOT NULL,
    "cr_session_has" TEXT NOT NULL,
    "cr_session_elapsed" TIMESTAMP(3) NOT NULL,
    "cr_pin_hash" TEXT NOT NULL,
    "cr_pin_elapsed" TIMESTAMP(3) NOT NULL,
    "cr_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cr_updated" TIMESTAMP(3),

    CONSTRAINT "user_session_pkey" PRIMARY KEY ("cr_uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_cr_email_key" ON "core"."user"("cr_email");

-- CreateIndex
CREATE UNIQUE INDEX "user_identity_cr_uuid_key" ON "core"."user_identity"("cr_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "user_permanent_address_cr_uuid_key" ON "core"."user_permanent_address"("cr_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "user_current_address_cr_uuid_key" ON "core"."user_current_address"("cr_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "user_system_credentials_cr_uuid_key" ON "core"."user_system_credentials"("cr_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "user_session_cr_session_has_key" ON "core"."user_session"("cr_session_has");

-- CreateIndex
CREATE UNIQUE INDEX "user_session_cr_pin_hash_key" ON "core"."user_session"("cr_pin_hash");

-- AddForeignKey
ALTER TABLE "core"."user_identity" ADD CONSTRAINT "user_identity_cr_uuid_fkey" FOREIGN KEY ("cr_uuid") REFERENCES "core"."user"("cr_uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."user_permanent_address" ADD CONSTRAINT "user_permanent_address_cr_uuid_fkey" FOREIGN KEY ("cr_uuid") REFERENCES "core"."user"("cr_uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."user_current_address" ADD CONSTRAINT "user_current_address_cr_uuid_fkey" FOREIGN KEY ("cr_uuid") REFERENCES "core"."user"("cr_uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."user_system_credentials" ADD CONSTRAINT "user_system_credentials_cr_uuid_fkey" FOREIGN KEY ("cr_uuid") REFERENCES "core"."user"("cr_uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
