import {Field, InputType} from "type-graphql";
import {IsNotEmpty} from "class-validator";

@InputType()
export class UserInput {

    public static INVALID_USERNAME_ERROR = "INVALID_USERNAME";

    @Field()
    @IsNotEmpty({message: UserInput.INVALID_USERNAME_ERROR})
    username!: string;

    @Field()
    password!: string;
}