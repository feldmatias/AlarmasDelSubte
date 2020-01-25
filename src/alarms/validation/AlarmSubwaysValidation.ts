import {Validator, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";
import {SubwayAlarm} from "../entities/SubwayAlarm";

@ValidatorConstraint()
export class AlarmSubwaysValidation implements ValidatorConstraintInterface {

    public static readonly ERROR = "INVALID_ALARM_SUBWAYS_ERROR";

    public validate(subways: SubwayAlarm[]): boolean {
        const validator = new Validator();
        return validator.arrayNotEmpty(subways);
    }

    public defaultMessage(): string {
        return AlarmSubwaysValidation.ERROR;
    }

}