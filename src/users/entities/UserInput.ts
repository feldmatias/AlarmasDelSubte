import {Field, InputType} from "type-graphql";
import {IsNotEmpty, MinLength} from "class-validator";

@InputType()
export class UserInput {

    private static PASSWORD_MIN_LENGTH = 6;
    public static INVALID_PASSWORD_ERROR = "INVALID_PASSWORD";

    public static INVALID_USERNAME_ERROR = "INVALID_USERNAME";

    @Field()
    @IsNotEmpty({message: UserInput.INVALID_USERNAME_ERROR})
    username!: string;

    @Field()
    @MinLength(UserInput.PASSWORD_MIN_LENGTH, {message: UserInput.INVALID_PASSWORD_ERROR})
    password!: string;
}