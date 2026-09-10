import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateColor1789036992140 implements MigrationInterface {
    name = 'CreateColor1789036992140'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "colors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "value" character varying NOT NULL, "storeId" uuid NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_cf12321fa0b7b9539e89c7dfeb7" UNIQUE ("name"), CONSTRAINT "PK_3a62edc12d29307872ab1777ced" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ADD "colorId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "UQ_aa79448dc3e959720ab4c13651d" UNIQUE ("title")`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "UQ_379537fd28d1aa90393d82e9214"`);
        await queryRunner.query(`ALTER TABLE "colors" ADD CONSTRAINT "FK_517a6de81f2486324e0cdf5f0bd" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_977ca0c3cae8850c2a5f49e3f13" FOREIGN KEY ("colorId") REFERENCES "colors"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_977ca0c3cae8850c2a5f49e3f13"`);
        await queryRunner.query(`ALTER TABLE "colors" DROP CONSTRAINT "FK_517a6de81f2486324e0cdf5f0bd"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "UQ_379537fd28d1aa90393d82e9214" UNIQUE ("description")`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "UQ_aa79448dc3e959720ab4c13651d"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "colorId"`);
        await queryRunner.query(`DROP TABLE "colors"`);
    }

}
