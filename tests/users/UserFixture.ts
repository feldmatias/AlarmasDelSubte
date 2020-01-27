import {User} from "../../src/users/entities/User";
import {UserInput} from "../../src/users/entities/UserInput";
import {getConnection} from "typeorm";

export class UserFixture {

    private input: UserInput;
    private firebaseToken?: string;

    public constructor() {
        this.input = new UserInput();
        this.input.username = "username";
        this.input.password = "password";
    }

    public withUsername(username: string): UserFixture {
        this.input.username = username;
        return this;
    }

    public withPassword(password: string): UserFixture {
        this.input.password = password;
        return this;
    }

    public withInput(input: UserInput): UserFixture {
        this.input = input;
        return this;
    }

    public withFirebaseToken(token: string): UserFixture {
        this.firebaseToken = token;
        return this;
    }

    public getUserInput(): UserInput {
        return this.input;
    }

    public async createUser(): Promise<User> {
        const user = new User(this.input);
        if (this.firebaseToken) {
            user.firebaseToken = this.firebaseToken;
        }
        return await getConnection().getRepository(User).save(user);
    }
}