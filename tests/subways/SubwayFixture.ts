import {Subway} from "../../src/subways/entities/Subway";
import {getConnection} from "typeorm";

export class SubwayFixture {

    public static async createSubway(line = "A"): Promise<Subway> {
        const subway = new Subway();
        subway.line = line;
        subway.icon = "icon";

        return await getConnection().getRepository(Subway).save(subway);
    }
}