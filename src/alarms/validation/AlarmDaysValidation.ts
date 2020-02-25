import {Validator, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";
import {DateUtils} from "../../utils/DateUtils";

@ValidatorConstraint()
export class AlarmDaysValidation implements ValidatorConstraintInterface {

    public static readonly ERROR = "INVALID_ALARM_DAYS_ERROR";

    public validate(days: string[]): boolean {
        const validator = new Validator();
        return validator.arrayNotEmpty(days) && days.every(day => {
                return DateUtils.DAYS.includes(day);
            }
        );
    }

    public defaultMessage(): string {
        return AlarmDaysValidation.ERROR;
    }

}
