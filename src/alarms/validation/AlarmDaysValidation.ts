import {Validator, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";

@ValidatorConstraint()
export class AlarmDaysValidation implements ValidatorConstraintInterface {

    static readonly VALID_DAYS: string[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    static readonly ERROR = "INVALID_ALARM_DAYS_ERROR";

    validate(days: string[]): boolean {
        const validator = new Validator();
        return validator.arrayNotEmpty(days) && days.every(day => {
                return AlarmDaysValidation.VALID_DAYS.includes(day);
            }
        );
    }

    defaultMessage(): string {
        return AlarmDaysValidation.ERROR;
    }

}