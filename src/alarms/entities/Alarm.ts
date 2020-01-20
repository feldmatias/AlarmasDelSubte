import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {Subway} from "../../subways/entities/Subway";
import {User} from "../../users/entities/User";
import {ArrayNotEmpty, IsDefined, IsNotEmpty, Validate} from "class-validator";
import {AlarmDaysValidation} from "../validation/AlarmDaysValidation";
import {AlarmTimeValidation} from "../validation/AlarmTimeValidation";
import {AlarmEndTimeValidation} from "../validation/AlarmEndTimeValidation";

export class AlarmErrors {
    static INVALID_NAME_ERROR = "INVALID_ALARM_NAME_ERROR";
    static INVALID_DAYS_ERROR = "INVALID_ALARM_DAYS_ERROR";
    static INVALID_TIME_RANGE_ERROR = "INVALID_ALARM_TIME_RANGE_ERROR";
    static INVALID_SUBWAYS_ERROR = "INVALID_ALARM_SUBWAYS_ERROR";
    static INVALID_OWNER_ERROR = "INVALID_ALARM_OWNER_ERROR";
}

@Entity()
@ObjectType()
export class Alarm {

    @PrimaryGeneratedColumn()
    @Field(_type => ID)
    id!: number;

    @Column()
    @Field()
    @IsNotEmpty({message: AlarmErrors.INVALID_NAME_ERROR})
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
    @ArrayNotEmpty({message: AlarmErrors.INVALID_SUBWAYS_ERROR})
    subways!: Subway[];

    @ManyToOne(_type => User, {onDelete: "CASCADE"})
    @IsDefined({message: AlarmErrors.INVALID_OWNER_ERROR})
    owner!: User;
}
