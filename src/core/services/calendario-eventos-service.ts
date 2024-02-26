import { URL_API_EVENTO } from '../constants/urls-api';
import { CalendarioEventoDTO } from '../dto/calendario-evento-dto';
import { obterRegistro } from './api';

const obterSemanas = (mes: number) =>
  obterRegistro<CalendarioEventoDTO>(`${URL_API_EVENTO}/calendario/${mes}`);

export { obterSemanas };
