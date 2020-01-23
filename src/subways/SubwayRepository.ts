import {Service} from "typedi";
import {Subway} from "./entities/Subway";
import {InjectRepository} from "typeorm-typedi-extensions";
import {In, Repository} from "typeorm";

@Service()
export class SubwayRepository {

    public constructor(@InjectRepository(Subway) private repository: Repository<Subway>) {
    }

    public async getAllOrdered(): Promise<Array<Subway>> {
        return this.repository.find({
            order: {
                line: "ASC"
            }
        });
    }

    public async findByLines(lines: string[]): Promise<Array<Subway>> {
        return await this.repository.find({
            where: {line: In(lines)}
        });
    }

    public async update(subway: Subway): Promise<void> {
        await this.repository.save(subway);
    }
}