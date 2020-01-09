import {Service} from "typedi";
import {InjectRepository} from "typeorm-typedi-extensions";
import {User} from "./entities/User";
import {Repository} from "typeorm";


@Service()
export class UserRepository {

    constructor(@InjectRepository(User) private repository: Repository<User>) {
    }

    async createUser(user: User): Promise<User> {
        await this.repository.save(user);
        return user;
    }
}