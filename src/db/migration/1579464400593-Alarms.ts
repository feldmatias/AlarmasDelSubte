import {MigrationInterface, QueryRunner} from "typeorm";

export class Alarms1579464400593 implements MigrationInterface {
    name = 'Alarms1579464400593'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "alarm" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "days" text NOT NULL, "start" varchar NOT NULL, "end" varchar NOT NULL, "ownerId" integer)`, undefined);
        await queryRunner.query(`CREATE TABLE "alarm_subways_subway" ("alarmId" integer NOT NULL, "subwayLine" varchar NOT NULL, PRIMARY KEY ("alarmId", "subwayLine"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_7700ccffe4b86bf6f9d6d6ad77" ON "alarm_subways_subway" ("alarmId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_a2cd336904daf1013073e292b1" ON "alarm_subways_subway" ("subwayLine") `, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_alarm" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "days" text NOT NULL, "start" varchar NOT NULL, "end" varchar NOT NULL, "ownerId" integer, CONSTRAINT "FK_b44f4d66e4cb72a46e4fbb7f447" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_alarm"("id", "name", "days", "start", "end", "ownerId") SELECT "id", "name", "days", "start", "end", "ownerId" FROM "alarm"`, undefined);
        await queryRunner.query(`DROP TABLE "alarm"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_alarm" RENAME TO "alarm"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_7700ccffe4b86bf6f9d6d6ad77"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_a2cd336904daf1013073e292b1"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_alarm_subways_subway" ("alarmId" integer NOT NULL, "subwayLine" varchar NOT NULL, CONSTRAINT "FK_7700ccffe4b86bf6f9d6d6ad771" FOREIGN KEY ("alarmId") REFERENCES "alarm" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_a2cd336904daf1013073e292b17" FOREIGN KEY ("subwayLine") REFERENCES "subway" ("line") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("alarmId", "subwayLine"))`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_alarm_subways_subway"("alarmId", "subwayLine") SELECT "alarmId", "subwayLine" FROM "alarm_subways_subway"`, undefined);
        await queryRunner.query(`DROP TABLE "alarm_subways_subway"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_alarm_subways_subway" RENAME TO "alarm_subways_subway"`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_7700ccffe4b86bf6f9d6d6ad77" ON "alarm_subways_subway" ("alarmId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_a2cd336904daf1013073e292b1" ON "alarm_subways_subway" ("subwayLine") `, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_a2cd336904daf1013073e292b1"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_7700ccffe4b86bf6f9d6d6ad77"`, undefined);
        await queryRunner.query(`ALTER TABLE "alarm_subways_subway" RENAME TO "temporary_alarm_subways_subway"`, undefined);
        await queryRunner.query(`CREATE TABLE "alarm_subways_subway" ("alarmId" integer NOT NULL, "subwayLine" varchar NOT NULL, PRIMARY KEY ("alarmId", "subwayLine"))`, undefined);
        await queryRunner.query(`INSERT INTO "alarm_subways_subway"("alarmId", "subwayLine") SELECT "alarmId", "subwayLine" FROM "temporary_alarm_subways_subway"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_alarm_subways_subway"`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_a2cd336904daf1013073e292b1" ON "alarm_subways_subway" ("subwayLine") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_7700ccffe4b86bf6f9d6d6ad77" ON "alarm_subways_subway" ("alarmId") `, undefined);
        await queryRunner.query(`ALTER TABLE "alarm" RENAME TO "temporary_alarm"`, undefined);
        await queryRunner.query(`CREATE TABLE "alarm" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "days" text NOT NULL, "start" varchar NOT NULL, "end" varchar NOT NULL, "ownerId" integer)`, undefined);
        await queryRunner.query(`INSERT INTO "alarm"("id", "name", "days", "start", "end", "ownerId") SELECT "id", "name", "days", "start", "end", "ownerId" FROM "temporary_alarm"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_alarm"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_a2cd336904daf1013073e292b1"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_7700ccffe4b86bf6f9d6d6ad77"`, undefined);
        await queryRunner.query(`DROP TABLE "alarm_subways_subway"`, undefined);
        await queryRunner.query(`DROP TABLE "alarm"`, undefined);
    }

}
