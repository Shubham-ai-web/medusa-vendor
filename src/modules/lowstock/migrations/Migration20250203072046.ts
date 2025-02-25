import { Migration } from '@mikro-orm/migrations';

export class Migration20250203072046 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "lowstock_subscription" drop constraint if exists "lowstock_subscription_variant_id_sales_channel_id_email_unique";`);
    this.addSql(`create table if not exists "lowstock_subscription" ("id" text not null, "variant_id" text not null, "sales_channel_id" text not null, "email" text not null, "user_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "lowstock_subscription_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_lowstock_subscription_deleted_at" ON "lowstock_subscription" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_lowstock_subscription_variant_id_sales_channel_id_email_unique" ON "lowstock_subscription" (variant_id, sales_channel_id, email) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "lowstock_subscription" cascade;`);
  }

}
