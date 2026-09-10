import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductCreate1789035959093 implements MigrationInterface {
    name = 'ProductCreate1789035959093'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "price" integer NOT NULL, "images" text NOT NULL, "storeId" uuid NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_433f0ea20c848a3c0421c7d2453" UNIQUE ("description"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_782da5e50e94b763eb63225d69d" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_782da5e50e94b763eb63225d69d"`);
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
