import {validate} from "class-validator";
import {ValidationResult} from "./ValidationResult";

export class Validator {

    public static async validate<T>(entity: T): Promise<ValidationResult> {
        const errors = await validate(entity);
        if (errors.length > 0) {
            return ValidationResult.Error(Object.values(errors[0].constraints)[0]);
        }
        return ValidationResult.Success();
    }
}