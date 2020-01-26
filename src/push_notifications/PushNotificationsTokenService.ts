import {Service} from "typedi";
import {User} from "../users/entities/User";
import {UserRepository} from "../users/UserRepository";
import {Result} from "../utils/Result";

@Service()
export class PushNotificationsTokenService {

    public static readonly INVALID_TOKEN_ERROR = "INVALID_TOKEN_ERROR";

    public constructor(private userRepository: UserRepository) {}

    public async setToken(token: string, user: User): Promise<Result<string>> {
        if (!token) {
            return Result.Error(PushNotificationsTokenService.INVALID_TOKEN_ERROR);
        }

        user.firebaseToken = token;
        await this.userRepository.saveUser(user);
        return Result.Success(token);
    }

    public async removeToken(user: User): Promise<void> {
        user.firebaseToken = "";
        await this.userRepository.saveUser(user);
    }
}