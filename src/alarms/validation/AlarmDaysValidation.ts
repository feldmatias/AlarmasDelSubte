import {Validator, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";

@ValidatorConstraint()
export class AlarmDaysValidation implements ValidatorConstraintInterface {

    public static readonly VALID_DAYS: string[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    public static readonly ERROR = "INVALID_ALARM_DAYS_ERROR";

    public validate(days: string[]): boolean {
        const validator = new Validator();
        return validator.arrayNotEmpty(days) && days.every(day => {
                return AlarmDaysValidation.VALID_DAYS.includes(day);
            }
        );
    }

    public defaultMessage(): string {
        return AlarmDaysValidation.ERROR;
    }

}