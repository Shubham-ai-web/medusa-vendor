import { Migration } from '@mikro-orm/migrations';

export class Migration20250306124424 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`ALTER TABLE if exists "vendor_inventory" ADD COLUMN "inventory_sku" TEXT NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "vendor_inventory" drop column if exists "vendor_inventory";`);
  }

}
