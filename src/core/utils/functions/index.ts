import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const removerTudoQueNaoEhDigito = (value: any) => `${value}`.replace(/\D/g, '');

export const formatarDataHora = (data: string) =>
  format(new Date(data), "dd/MM/yyyy 'às' HH:mm", {
    locale: ptBR,
  });
