import {Alarm} from "./Alarm";
import {Field, InputType} from "type-graphql";
import {Subway} from "../../subways/entities/Subway";

@InputType()
export class AlarmInput extends Alarm implements Partial<Alarm> {

    @Field(_type => [String])
    subwayLines!: string[];

    setSubways(subways: Array<Subway>): void {
        this.subways = subways;
    }
}
