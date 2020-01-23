import {UpdatedSubwayStatus} from "./UpdatedSubwayStatus";
import {JsonProperty, Serializable} from "typescript-json-serializer";

@Serializable()
class TranslatedStatus {

    @JsonProperty({name: 'language'})
    private language!: string;

    @JsonProperty({name: 'text'})
    private status!: string;

    public getStatus(): string {
        return this.status;
    }

    public checkLanguage(): boolean {
        return this.language == "es";
    }
}

@Serializable()
class AlertStatus {

    @JsonProperty({type:TranslatedStatus, name: "translation"})
    private translatedStatus!: TranslatedStatus[];

    public getSubwayStatus(): string {
        return this.translatedStatus.find(status => {
            return status.checkLanguage();
        })?.getStatus() || "";
    }
}

@Serializable()
class SubwayInfo {

    @JsonProperty({name: "route_id"})
    private subwayLine!: string;

    public getSubwayLine(): string {
        return this.subwayLine;
    }
}

@Serializable()
class SubwayAlert {

    @JsonProperty({type: SubwayInfo, name: "informed_entity"})
    private subways!: SubwayInfo[];

    @JsonProperty({type: AlertStatus, name: "description_text"})
    private alertStatus!: AlertStatus;

    public getSubwayLine(): string {
        if (this.subways.length == 0) {
            return "";
        }
        return this.subways[0].getSubwayLine();
    }

    public getSubwayStatus(): string {
        return this.alertStatus.getSubwayStatus();
    }
}

@Serializable()
class SubwayEntity {

    @JsonProperty({type: SubwayAlert, name: "alert"})
    private alert!: SubwayAlert;

    public getUpdatedSubwayStatus(): UpdatedSubwayStatus {
        const line = this.alert.getSubwayLine();
        const status = this.alert.getSubwayStatus();
        return new UpdatedSubwayStatus(line, status);
    }
}

@Serializable()
export class RealTimeSubwayStatus {

    @JsonProperty({type: SubwayEntity, name: "entity"})
    private subwayEntities!: SubwayEntity[];

    public getUpdatedSubwayStatus(): Array<UpdatedSubwayStatus> {
        const data = new Array<UpdatedSubwayStatus>();
        this.subwayEntities.forEach(entity => {
            data.push(entity.getUpdatedSubwayStatus());
        });
        return data;
    }
}