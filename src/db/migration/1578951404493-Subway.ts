import {MigrationInterface, QueryRunner} from "typeorm";

export class Subway1578951404493 implements MigrationInterface {
    name = 'Subway1578951404493'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "subway" ("line" varchar PRIMARY KEY NOT NULL, "icon" varchar NOT NULL, "status" varchar NOT NULL DEFAULT ('Normal'), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "subway"`, undefined);
    }

}
