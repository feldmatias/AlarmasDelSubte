import {ValidationArguments, ValidatorConstraint} from "class-validator";
import {AlarmTimeValidation} from "./AlarmTimeValidation";
import {Alarm} from "../entities/Alarm";

@ValidatorConstraint()
export class AlarmEndTimeValidation extends AlarmTimeValidation {

    public validate(endTime: string, args: ValidationArguments): boolean {
        if (!super.validate(endTime, args)) {
            return false;
        }

        const startTime = (args.object as Alarm).start;
        return startTime < endTime;
    }
}