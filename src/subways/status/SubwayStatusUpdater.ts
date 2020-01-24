import {Service} from "typedi";
import {SubwayRepository} from "../SubwayRepository";
import {SubwayRealTimeRepository} from "./SubwayRealTimeRepository";
import {Subway} from "../entities/Subway";
import {UpdatedSubwayStatus} from "./UpdatedSubwayStatus";

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

        if (!updatedStatus.isSuccessful()) {
            return;
        }

        for (let i = 0; i < subways.length; i++) {
            await this.updateSubway(subways[i], updatedStatus.getData());
        }
    }

    private async updateSubway(subway: Subway, updatedStatus: Array<UpdatedSubwayStatus>): Promise<void> {
        const update = updatedStatus.find(status => {
            return status.subwayLine == subway.line;
        });

        subway.updateStatus(update);
        await this.subwayRepository.update(subway);
    }
}