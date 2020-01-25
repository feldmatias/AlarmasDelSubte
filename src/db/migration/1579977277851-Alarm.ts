import {MigrationInterface, QueryRunner} from "typeorm";

export class Alarm1579977277851 implements MigrationInterface {
    name = 'Alarm1579977277851'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "alarm" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "days" text NOT NULL, "start" varchar NOT NULL, "end" varchar NOT NULL, "ownerId" integer, CONSTRAINT "FK_b44f4d66e4cb72a46e4fbb7f447" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`CREATE TABLE "subway_alarm" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "alarmId" integer, "subwayLine" varchar, CONSTRAINT "FK_3da504025e9d9f7c990d4c27e53" FOREIGN KEY ("alarmId") REFERENCES "alarm" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_84fbd8417b3d1c20218cd2003b4" FOREIGN KEY ("subwayLine") REFERENCES "subway" ("line") ON DELETE CASCADE ON UPDATE NO ACTION)`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "subway_alarm"`, undefined);
        await queryRunner.query(`DROP TABLE "alarm"`, undefined);
    }

}
