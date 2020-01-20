import {ValidationArguments, Validator, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";

@ValidatorConstraint()
export class AlarmTimeValidation implements ValidatorConstraintInterface {

    static ERROR = "INVALID_ALARM_TIME_RANGE_ERROR";

    validate(time: string, _args: ValidationArguments): boolean {
        const validator = new Validator();
        return validator.isMilitaryTime(time) && validator.contains(time, ":");
    }

    defaultMessage(): string {
        return AlarmTimeValidation.ERROR;
    }

}