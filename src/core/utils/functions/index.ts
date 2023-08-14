import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

export const removerTudoQueNaoEhDigito = (value: any) => `${value}`.replace(/\D/g, '');

export const formatarDataHoraAuditoria = (data: string) =>
  dayjs(data).locale('pt-br').format('DD/MM/YYYY [às] HH:mm');
