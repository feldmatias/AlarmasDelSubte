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

    async findByToken(token: string): Promise<User | undefined> {
        return await this.repository.findOne({token: token});
    }

    async checkUsernameExists(username: string): Promise<boolean> {
        return await this.repository.count({username: username}) > 0;
    }
}