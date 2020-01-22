import {User} from "../entities/User";
import {Arg, Mutation, Query, Resolver} from "type-graphql";
import {UserInput} from "../entities/UserInput";
import {UserService} from "../UserService";
import UserErrorHelper from "./UserErrorHelper";

@Resolver()
export class UserResolver {

    public constructor(private service: UserService) {
    }

    @Query(_returns => User)
    public async login(@Arg("userInput") userInput: UserInput): Promise<User> {
        const result = await this.service.login(userInput);
        if (!result.isSuccessful()) {
            throw new Error(UserErrorHelper.getErrorMessage(result.getError()));
        }
        return result.getData();
    }

    @Mutation(_returns => User)
    public async registerUser(@Arg("userInput") userInput: UserInput): Promise<User> {
        const result = await this.service.registerUser(userInput);
        if (!result.isSuccessful()) {
            throw new Error(UserErrorHelper.getErrorMessage(result.getError()));
        }
        return result.getData();
    }
}