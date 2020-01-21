import {Validator, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";
import {User} from "../../users/entities/User";

@ValidatorConstraint()
export class AlarmOwnerValidation implements ValidatorConstraintInterface {

    public static readonly ERROR = "INVALID_ALARM_OWNER_ERROR";

    public validate(owner?: User): boolean {
        const validator = new Validator();
        return validator.isDefined(owner);
    }

    public defaultMessage(): string {
        return AlarmOwnerValidation.ERROR;
    }

}