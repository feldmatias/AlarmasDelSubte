import {User} from "../entities/User";
import {Arg, Mutation, Query, Resolver} from "type-graphql";
import {UserInput} from "../entities/UserInput";
import {UserService} from "../UserService";
import UserErrorHelper from "../UserErrorHelper";

@Resolver(User)
export class UserResolver {

    constructor(private service: UserService) {
    }

    //TODO: remove this
    @Query(() => User)
     async user(): Promise<User> {
         const user = new User();
         user.username = "test";
         user.token = "dasd";
         user.id = 1;
         return user;
     }

    @Mutation(() => User)
    public async registerUser(@Arg("userInput") userInput: UserInput): Promise<User> {
        const result = await this.service.registerUser(userInput);
        if (!result.isSuccessful()) {
            throw new Error(UserErrorHelper.getErrorMessage(result.getError()));
        }
        return result.getData();
    }
}