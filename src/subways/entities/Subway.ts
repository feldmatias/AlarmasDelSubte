import {Column, Entity, PrimaryColumn, UpdateDateColumn} from "typeorm";
import {Field, ObjectType} from "type-graphql";

@Entity()
@ObjectType()
export class Subway {

    static readonly NORMAL_STATUS = "Normal";

    @PrimaryColumn()
    @Field()
    line!: string;

    @Column()
    @Field()
    icon!: string;

    @Column({default: Subway.NORMAL_STATUS})
    @Field()
    status!: string;

    @UpdateDateColumn()
    @Field()
    updatedAt!: Date;
}