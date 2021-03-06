import {Service} from "typedi";
import {UserRepository} from "./UserRepository";
import {UserInput} from "./entities/UserInput";
import {User} from "./entities/User";
import {Result} from "../utils/Result";
import {UserValidator} from "./validation/UserValidator";

@Service()
export class UserService {

    public static readonly LOGIN_ERROR = "LOGIN_ERROR";

    public constructor(private repository: UserRepository, private userValidator: UserValidator) {
    }

    public async registerUser(userInput: UserInput): Promise<Result<User>> {
        const validation = await this.userValidator.validate(userInput);
        if (!validation.isSuccessful()) {
            return Result.Error(validation.getError());
        }

        const user = new User(userInput);
        const savedUser = await this.repository.saveUser(user);
        return Result.Success(savedUser);
    }

    public async login(userInput: UserInput): Promise<Result<User>> {
        const user = await this.repository.findByUsername(userInput.username);

        if (!user) {
            return Result.Error(UserService.LOGIN_ERROR);
        }

        if (!user.checkPassword(userInput.password)) {
            return Result.Error(UserService.LOGIN_ERROR);
        }

        return Result.Success(user);
    }
}