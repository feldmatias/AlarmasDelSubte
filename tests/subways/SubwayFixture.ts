import {Subway} from "../../src/subways/entities/Subway";
import {getConnection} from "typeorm";

export class SubwayFixture {

    public static async createSubway(line = "subway", status = "status"): Promise<Subway> {
        const subway = new Subway();
        subway.line = line;
        subway.icon = "icon";
        subway.status = status;

        return await getConnection().getRepository(Subway).save(subway);
    }

    public static async createSubwayWithUpdatedAt(line = "subway", updatedAt = new Date()): Promise<Subway> {
        const subway = new Subway();
        subway.line = line;
        subway.icon = "icon";
        subway.status = "status";
        subway.updatedAt = updatedAt;

        await getConnection()
            .createQueryBuilder()
            .insert()
            .into(Subway)
            .values({...subway})
            .execute();

        return subway;
    }
}