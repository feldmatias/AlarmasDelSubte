import {ValidationArguments, Validator, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";

@ValidatorConstraint()
export class AlarmTimeValidation implements ValidatorConstraintInterface {

    public static readonly ERROR = "INVALID_ALARM_TIME_RANGE_ERROR";

    public validate(time: string, _args: ValidationArguments): boolean {
        const validator = new Validator();
        return validator.isMilitaryTime(time) && validator.contains(time, ":");
    }

    public defaultMessage(): string {
        return AlarmTimeValidation.ERROR;
    }

}