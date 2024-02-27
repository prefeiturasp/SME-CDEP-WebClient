import { URL_API_EVENTO } from '../constants/urls-api';
import { CalendarioEventoDTO, EventoDetalheDTO } from '../dto/calendario-evento-dto';
import { inserirRegistro, obterRegistro } from './api';

const obterSemanas = (mes: number) =>
  obterRegistro<CalendarioEventoDTO>(`${URL_API_EVENTO}/calendario/${mes}`);

const obterDetalheDia = (dia: number, mes: number) =>
  obterRegistro<EventoDetalheDTO>(`${URL_API_EVENTO}/detalhes-dia`, { params: { dia, mes } });

const inserirSuspensao = (evento: any) => inserirRegistro(URL_API_EVENTO, { params: { evento } });

export { inserirSuspensao, obterDetalheDia, obterSemanas };
