import {Query, Resolver} from "type-graphql";
import {SubwayService} from "../SubwayService";
import {Subway} from "../entities/Subway";

@Resolver()
export class SubwayResolver {

    constructor(private service: SubwayService) {
    }

    @Query(() => [Subway])
    async getSubways(): Promise<Array<Subway>> {
        return await this.service.getAll();
    }
}