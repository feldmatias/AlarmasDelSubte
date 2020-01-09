import {Result} from "./Result";
import {validate} from "class-validator";

export class Validator {

    public static async validate<T>(entity: T): Promise<Result<T>> {
        const errors = await validate(entity);
        if (errors.length > 0) {
            return Result.Error(Object.values(errors[0].constraints)[0]);
        }
        return Result.Success(entity);
    }
}