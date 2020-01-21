import {Validator, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";

@ValidatorConstraint()
export class UserPasswordValidation implements ValidatorConstraintInterface {

    public static readonly ERROR = "INVALID_PASSWORD";

    private static readonly PASSWORD_MIN_LENGTH = 6;

    public validate(password: string): boolean {
        const validator = new Validator();
        return validator.minLength(password, UserPasswordValidation.PASSWORD_MIN_LENGTH);
    }

    public defaultMessage(): string {
        return UserPasswordValidation.ERROR;
    }

}