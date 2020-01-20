import {Field, InputType} from "type-graphql";
import {Subway} from "../../subways/entities/Subway";
import {User} from "../../users/entities/User";

@InputType()
export class AlarmInput {

    @Field()
    name!: string;

    @Field(_type => [String])
    days!: string[];

    @Field()
    start!: string;

    @Field()
    end!: string;

    @Field(_type => [String])
    subwayLines!: string[];

    private subways!: Subway[];

    private owner!: User;

    setSubways(subways: Array<Subway>): void {
        this.subways = subways;
    }

    getSubways(): Subway[] {
        return this.subways;
    }

    setOwner(owner: User): void {
        this.owner = owner;
    }

    getOwner(): User {
        return this.owner;
    }
}
