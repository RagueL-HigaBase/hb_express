/*
  Warnings:

  - You are about to drop the column `cr_session_has` on the `user_session` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "core"."user_session_cr_session_has_key";

-- AlterTable
ALTER TABLE "core"."user_session" DROP COLUMN "cr_session_has";
