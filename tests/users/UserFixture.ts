import {User} from "../../src/users/entities/User";
import {UserInput} from "../../src/users/entities/UserInput";
import {getConnection} from "typeorm";

export class UserFixture {

    static readonly USERNAME = "username";
    static readonly PASSWORD = "password";

    public static getDefaultUserInput(index?: number): UserInput {
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
        return await getConnection().getRepository(User).save(user);
    }

    public static async createUserWithUsername(username: string): Promise<User> {
        const input = this.getDefaultUserInput();
        input.username = username;

        return await this.createUser(input);
    }
}