import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {UserInput} from "./UserInput";
import {Md5} from "ts-md5";
import {TokenGenerator} from "ts-token-generator";

@Entity()
@ObjectType()
export class User {

    @PrimaryGeneratedColumn()
    @Field(_type => ID)
    private id!: number;

    @Column({unique: true})
    @Field()
    public username!: string;

    @Column()
    private password!: string;

    @Column()
    @Field()
    public token!: string;

    @Column({default: ""})
    public firebaseToken!: string;

    public constructor(userInput?: UserInput) {
        if (userInput) {
            this.initialize(userInput);
        }
    }

    private initialize(userInput: UserInput): void {
        this.username = userInput.username;
        this.password = Md5.hashStr(userInput.password) as string;
        this.token = new TokenGenerator().generate();
    }

    public checkPassword(otherPassword: string): boolean {
        return this.password == Md5.hashStr(otherPassword) as string;
    }

    public equals(other: User): boolean {
        return this.id === other.id;
    }

    public getId(): number {
        return this.id;
    }
}