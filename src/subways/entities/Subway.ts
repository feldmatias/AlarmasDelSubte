import {Column, Entity, PrimaryColumn, UpdateDateColumn} from "typeorm";
import {Field, ObjectType} from "type-graphql";
import {SubwayStatus, SubwayStatusHelper} from "../SubwayStatus";
import {UpdatedSubwayStatus} from "../status/UpdatedSubwayStatus";

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

    @UpdateDateColumn({default: () => "CURRENT_TIMESTAMP"})
    @Field()
    public updatedAt!: Date;

    @Field(_type => SubwayStatus)
    public statusType(): SubwayStatus {
        return SubwayStatusHelper.getSubwayStatus(this.status);
    }

    public updateStatus(updatedStatus?: UpdatedSubwayStatus): void {
        this.status = updatedStatus?.status ? updatedStatus.status : SubwayStatusHelper.NORMAL_STATUS_MESSAGE;
    }

    public equals(other: Subway): boolean {
        return this.line == other.line;
    }
}