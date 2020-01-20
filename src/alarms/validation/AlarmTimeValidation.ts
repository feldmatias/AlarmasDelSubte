import {ValidationArguments, Validator, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";
import {AlarmErrors} from "../entities/Alarm";

@ValidatorConstraint()
export class AlarmTimeValidation implements ValidatorConstraintInterface {

    validate(time: string, _args: ValidationArguments): boolean {
        const validator = new Validator();
        return validator.isMilitaryTime(time) && validator.contains(time, ":");
    }

    defaultMessage(): string {
        return AlarmErrors.INVALID_TIME_RANGE_ERROR;
    }

}