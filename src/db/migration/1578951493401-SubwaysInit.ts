import {MigrationInterface, QueryRunner} from "typeorm";
import {String} from "typescript-string-operations";

export class SubwaysInit1578951493401 implements MigrationInterface {

    private readonly SUBWAYS = ["A", "B", "C", "D", "E", "H", "P"];
    private readonly ICONS_URL = "https://raw.githubusercontent.com/feldmatias/AlarmasDelSubte/master/static/images/line{0}.png";

    public async up(queryRunner: QueryRunner): Promise<any> {
        let insertValues = new Array<string>();
        this.SUBWAYS.forEach(subway => {
            insertValues.push(`("${subway}", "${String.Format(this.ICONS_URL, subway)}")`);
        });

        let query = `INSERT INTO "subway" ("line", "icon") VALUES ${String.Join(",", insertValues)}`;
        await queryRunner.query(query, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DELETE FROM "subway" WHERE "line" IN ("A", "B", "C", "D", "E", "H", "P")`);
    }

}
