import {Validator, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";

@ValidatorConstraint()
export class UserPasswordValidation implements ValidatorConstraintInterface {

    static ERROR = "INVALID_PASSWORD";

    private static PASSWORD_MIN_LENGTH = 6;

    validate(password: string): boolean {
        const validator = new Validator();
        return validator.minLength(password, UserPasswordValidation.PASSWORD_MIN_LENGTH);
    }

    defaultMessage(): string {
        return UserPasswordValidation.ERROR;
    }

}