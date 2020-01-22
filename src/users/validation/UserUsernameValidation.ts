import {Validator, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";

@ValidatorConstraint()
export class UserUsernameValidation implements ValidatorConstraintInterface {

    public static readonly ERROR = "INVALID_USERNAME";

    public validate(username: string): boolean {
        const validator = new Validator();
        return validator.isNotEmpty(username);
    }

    public defaultMessage(): string {
        return UserUsernameValidation.ERROR;
    }

}