import {Field, InputType} from "type-graphql";
import {Subway} from "../../subways/entities/Subway";
import {User} from "../../users/entities/User";

@InputType()
export class AlarmInput {

    @Field()
    public name!: string;

    @Field(_type => [String])
    public days!: string[];

    @Field()
    public start!: string;

    @Field()
    public end!: string;

    @Field(_type => [String])
    public subwayLines!: string[];

    private subways!: Subway[];

    private owner!: User;

    public setSubways(subways: Array<Subway>): void {
        this.subways = subways;
    }

    public getSubways(): Subway[] {
        return this.subways;
    }

    public setOwner(owner: User): void {
        this.owner = owner;
    }

    public getOwner(): User {
        return this.owner;
    }
}
