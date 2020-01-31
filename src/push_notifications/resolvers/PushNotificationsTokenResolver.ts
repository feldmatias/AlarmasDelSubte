import {Arg, Ctx, ID, Mutation, Resolver} from "type-graphql";
import {PushNotificationsTokenService} from "../PushNotificationsTokenService";
import {RequestContext} from "../../graphql/RequestContext";
import PushNotificationsErrorHelper from "./PushNotificationsErrorHelper";

@Resolver()
export class PushNotificationsTokenResolver {

    public constructor(private service: PushNotificationsTokenService) {
    }

    @Mutation(_returns => String, {nullable: true})
    public async setFirebaseToken(@Arg("token") token: string,
                                  @Ctx() context: RequestContext): Promise<string> {
        const result = await this.service.setToken(token, context.user);
        if (!result.isSuccessful()) {
            throw new Error(PushNotificationsErrorHelper.getErrorMessage(result.getError()));
        }
        return result.getData();
    }

    @Mutation(_returns => ID, {nullable: true})
    public async removeFirebaseToken(@Ctx() context: RequestContext): Promise<number> {
        await this.service.removeToken(context.user);
        return context.user.getId();
    }

}
