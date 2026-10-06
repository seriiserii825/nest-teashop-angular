import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductTitleUniquePerStore1790300000001 implements MigrationInterface {
    name = 'ProductTitleUniquePerStore1790300000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Существующие дубли title в пределах стора: первый (по createdAt) оставляем, остальным — " (2)", " (3)", ...
        // slug не трогаем — он уже уникален и на него могут вести ссылки
        await queryRunner.query(`
            WITH numbered AS (
                SELECT "id", row_number() OVER (PARTITION BY "storeId", "title" ORDER BY "createdAt", "id") AS "n"
                FROM "products"
            )
            UPDATE "products" p
            SET "title" = p."title" || ' (' || numbered."n" || ')'
            FROM numbered
            WHERE p."id" = numbered."id" AND numbered."n" > 1
        `);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "UQ_eb9ae680299c3c1c14c0e12e2e2" UNIQUE ("storeId", "title")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "UQ_eb9ae680299c3c1c14c0e12e2e2"`);
    }

}
