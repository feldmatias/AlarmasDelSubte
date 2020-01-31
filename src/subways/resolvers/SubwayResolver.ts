import {Query, Resolver} from "type-graphql";
import {SubwayService} from "../SubwayService";
import {Subway} from "../entities/Subway";

@Resolver()
export class SubwayResolver {

    public constructor(private service: SubwayService) {
    }

    @Query(_returns => [Subway], {nullable: true})
    public async getSubways(): Promise<Array<Subway>> {
        return await this.service.getAll();
    }
}
