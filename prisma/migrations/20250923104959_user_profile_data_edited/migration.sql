-- AddForeignKey
ALTER TABLE "core"."user_system_credentials" ADD CONSTRAINT "user_system_credentials_cr_uuid_fkey" FOREIGN KEY ("cr_uuid") REFERENCES "core"."users"("cr_uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
