import {Service} from "typedi";
import {Subway} from "./entities/Subway";
import {InjectRepository} from "typeorm-typedi-extensions";
import {In, Repository} from "typeorm";

@Service()
export class SubwayRepository {

    constructor(@InjectRepository(Subway) private repository: Repository<Subway>) {
    }

    async getAllOrdered(): Promise<Array<Subway>> {
        return this.repository.find({
            order: {
                line: "ASC"
            }
        });
    }

    async findByLines(lines: string[]): Promise<Array<Subway>> {
        return await this.repository.find({
            where: {line: In(lines)}
        });
    }
}