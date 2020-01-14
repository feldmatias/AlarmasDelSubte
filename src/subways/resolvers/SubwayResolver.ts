import {Query, Resolver} from "type-graphql";
import {SubwayService} from "../SubwayService";
import {Subway} from "../entities/Subway";

@Resolver()
export class SubwayResolver {

    constructor(private service: SubwayService) {
    }

    @Query(() => [Subway])
    async getSubways(): Promise<Array<Subway>> {
        let subways = await this.service.getAll();
        return subways.sort((a, b) => {
            return a.line.localeCompare(b.line);
        })
    }
}