import {Field, InputType} from "type-graphql";
import {Subway} from "../../subways/entities/Subway";
import {User} from "../../users/entities/User";

@InputType()
export class AlarmPartialInput {

    @Field({nullable: true})
    name?: string;

    @Field(_type => [String], {nullable: true})
    days?: string[];

    @Field({nullable: true})
    start?: string;

    @Field({nullable: true})
    end?: string;

    @Field(_type => [String], {nullable: true})
    subwayLines?: string[];

    private subways?: Subway[];

    private owner!: User;

    setSubways(subways: Array<Subway>): void {
        this.subways = subways;
    }

    getSubways(): Subway[] | undefined {
        return this.subways;
    }

    setOwner(owner: User): void {
        this.owner = owner;
    }

    getOwner(): User {
        return this.owner;
    }
}
