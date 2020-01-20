import {Validator, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";

@ValidatorConstraint()
export class UserUsernameValidation implements ValidatorConstraintInterface {

    static ERROR = "INVALID_USERNAME";

    validate(username: string): boolean {
        const validator = new Validator();
        return validator.isNotEmpty(username);
    }

    defaultMessage(): string {
        return UserUsernameValidation.ERROR;
    }

}