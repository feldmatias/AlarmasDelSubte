import {MiddlewareInterface, NextFn, ResolverData} from "type-graphql";
import {UserRepository} from "../../users/UserRepository";
import {RequestContext} from "../RequestContext";
import {User} from "../../users/entities/User";
import {ErrorHelper} from "../../utils/ErrorHelper";
import {constants} from "http2";
import {Service} from "typedi";

@Service()
export class LoginRequiredMiddleware implements MiddlewareInterface<RequestContext> {

    public static readonly EXCLUDED_MUTATIONS: string[] = ['registerUser', 'login'];

    public constructor(private userRepository: UserRepository) {
    }

    /**
     * For queries and mutations that are not excluded, current logged user is set to the context.
     * If no logged user is found, it will throw an error.
     */
    public async use({context, info}: ResolverData<RequestContext>, next: NextFn): Promise<any> { // eslint-disable-line  @typescript-eslint/no-explicit-any
        const queryType = info.schema.getQueryType();
        const mutationType = info.schema.getMutationType();
        if (![queryType, mutationType].includes(info.parentType)) {
            return next();
        }

        if (info.parentType == mutationType && LoginRequiredMiddleware.EXCLUDED_MUTATIONS.includes(info.fieldName)) {
            return next();
        }

        context.user = await this.getLoggedUser(context);
        return next();
    }

    private async getLoggedUser(context: RequestContext): Promise<User> {
        const token = context.header(constants.HTTP2_HEADER_AUTHORIZATION);
        const user = await this.userRepository.findByToken(token);
        if (!user) {
            throw new Error(ErrorHelper.AUTHORIZATION_ERROR_MESSAGE);
        }
        return user;
    }
}
