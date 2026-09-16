import { MigrationInterface, QueryRunner } from "typeorm";

export class CategoryTitleUniquePerStore1789590715493 implements MigrationInterface {
    name = 'CategoryTitleUniquePerStore1789590715493'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "UQ_aa79448dc3e959720ab4c13651d"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "UQ_00cd8c23464066489091473647d" UNIQUE ("storeId", "title")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "UQ_00cd8c23464066489091473647d"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "UQ_aa79448dc3e959720ab4c13651d" UNIQUE ("title")`);
    }

}
