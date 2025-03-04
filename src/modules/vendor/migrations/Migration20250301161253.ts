import { Migration } from '@mikro-orm/migrations';

export class Migration20250301161253 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "vendor_inventory" ("id" text not null, "vendor_id" text not null, "inventory_item_id" text not null, "price" integer not null, "turnaround_days" integer not null, "is_preferred" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "vendor_inventory_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_vendor_inventory_vendor_id" ON "vendor_inventory" (vendor_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_vendor_inventory_deleted_at" ON "vendor_inventory" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "vendor_inventory" add constraint "vendor_inventory_vendor_id_foreign" foreign key ("vendor_id") references "vendor" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "vendor_inventory" cascade;`);
  }

}
