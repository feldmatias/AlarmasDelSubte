import {Service} from "typedi";
import {UserRepository} from "./UserRepository";
import {UserInput} from "./entities/UserInput";
import {User} from "./entities/User";

@Service()
export class UserService {

    constructor(private repository: UserRepository) {
    }

    async registerUser(userInput: UserInput): Promise<User> {
        const user = new User(userInput);
        return await this.repository.createUser(user);
    }
}