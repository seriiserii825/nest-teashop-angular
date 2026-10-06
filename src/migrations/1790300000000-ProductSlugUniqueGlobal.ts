import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductSlugUniqueGlobal1790300000000 implements MigrationInterface {
    name = 'ProductSlugUniqueGlobal1790300000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "UQ_9844b96a2b5b3620eee675f805f"`);
        // Дубли slug между сторами: первый (по createdAt) оставляем как есть, остальным — суффикс -2, -3, ...
        // Суффикс берём после максимального уже занятого, чтобы не столкнуться с существующими slug-N
        await queryRunner.query(`
            WITH numbered AS (
                SELECT "id", "slug",
                       row_number() OVER (PARTITION BY "slug" ORDER BY "createdAt", "id") AS "n"
                FROM "products"
            ), taken AS (
                SELECT n."slug" AS "base",
                       COALESCE(MAX(substring(p."slug" FROM '-([0-9]+)$')::int)
                                FILTER (WHERE p."slug" ~ ('^' || n."slug" || '-[0-9]+$')), 1) AS "maxN"
                FROM (SELECT DISTINCT "slug" FROM numbered WHERE "n" > 1) n
                CROSS JOIN "products" p
                GROUP BY n."slug"
            )
            UPDATE "products" p
            SET "slug" = numbered."slug" || '-' || (taken."maxN" + numbered."n" - 1)
            FROM numbered
            JOIN taken ON taken."base" = numbered."slug"
            WHERE p."id" = numbered."id" AND numbered."n" > 1
        `);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "UQ_464f927ae360106b783ed0b4106" UNIQUE ("slug")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "UQ_464f927ae360106b783ed0b4106"`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "UQ_9844b96a2b5b3620eee675f805f" UNIQUE ("storeId", "slug")`);
    }

}
