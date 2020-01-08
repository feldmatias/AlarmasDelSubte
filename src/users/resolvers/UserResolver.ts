import {User} from "../entities/User";
import {Query, Resolver} from "type-graphql";
import {InjectRepository} from "typeorm-typedi-extensions";
import {Repository} from "typeorm";

@Resolver(User)
export class UserResolver {

    constructor(@InjectRepository(User) private repository: Repository<User>) {
    }

    @Query(() => User)
    async user(): Promise<User> {
        const user = new User();
        user.username = "test";
        user.password = "dasd";
        user.token = "dasd";
        await this.repository.save(user);
        return user;
    }
}