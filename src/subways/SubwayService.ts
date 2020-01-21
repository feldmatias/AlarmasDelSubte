import {Service} from "typedi";
import {Subway} from "./entities/Subway";
import {SubwayRepository} from "./SubwayRepository";


@Service()
export class SubwayService {

    public constructor(private repository: SubwayRepository) {
    }

    public async getAll(): Promise<Array<Subway>> {
        return await this.repository.getAllOrdered();
    }
}