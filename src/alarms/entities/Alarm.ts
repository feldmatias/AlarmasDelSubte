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

@Entity()
@ObjectType()
export class Alarm {

    @PrimaryGeneratedColumn()
    @Field(_type => ID)
    id!: number;

    @Column()
    @Field()
    @Validate(AlarmNameValidation)
    name!: string;

    @Column("simple-array")
    @Field(_type => [String])
    @Validate(AlarmDaysValidation)
    days!: string[];

    @Column()
    @Field()
    @Validate(AlarmTimeValidation)
    start!: string;

    @Column()
    @Field()
    @Validate(AlarmEndTimeValidation)
    end!: string;

    @ManyToMany(_type => Subway, {onDelete: "CASCADE"})
    @JoinTable()
    @Field(_type => [Subway])
    @Validate(AlarmSubwaysValidation)
    subways!: Subway[];

    @ManyToOne(_type => User, {onDelete: "CASCADE"})
    @Validate(AlarmOwnerValidation)
    owner!: User;

    constructor(alarmInput?: AlarmInput) {
        if (alarmInput) {
            this.initialize(alarmInput);
        }
    }

    private initialize(alarmInput: AlarmInput): void {
        this.name = alarmInput.name;
        this.days = alarmInput.days;
        this.start = alarmInput.start;
        this.end = alarmInput.end;
        this.subways = alarmInput.getSubways();
        this.owner = alarmInput.getOwner();
    }
}
