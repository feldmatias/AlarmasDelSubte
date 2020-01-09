import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {UserInput} from "./UserInput";

@Entity()
@ObjectType()
export class User {

    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id!: number;

    @Column()
    @Field()
    username!: string;

    @Column()
    password!: string;

    @Column()
    @Field()
    token!: string;

    constructor(userInput?: UserInput) {
        if (userInput) {
            this.initialize(userInput);
        }
    }

    private initialize(userInput: UserInput): void {
        this.username = userInput.username;
        this.password = userInput.password;
        this.token = "token";
    }
}