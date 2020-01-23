import {Service} from "typedi";
import {ApiService} from "../../utils/ApiService";
import {UpdatedSubwayStatus} from "./UpdatedSubwayStatus";
import {Config} from "../../../config/config";
import {RealTimeSubwayStatus} from "./RealTimeSubwayStatus";
import {Result} from "../../utils/Result";

@Service()
export class SubwayRealTimeRepository {

    public constructor(private apiService: ApiService) {
    }

    public async getSubwaysUpdatedStatus(): Promise<Result<Array<UpdatedSubwayStatus>>> {
        const result = await this.apiService.get(Config.subways.realTimeUrl, RealTimeSubwayStatus);
        if (!result.isSuccessful()) {
            return Result.Error(result.getError());
        }

        const updatedStatus = result.getData().getUpdatedSubwayStatus();
        return Result.Success(updatedStatus);
    }

}