import {Arg, Ctx, ID, Mutation, Query, Resolver} from "type-graphql";
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
    async createAlarm(@Arg("alarmInput") alarmInput: AlarmInput,
                      @Ctx() context: RequestContext): Promise<Alarm> {
        alarmInput.setOwner(context.user);

        const result = await this.service.create(alarmInput);

        if (!result.isSuccessful()) {
            throw new Error(AlarmErrorHelper.getErrorMessage(result.getError()));
        }
        return result.getData();
    }

    @Query(_returns => Alarm)
    async getAlarm(@Arg("id", _type => ID) id: number,
                   @Ctx() context: RequestContext): Promise<Alarm> {
        const alarm = await this.service.get(id, context.user);
        if (!alarm) {
            throw new Error(AlarmErrorHelper.getErrorMessage(AlarmService.ALARM_NOT_FOUND_ERROR));
        }
        return alarm;
    }

    @Query(_returns => [Alarm])
    async getAlarms(@Ctx() context: RequestContext): Promise<Array<Alarm>> {
        return await this.service.getAll(context.user);
    }

    @Mutation(_returns => ID)
    async deleteAlarm(@Arg("id", _type => ID) id: number,
                      @Ctx() context: RequestContext): Promise<number> {
        const result = await this.service.delete(id, context.user);

        if (!result.isSuccessful()) {
            throw new Error(AlarmErrorHelper.getErrorMessage(result.getError()));
        }
        return result.getData();
    }
}