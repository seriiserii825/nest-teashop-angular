import { MigrationInterface, QueryRunner } from "typeorm";

export class StoreTitleUniquePerUser1789504000249 implements MigrationInterface {
    name = 'StoreTitleUniquePerUser1789504000249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "UQ_1ef0a3be4129866f2db75c761d9"`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "UQ_9f50895fbf54f7218dfa5b66e48" UNIQUE ("userId", "title")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "UQ_9f50895fbf54f7218dfa5b66e48"`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "UQ_1ef0a3be4129866f2db75c761d9" UNIQUE ("title")`);
    }

}
