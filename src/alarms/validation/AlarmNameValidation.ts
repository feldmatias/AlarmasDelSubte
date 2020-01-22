import {Validator, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";

@ValidatorConstraint()
export class AlarmNameValidation implements ValidatorConstraintInterface {

    public static readonly ERROR = "INVALID_ALARM_NAME_ERROR";

    public validate(name: string): boolean {
        const validator = new Validator();
        return validator.isNotEmpty(name);
    }

    public defaultMessage(): string {
        return AlarmNameValidation.ERROR;
    }

}