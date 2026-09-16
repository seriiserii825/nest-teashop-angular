import { MigrationInterface, QueryRunner } from "typeorm";

export class ColorUniquePerStore1789581382969 implements MigrationInterface {
    name = 'ColorUniquePerStore1789581382969'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "colors" DROP CONSTRAINT "UQ_cf12321fa0b7b9539e89c7dfeb7"`);
        await queryRunner.query(`ALTER TABLE "colors" ADD CONSTRAINT "UQ_d0546798ebd98f0ffb35f3a2f0c" UNIQUE ("storeId", "name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "colors" DROP CONSTRAINT "UQ_d0546798ebd98f0ffb35f3a2f0c"`);
        await queryRunner.query(`ALTER TABLE "colors" ADD CONSTRAINT "UQ_cf12321fa0b7b9539e89c7dfeb7" UNIQUE ("name")`);
    }

}
