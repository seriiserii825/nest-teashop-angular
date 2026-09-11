import { MigrationInterface, QueryRunner } from "typeorm";

export class OrderItemsStore1789111127556 implements MigrationInterface {
    name = 'OrderItemsStore1789111127556'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" ADD "storeId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_76b4a6406b4a79c62d165260a9c" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_76b4a6406b4a79c62d165260a9c"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "storeId"`);
    }

}
