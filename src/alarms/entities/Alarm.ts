import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {Subway} from "../../subways/entities/Subway";
import {User} from "../../users/entities/User";

@Entity()
@ObjectType()
export class Alarm {

    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id!: number;

    @Column()
    @Field()
    name!: string;

    @Column("simple-array")
    @Field(() => [String])
    days!: string[];

    @Column()
    @Field()
    start!: string;

    @Column()
    @Field()
    end!: string;

    @ManyToMany(() => Subway, {onDelete: "CASCADE"})
    @JoinTable()
    @Field(() => [Subway])
    subways!: Subway[];

    @ManyToOne(() => User, {onDelete: "CASCADE"})
    @Field()
    owner!: User;
}