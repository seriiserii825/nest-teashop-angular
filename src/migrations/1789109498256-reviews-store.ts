import { MigrationInterface, QueryRunner } from "typeorm";

export class ReviewsStore1789109498256 implements MigrationInterface {
    name = 'ReviewsStore1789109498256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" ADD "storeId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_375e254056be23e89da0ef9ce13" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_375e254056be23e89da0ef9ce13"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "storeId"`);
    }

}
