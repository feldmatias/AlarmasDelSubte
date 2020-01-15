import {Column, Entity, PrimaryColumn, UpdateDateColumn} from "typeorm";
import {Field, ObjectType} from "type-graphql";
import {SubwayStatus, SubwayStatusHelper} from "../SubwayStatus";

@Entity()
@ObjectType()
export class Subway {

    @PrimaryColumn()
    @Field()
    line!: string;

    @Column()
    @Field()
    icon!: string;

    @Column({default: SubwayStatusHelper.NORMAL_STATUS_MESSAGE})
    @Field()
    status!: string;

    @UpdateDateColumn()
    @Field()
    updatedAt!: Date;

    @Field(() => SubwayStatus)
    statusType(): SubwayStatus {
        return SubwayStatusHelper.getSubwayStatus(this.status);
    }
}