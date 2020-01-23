import {UpdatedSubwayStatus} from "./UpdatedSubwayStatus";
import {JsonProperty, Serializable} from "typescript-json-serializer";

@Serializable()
class Translation {

    @JsonProperty()
    private language!: string;

    @JsonProperty()
    private text!: string;

    public getStatus(): string {
        return this.text;
    }

    public checkLanguage(): boolean {
        return this.language == "es";
    }
}

@Serializable()
class DescriptionText {

    @JsonProperty({type:Translation})
    private translation!: Translation[];

    public getSubwayStatus(): string {
        return this.translation.find(translation => {
            return translation.checkLanguage();
        })?.getStatus() || "";
    }
}

@Serializable()
class InformedEntity {

    @JsonProperty()
    private route_id!: string;

    public getSubwayLine(): string {
        return this.route_id;
    }
}

@Serializable()
class Alert {

    @JsonProperty({type: InformedEntity})
    private informed_entity!: InformedEntity[];

    @JsonProperty({type: DescriptionText})
    private description_text!: DescriptionText;

    public getSubwayLine(): string {
        if (this.informed_entity.length == 0) {
            return "";
        }
        return this.informed_entity[0].getSubwayLine();
    }

    public getSubwayStatus(): string {
        return this.description_text.getSubwayStatus();
    }
}

@Serializable()
class Entity {

    @JsonProperty({type: Alert})
    private alert!: Alert;

    public getUpdatedSubwayStatus(): UpdatedSubwayStatus {
        const line = this.alert?.getSubwayLine() || "";
        const status = this.alert?.getSubwayStatus() || "";
        return new UpdatedSubwayStatus(line, status);
    }
}

@Serializable()
export class RealTimeSubwayStatus {

    @JsonProperty({type: Entity})
    private entity!: Entity[];

    public getUpdatedSubwayStatus(): Array<UpdatedSubwayStatus> {
        const data = new Array<UpdatedSubwayStatus>();
        this.entity.forEach(entity => {
            data.push(entity.getUpdatedSubwayStatus());
        });
        return data;
    }
}