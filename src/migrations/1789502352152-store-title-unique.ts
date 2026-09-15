import { MigrationInterface, QueryRunner } from "typeorm";

export class StoreTitleUnique1789502352152 implements MigrationInterface {
    name = 'StoreTitleUnique1789502352152'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "UQ_1ef0a3be4129866f2db75c761d9" UNIQUE ("title")`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "UQ_820f6dbd690e2cb63beb6ab0e4e"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "UQ_820f6dbd690e2cb63beb6ab0e4e" UNIQUE ("description")`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "UQ_1ef0a3be4129866f2db75c761d9"`);
    }

}
