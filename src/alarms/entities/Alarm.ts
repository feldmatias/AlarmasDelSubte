import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {Subway} from "../../subways/entities/Subway";
import {User} from "../../users/entities/User";
import {Validate} from "class-validator";
import {AlarmDaysValidation} from "../validation/AlarmDaysValidation";
import {AlarmTimeValidation} from "../validation/AlarmTimeValidation";
import {AlarmEndTimeValidation} from "../validation/AlarmEndTimeValidation";
import {AlarmNameValidation} from "../validation/AlarmNameValidation";
import {AlarmSubwaysValidation} from "../validation/AlarmSubwaysValidation";
import {AlarmOwnerValidation} from "../validation/AlarmOwnerValidation";
import {AlarmInput} from "./AlarmInput";
import {AlarmPartialInput} from "./AlarmPartialInput";

@Entity()
@ObjectType()
export class Alarm {

    @PrimaryGeneratedColumn()
    @Field(_type => ID)
    public id!: number;

    @Column()
    @Field()
    @Validate(AlarmNameValidation)
    public name!: string;

    @Column("simple-array")
    @Field(_type => [String])
    @Validate(AlarmDaysValidation)
    public days!: string[];

    @Column()
    @Field()
    @Validate(AlarmTimeValidation)
    public start!: string;

    @Column()
    @Field()
    @Validate(AlarmEndTimeValidation)
    public end!: string;

    @ManyToMany(_type => Subway, {onDelete: "CASCADE"})
    @JoinTable()
    @Field(_type => [Subway])
    @Validate(AlarmSubwaysValidation)
    public subways!: Subway[];

    @ManyToOne(_type => User, {onDelete: "CASCADE"})
    @Validate(AlarmOwnerValidation)
    public owner!: User;

    public constructor(alarmInput?: AlarmInput) {
        if (alarmInput) {
            this.initialize(alarmInput);
        }
    }

    private initialize(alarmInput: AlarmInput|AlarmPartialInput): void {
        this.name = alarmInput.name ? alarmInput.name : this.name;
        this.days = alarmInput.days ? alarmInput.days : this.days;
        this.start = alarmInput.start ? alarmInput.start : this.start;
        this.end = alarmInput.end ? alarmInput.end : this.end;
        const subwaysInput = alarmInput.getSubways();
        this.subways = subwaysInput ? subwaysInput : this.subways;
        this.owner = alarmInput.getOwner();
    }

    public update(alarmInput: AlarmPartialInput): void {
        this.initialize(alarmInput);
    }
}
