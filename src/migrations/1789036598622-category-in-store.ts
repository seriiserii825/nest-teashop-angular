import { MigrationInterface, QueryRunner } from "typeorm";

export class CategoryInStore1789036598622 implements MigrationInterface {
    name = 'CategoryInStore1789036598622'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ADD "storeId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_fa6ba3528de12e174b163c09fdd" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_fa6ba3528de12e174b163c09fdd"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "storeId"`);
    }

}
