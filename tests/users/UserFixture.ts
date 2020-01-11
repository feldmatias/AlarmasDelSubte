import {User} from "../../src/users/entities/User";
import {UserInput} from "../../src/users/entities/UserInput";
import {UserRepository} from "../../src/users/UserRepository";
import {Container} from "typedi";

export class UserFixture {

    public static USERNAME = "username";
    public static PASSWORD = "password";

    public static getDefaultUserInput = (index?: number): UserInput => {
        const user = new UserInput();
        user.username = UserFixture.USERNAME + (index ? index : "");
        user.password = UserFixture.PASSWORD;
        return user;
    };

    public static async createUser(input?: UserInput): Promise<User> {
        if (!input) {
            input = this.getDefaultUserInput();
        }
        const user = new User(input);
        return await Container.get(UserRepository).createUser(user);
    }
}