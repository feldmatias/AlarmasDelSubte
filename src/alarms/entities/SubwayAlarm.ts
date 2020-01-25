import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Alarm} from "./Alarm";
import {Subway} from "../../subways/entities/Subway";
import {LastAlarmSent} from "./LastAlarmSent";

@Entity()
export class SubwayAlarm {

    @PrimaryGeneratedColumn()
    public id!: number;

    @Column(_type => LastAlarmSent)
    public lastAlarmSent!: LastAlarmSent;

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