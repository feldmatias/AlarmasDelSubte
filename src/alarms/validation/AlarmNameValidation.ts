import {Validator, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";

@ValidatorConstraint()
export class AlarmNameValidation implements ValidatorConstraintInterface {

    static readonly ERROR = "INVALID_ALARM_NAME_ERROR";

    validate(name: string): boolean {
        const validator = new Validator();
        return validator.isNotEmpty(name);
    }

    defaultMessage(): string {
        return AlarmNameValidation.ERROR;
    }

}