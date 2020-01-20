import {Field, InputType} from "type-graphql";
import {Validate} from "class-validator";
import {UserUsernameValidation} from "../validation/UserUsernameValidation";
import {UserPasswordValidation} from "../validation/UserPasswordValidation";

@InputType()
export class UserInput {

    @Field()
    @Validate(UserUsernameValidation)
    username!: string;

    @Field()
    @Validate(UserPasswordValidation)
    password!: string;
}