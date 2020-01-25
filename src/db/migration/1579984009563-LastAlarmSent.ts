import {MigrationInterface, QueryRunner} from "typeorm";

export class LastAlarmSent1579984009563 implements MigrationInterface {
    name = 'LastAlarmSent1579984009563'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "temporary_subway_alarm" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "alarmId" integer, "subwayLine" varchar, "lastAlarmSentStatus" varchar NOT NULL DEFAULT (''), "lastAlarmSentDate" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_84fbd8417b3d1c20218cd2003b4" FOREIGN KEY ("subwayLine") REFERENCES "subway" ("line") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_3da504025e9d9f7c990d4c27e53" FOREIGN KEY ("alarmId") REFERENCES "alarm" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_subway_alarm"("id", "alarmId", "subwayLine") SELECT "id", "alarmId", "subwayLine" FROM "subway_alarm"`, undefined);
        await queryRunner.query(`DROP TABLE "subway_alarm"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_subway_alarm" RENAME TO "subway_alarm"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "subway_alarm" RENAME TO "temporary_subway_alarm"`, undefined);
        await queryRunner.query(`CREATE TABLE "subway_alarm" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "alarmId" integer, "subwayLine" varchar, CONSTRAINT "FK_84fbd8417b3d1c20218cd2003b4" FOREIGN KEY ("subwayLine") REFERENCES "subway" ("line") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_3da504025e9d9f7c990d4c27e53" FOREIGN KEY ("alarmId") REFERENCES "alarm" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "subway_alarm"("id", "alarmId", "subwayLine") SELECT "id", "alarmId", "subwayLine" FROM "temporary_subway_alarm"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_subway_alarm"`, undefined);
    }

}
