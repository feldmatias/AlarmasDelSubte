import {Arg, Ctx, Mutation, Resolver} from "type-graphql";
import {AlarmService} from "../AlarmService";
import {Alarm} from "../entities/Alarm";
import {AlarmInput} from "../entities/AlarmInput";
import {RequestContext} from "../../graphql/RequestContext";
import AlarmErrorHelper from "./AlarmErrorHelper";

@Resolver()
export class AlarmResolver {

    constructor(private service: AlarmService) {
    }

    @Mutation(_returns => Alarm)
    async createAlarm(@Arg("alarmInput") alarmInput: AlarmInput, @Ctx() context: RequestContext): Promise<Alarm> {
        alarmInput.setOwner(context.user);

        const result = await this.service.create(alarmInput);

        if (!result.isSuccessful()) {
            throw new Error(AlarmErrorHelper.getErrorMessage(result.getError()));
        }
        return result.getData();
    }
}