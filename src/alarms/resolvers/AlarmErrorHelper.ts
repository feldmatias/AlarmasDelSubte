import {ErrorHelper} from "../../utils/ErrorHelper";
import {AlarmNameValidation} from "../validation/AlarmNameValidation";
import {AlarmDaysValidation} from "../validation/AlarmDaysValidation";
import {AlarmTimeValidation} from "../validation/AlarmTimeValidation";
import {AlarmSubwaysValidation} from "../validation/AlarmSubwaysValidation";
import {AlarmOwnerValidation} from "../validation/AlarmOwnerValidation";
import {AlarmService} from "../AlarmService";

class AlarmErrorHelper extends ErrorHelper {

    public readonly INVALID_ALARM_NAME_MESSAGE = "El nombre de la alarma no puede estar vacío";
    public readonly INVALID_ALARM_DAYS_MESSAGE = "La alarma debe tener al menos un día";
    public readonly INVALID_ALARM_TIME_RANGE_MESSAGE = "El rango horario de la alarma es inválido";
    public readonly INVALID_ALARM_SUBWAYS_MESSAGE = "La alarma debe tener al menos un subte";
    public readonly INVALID_ALARM_OWNER_MESSAGE = "La alarma debe pertenecer a un usuario";
    public readonly SUBWAY_NOT_FOUND_MESSAGE = "El subte seleccionado para la alarma no existe";
    public readonly ALARM_NOT_FOUND_ERROR_MESSAGE = "La alarma seleccionada no existe";

    protected errors = new Map([
        [AlarmNameValidation.ERROR, this.INVALID_ALARM_NAME_MESSAGE],
        [AlarmDaysValidation.ERROR, this.INVALID_ALARM_DAYS_MESSAGE],
        [AlarmTimeValidation.ERROR, this.INVALID_ALARM_TIME_RANGE_MESSAGE],
        [AlarmSubwaysValidation.ERROR, this.INVALID_ALARM_SUBWAYS_MESSAGE],
        [AlarmOwnerValidation.ERROR, this.INVALID_ALARM_OWNER_MESSAGE],
        [AlarmService.SUBWAY_NOT_FOUND_ERROR, this.SUBWAY_NOT_FOUND_MESSAGE],
        [AlarmService.ALARM_NOT_FOUND_ERROR, this.ALARM_NOT_FOUND_ERROR_MESSAGE]
    ]);

}

export default new AlarmErrorHelper();