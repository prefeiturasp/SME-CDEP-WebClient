import { URL_API_EVENTO } from '../constants/urls-api';
import {
  CalendarioEventoDTO,
  EventoCadastroDTO,
  EventoDetalheDTO,
} from '../dto/calendario-evento-dto';
import { deletarRegistro, inserirRegistro, obterRegistro } from './api';

const obterSemanas = (mes: number) =>
  obterRegistro<CalendarioEventoDTO>(`${URL_API_EVENTO}/calendario/${mes}`);

const obterDetalheDia = (dia: number, mes: number) =>
  obterRegistro<EventoDetalheDTO[]>(`${URL_API_EVENTO}/detalhes-dia`, { params: { dia, mes } });

const inserirSuspensao = (params: EventoCadastroDTO) => inserirRegistro(URL_API_EVENTO, params);

const deletarSuspensao = (eventoId: number) => deletarRegistro(`${URL_API_EVENTO}/${eventoId}`);

export { deletarSuspensao, inserirSuspensao, obterDetalheDia, obterSemanas };
