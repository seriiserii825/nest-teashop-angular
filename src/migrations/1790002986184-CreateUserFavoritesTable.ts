import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserFavoritesTable1790002986184 implements MigrationInterface {
    name = 'CreateUserFavoritesTable1790002986184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_99d90c2a483d79f3b627fb1d5e9"`);
        await queryRunner.query(`CREATE TABLE "user_favorites" ("usersId" uuid NOT NULL, "productsId" uuid NOT NULL, CONSTRAINT "PK_5065e45fbc2a1f3e58a6fd9a430" PRIMARY KEY ("usersId", "productsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9b10bf53f6d16b355ce259098d" ON "user_favorites"  ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_152cb1955a8e956ffb7645fdf4" ON "user_favorites"  ("productsId") `);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user_favorites" ADD CONSTRAINT "FK_9b10bf53f6d16b355ce259098d0" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_favorites" ADD CONSTRAINT "FK_152cb1955a8e956ffb7645fdf40" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_favorites" DROP CONSTRAINT "FK_152cb1955a8e956ffb7645fdf40"`);
        await queryRunner.query(`ALTER TABLE "user_favorites" DROP CONSTRAINT "FK_9b10bf53f6d16b355ce259098d0"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_152cb1955a8e956ffb7645fdf4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9b10bf53f6d16b355ce259098d"`);
        await queryRunner.query(`DROP TABLE "user_favorites"`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_99d90c2a483d79f3b627fb1d5e9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
