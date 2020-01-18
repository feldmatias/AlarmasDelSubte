import {Service} from "typedi";
import {UserRepository} from "./UserRepository";
import {UserInput} from "./entities/UserInput";
import {Validator} from "../utils/Validator";
import {ValidationResult} from "../utils/ValidationResult";

@Service()
export class UserValidator {

    public static NOT_UNIQUE_USERNAME_ERROR = "NOT_UNIQUE_USERNAME";

    constructor(private userRepository: UserRepository) {
    }

    public async validate(userInput: UserInput): Promise<ValidationResult> {
        const validated = await Validator.validate(userInput);
        if (!validated.isSuccessful()) {
            return validated;
        }

        if (!await this.validateUniqueUsername(userInput.username)) {
            return ValidationResult.Error(UserValidator.NOT_UNIQUE_USERNAME_ERROR);
        }

        return ValidationResult.Success();
    }

    private async validateUniqueUsername(username: string): Promise<boolean> {
        return !await this.userRepository.checkUsernameExists(username);
    }
}