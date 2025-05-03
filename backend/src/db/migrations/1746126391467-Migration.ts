import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1746126391467 implements MigrationInterface {
    name = 'Migration1746126391467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "marcas" DROP COLUMN "nome"`);
        await queryRunner.query(`ALTER TABLE "marcas" ADD "nome" character varying(50) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "marcas" DROP COLUMN "nome"`);
        await queryRunner.query(`ALTER TABLE "marcas" ADD "nome" character varying NOT NULL`);
    }

}
