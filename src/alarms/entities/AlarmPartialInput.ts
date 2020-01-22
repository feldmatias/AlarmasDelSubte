import {Field, InputType} from "type-graphql";
import {Subway} from "../../subways/entities/Subway";
import {User} from "../../users/entities/User";

@InputType()
export class AlarmPartialInput {

    @Field({nullable: true})
    public name?: string;

    @Field(_type => [String], {nullable: true})
    public days?: string[];

    @Field({nullable: true})
    public start?: string;

    @Field({nullable: true})
    public end?: string;

    @Field(_type => [String], {nullable: true})
    public subwayLines?: string[];

    private subways?: Subway[];

    private owner!: User;

    public setSubways(subways: Array<Subway>): void {
        this.subways = subways;
    }

    public getSubways(): Subway[] | undefined {
        return this.subways;
    }

    public setOwner(owner: User): void {
        this.owner = owner;
    }

    public getOwner(): User {
        return this.owner;
    }
}
