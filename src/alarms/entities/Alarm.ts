import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {Subway} from "../../subways/entities/Subway";
import {User} from "../../users/entities/User";
import {ArrayNotEmpty, Contains, IsDefined, IsIn, IsMilitaryTime, IsNotEmpty} from "class-validator";

@Entity()
@ObjectType()
export class Alarm {

    static VALID_DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

    static INVALID_NAME_ERROR = "INVALID_ALARM_NAME_ERROR";
    static INVALID_DAYS_ERROR = "INVALID_ALARM_DAYS_ERROR";
    static INVALID_TIME_RANGE_ERROR = "INVALID_ALARM_TIME_RANGE_ERROR";
    static INVALID_SUBWAYS_ERROR = "INVALID_ALARM_SUBWAYS_ERROR";
    static INVALID_OWNER_ERROR = "INVALID_ALARM_OWNER_ERROR";

    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id!: number;

    @Column()
    @Field()
    @IsNotEmpty({message: Alarm.INVALID_NAME_ERROR})
    name!: string;

    @Column("simple-array")
    @Field(() => [String])
    @ArrayNotEmpty({message: Alarm.INVALID_DAYS_ERROR})
    @IsIn(Alarm.VALID_DAYS, {each: true, message: Alarm.INVALID_DAYS_ERROR})
    days!: string[];

    @Column()
    @Field()
    @Contains(":", {message: Alarm.INVALID_TIME_RANGE_ERROR})
    @IsMilitaryTime({message: Alarm.INVALID_TIME_RANGE_ERROR})
    start!: string;

    @Column()
    @Field()
    @Contains(":", {message: Alarm.INVALID_TIME_RANGE_ERROR})
    @IsMilitaryTime({message: Alarm.INVALID_TIME_RANGE_ERROR})
    end!: string;

    @ManyToMany(() => Subway, {onDelete: "CASCADE"})
    @JoinTable()
    @Field(() => [Subway])
    @ArrayNotEmpty({message: Alarm.INVALID_SUBWAYS_ERROR})
    subways!: Subway[];

    @ManyToOne(() => User, {onDelete: "CASCADE"})
    @IsDefined({message: Alarm.INVALID_OWNER_ERROR})
    owner!: User;
}