import {Subway} from "../../src/subways/entities/Subway";
import {getConnection} from "typeorm";

export class SubwayFixture {

    private subway: Subway;

    public constructor() {
        this.subway = new Subway();
        this.subway.line = "subway";
        this.subway.icon = "icon";
        this.subway.status = "status";
    }

    public withLine(line: string): SubwayFixture {
        this.subway.line = line;
        return this;
    }

    public withStatus(status: string): SubwayFixture {
        this.subway.status = status;
        return this;
    }

    public withUpdatedAt(updatedAt = new Date()): SubwayFixture {
        this.subway.updatedAt = updatedAt;
        return this;
    }

    public async createSubway(): Promise<Subway> {
        if (this.subway.updatedAt) {
            await getConnection()
                .createQueryBuilder()
                .insert()
                .into(Subway)
                .values({...this.subway})
                .execute();

            return this.subway;
        }

        return await getConnection().getRepository(Subway).save(this.subway);
    }
}