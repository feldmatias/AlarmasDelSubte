import {Service} from "typedi";
import {Subway} from "./entities/Subway";
import {InjectRepository} from "typeorm-typedi-extensions";
import {Repository} from "typeorm";

@Service()
export class SubwayRepository {

    constructor(@InjectRepository(Subway) private repository: Repository<Subway>) {
    }

    async getAll(): Promise<Array<Subway>> {
        return this.repository.find();
    }
}