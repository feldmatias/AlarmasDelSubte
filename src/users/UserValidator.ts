import {Service} from "typedi";
import {UserRepository} from "./UserRepository";
import {UserInput} from "./entities/UserInput";
import {Validator} from "../utils/Validator";
import {ValidationResult} from "../utils/ValidationResult";

@Service()
export class UserValidator {

    static PASSWORD_MIN_LENGTH = 6;
    public static INVALID_PASSWORD_ERROR = "INVALID_PASSWORD";
    public static NOT_UNIQUE_USERNAME_ERROR = "NOT_UNIQUE_USERNAME";

    constructor(private userRepository: UserRepository) {
    }

    public async validate(userInput: UserInput): Promise<ValidationResult> {
        if (!this.validateUserPassword(userInput.password)) {
            return ValidationResult.Error(UserValidator.INVALID_PASSWORD_ERROR);
        }

        if (!await this.validateUniqueUsername(userInput.username)) {
            return ValidationResult.Error(UserValidator.NOT_UNIQUE_USERNAME_ERROR);
        }

        const validated = await Validator.validate(userInput);
        if (!validated.isSuccessful()) {
            return validated;
        }

        return ValidationResult.Success();
    }

    private validateUserPassword(password: string): boolean {
        return password.length >= UserValidator.PASSWORD_MIN_LENGTH;
    }

    private async validateUniqueUsername(username: string): Promise<boolean> {
        return !await this.userRepository.checkUsernameExists(username);
    }
}