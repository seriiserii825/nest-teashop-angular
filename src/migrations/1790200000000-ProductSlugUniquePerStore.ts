import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductSlugUniquePerStore1790200000000 implements MigrationInterface {
    name = 'ProductSlugUniquePerStore1790200000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "slug" character varying`);
        // Backfill существующих продуктов: slug из title, дубли в пределах стора получают суффикс -2, -3, ...
        await queryRunner.query(`
            WITH base AS (
                SELECT "id", "storeId",
                       COALESCE(NULLIF(trim(both '-' from regexp_replace(lower("title"), '[^a-z0-9]+', '-', 'g')), ''), 'product') AS "slug"
                FROM "products"
            ), numbered AS (
                SELECT "id", "slug",
                       row_number() OVER (PARTITION BY "storeId", "slug" ORDER BY "id") AS "n"
                FROM base
            )
            UPDATE "products" p
            SET "slug" = CASE WHEN numbered."n" = 1 THEN numbered."slug" ELSE numbered."slug" || '-' || numbered."n" END
            FROM numbered
            WHERE p."id" = numbered."id"
        `);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "slug" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "UQ_9844b96a2b5b3620eee675f805f" UNIQUE ("storeId", "slug")`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "CHK_457f556dde111a9d56b9a34b91" CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "CHK_457f556dde111a9d56b9a34b91"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "UQ_9844b96a2b5b3620eee675f805f"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "slug"`);
    }

}
