import {Service} from "typedi";
import {UserRepository} from "./UserRepository";
import {UserInput} from "./entities/UserInput";
import {User} from "./entities/User";
import {Result} from "../utils/Result";
import {UserValidator} from "./UserValidator";

@Service()
export class UserService {

    constructor(private repository: UserRepository, private userValidator: UserValidator) {
    }

    async registerUser(userInput: UserInput): Promise<Result<User>> {
        const validation = await this.userValidator.validate(userInput);
        if (!validation.isSuccessful()) {
            return Result.Error(validation.getError())
        }

        const user = new User(userInput);
        const savedUser = await this.repository.createUser(user);
        return Result.Success(savedUser);
    }
}