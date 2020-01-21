import {Arg, Ctx, Int, Mutation, Query, Resolver} from "type-graphql";
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

    @Query(_returns => Alarm)
    async getAlarm(@Arg("id", _type => Int) id: number, @Ctx() context: RequestContext): Promise<Alarm> {
        const alarm = await this.service.get(id, context.user);
        if (!alarm) {
            throw new Error(AlarmErrorHelper.ALARM_NOT_FOUND_ERROR_MESSAGE);
        }
        return alarm;
    }

    @Query(_returns => [Alarm])
    async getAlarms(@Ctx() context: RequestContext): Promise<Array<Alarm>> {
        return await this.service.getAll(context.user);
    }
}