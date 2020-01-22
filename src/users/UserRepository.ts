import {Service} from "typedi";
import {InjectRepository} from "typeorm-typedi-extensions";
import {User} from "./entities/User";
import {Repository} from "typeorm";


@Service()
export class UserRepository {

    public constructor(@InjectRepository(User) private repository: Repository<User>) {
    }

    public async createUser(user: User): Promise<User> {
        return await this.repository.save(user);
    }

    public async findByToken(token: string): Promise<User | undefined> {
        return await this.repository.findOne({token: token});
    }

    public async checkUsernameExists(username: string): Promise<boolean> {
        return await this.repository.count({username: username}) > 0;
    }

    public async findByUsername(username: string): Promise<User | undefined> {
        return await this.repository.findOne({username: username});
    }
}