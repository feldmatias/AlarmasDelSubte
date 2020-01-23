import {Service} from "typedi";
import {SubwayRepository} from "../SubwayRepository";
import {SubwayRealTimeRepository} from "./SubwayRealTimeRepository";

@Service()
export class SubwayStatusUpdater {

    public constructor(private subwayRepository: SubwayRepository,
                       private subwayRealTimeRepository: SubwayRealTimeRepository) {
    }

    public async updateSubwayStatus(): Promise<void> {
        const [subways, updatedStatus] = await Promise.all([
            this.subwayRepository.getAllOrdered(),
            this.subwayRealTimeRepository.getSubwaysUpdatedStatus()
        ]);

        if (!updatedStatus.isSuccessful() || subways.length == 0) {
            return;
        }

        for(let i = 0; i < subways.length; i++) {
            const subway = subways[i];
            const update = updatedStatus.getData().find(status => {
                return status.subwayLine == subway.line;
            });

            if (update) {
                subway.status = update.status;
                await this.subwayRepository.update(subway);
            }
        }
    }
}