import {Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Alarm} from "./Alarm";
import {Subway} from "../../subways/entities/Subway";

@Entity()
export class SubwayAlarm {

    @PrimaryGeneratedColumn()
    public id!: number;

    @ManyToOne(_type => Alarm, alarm => alarm.subwayAlarms, {onDelete: "CASCADE"})
    public alarm!: Alarm;

    @ManyToOne(_type => Subway, {onDelete: "CASCADE"})
    public subway!: Subway;

    public constructor(alarm?: Alarm, subway?: Subway) {
        if (subway && alarm) {
            this.subway = subway;
            this.alarm = alarm;
        }
    }

}