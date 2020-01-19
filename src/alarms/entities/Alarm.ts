import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {Subway} from "../../subways/entities/Subway";
import {User} from "../../users/entities/User";
import {ArrayNotEmpty, Contains, IsDefined, IsMilitaryTime, IsNotEmpty, Validate} from "class-validator";
import {AlarmDaysValidation} from "../validation/AlarmDaysValidation";

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
    @Field(() => ID)
    id!: number;

    @Column()
    @Field()
    @IsNotEmpty({message: AlarmErrors.INVALID_NAME_ERROR})
    name!: string;

    @Column("simple-array")
    @Field(() => [String])
    @Validate(AlarmDaysValidation)
    days!: string[];

    @Column()
    @Field()
    @Contains(":", {message: AlarmErrors.INVALID_TIME_RANGE_ERROR})
    @IsMilitaryTime({message: AlarmErrors.INVALID_TIME_RANGE_ERROR})
    start!: string;

    @Column()
    @Field()
    @Contains(":", {message: AlarmErrors.INVALID_TIME_RANGE_ERROR})
    @IsMilitaryTime({message: AlarmErrors.INVALID_TIME_RANGE_ERROR})
    end!: string;

    @ManyToMany(() => Subway, {onDelete: "CASCADE"})
    @JoinTable()
    @Field(() => [Subway])
    @ArrayNotEmpty({message: AlarmErrors.INVALID_SUBWAYS_ERROR})
    subways!: Subway[];

    @ManyToOne(() => User, {onDelete: "CASCADE"})
    @IsDefined({message: AlarmErrors.INVALID_OWNER_ERROR})
    owner!: User;
}
