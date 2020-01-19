import {Validator, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";
import {AlarmErrors} from "../entities/Alarm";

@ValidatorConstraint()
export class AlarmDaysValidation implements ValidatorConstraintInterface {

    static VALID_DAYS: string[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

    validate(days: string[]): boolean {
        const validator = new Validator();
        return validator.arrayNotEmpty(days) && days.every(day => {
                return AlarmDaysValidation.VALID_DAYS.includes(day);
            }
        );
    }

    defaultMessage(): string {
        return AlarmErrors.INVALID_DAYS_ERROR;
    }

}