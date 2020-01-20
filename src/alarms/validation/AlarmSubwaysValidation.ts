import {Validator, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";
import {Subway} from "../../subways/entities/Subway";

@ValidatorConstraint()
export class AlarmSubwaysValidation implements ValidatorConstraintInterface {

    static ERROR = "INVALID_ALARM_SUBWAYS_ERROR";

    validate(subways: Subway[]): boolean {
        const validator = new Validator();
        return validator.arrayNotEmpty(subways);
    }

    defaultMessage(): string {
        return AlarmSubwaysValidation.ERROR;
    }

}