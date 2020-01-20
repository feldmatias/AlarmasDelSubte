import {Validator, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";
import {User} from "../../users/entities/User";

@ValidatorConstraint()
export class AlarmOwnerValidation implements ValidatorConstraintInterface {

    static ERROR = "INVALID_ALARM_OWNER_ERROR";

    validate(owner?: User): boolean {
        const validator = new Validator();
        return validator.isDefined(owner);
    }

    defaultMessage(): string {
        return AlarmOwnerValidation.ERROR;
    }

}