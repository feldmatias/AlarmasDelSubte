import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {UserInput} from "./UserInput";
import {Md5} from "ts-md5";
import {TokenGenerator} from "ts-token-generator";
import {IsNotEmpty} from "class-validator";

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
    private password!: string;

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
        this.password = Md5.hashStr(userInput.password) as string;
        this.token = new TokenGenerator().generate();
    }

    public getPassword(): string {
        return this.password;
    }
}