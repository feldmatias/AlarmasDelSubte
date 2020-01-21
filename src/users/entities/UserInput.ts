import {Field, InputType} from "type-graphql";
import {Validate} from "class-validator";
import {UserUsernameValidation} from "../validation/UserUsernameValidation";
import {UserPasswordValidation} from "../validation/UserPasswordValidation";

@InputType()
export class UserInput {

    @Field()
    @Validate(UserUsernameValidation)
    public username!: string;

    @Field()
    @Validate(UserPasswordValidation)
    public password!: string;
}