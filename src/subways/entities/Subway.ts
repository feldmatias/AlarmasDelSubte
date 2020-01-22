import {Column, Entity, PrimaryColumn, UpdateDateColumn} from "typeorm";
import {Field, ObjectType} from "type-graphql";
import {SubwayStatus, SubwayStatusHelper} from "../SubwayStatus";

@Entity()
@ObjectType()
export class Subway {

    @PrimaryColumn()
    @Field()
    public line!: string;

    @Column()
    @Field()
    public icon!: string;

    @Column({default: SubwayStatusHelper.NORMAL_STATUS_MESSAGE})
    @Field()
    public status!: string;

    @UpdateDateColumn()
    @Field()
    public updatedAt!: Date;

    @Field(_type => SubwayStatus)
    public statusType(): SubwayStatus {
        return SubwayStatusHelper.getSubwayStatus(this.status);
    }
}