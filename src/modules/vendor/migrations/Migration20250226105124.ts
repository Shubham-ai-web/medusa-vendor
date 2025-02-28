import { Migration } from '@mikro-orm/migrations';

export class Migration20250226105124 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`ALTER TABLE "vendor" ADD COLUMN "address2" text null, ADD COLUMN "company_name" text null, ADD COLUMN "tax_id" text null, ADD COLUMN "city" text null, ADD COLUMN "state" text null, ADD COLUMN "country" text null, ADD COLUMN "postal_code" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`ALTER TABLE "vendor" DROP COLUMN "address2", DROP COLUMN "company_name", DROP COLUMN "tax_id", DROP COLUMN "city", DROP COLUMN "state", DROP COLUMN "country", DROP COLUMN "postal_code";`);
  }

}
