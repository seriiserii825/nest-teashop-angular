import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductDescriptionNotUnique1790100000000 implements MigrationInterface {
    name = 'ProductDescriptionNotUnique1790100000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "UQ_433f0ea20c848a3c0421c7d2453"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "UQ_433f0ea20c848a3c0421c7d2453" UNIQUE ("description")`);
    }

}
