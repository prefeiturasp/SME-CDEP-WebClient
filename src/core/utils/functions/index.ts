import { Dayjs, dayjs } from '~/core/date/dayjs';

export const scrollNoInicio = () => window.scrollTo(0, 0);

export const removerTudoQueNaoEhDigito = (value: any) => `${value}`.replace(/\D/g, '');

export const formatarDataHoraAuditoria = (data: string) =>
  dayjs(data).format('DD/MM/YYYY [às] HH:mm');

export const formatarDuasCasasDecimais = (value: any) =>
  removerTudoQueNaoEhDigito(value).replace(/(\d)(\d{2})$/, '$1,$2');

export const formatarHora = (value: any) => {
  const removerTudoQueNaoEhDigito = (str: string) => str.replace(/\D/g, '');
  const horaNumerica = removerTudoQueNaoEhDigito(value);

  if (horaNumerica.length < 4) {
    return horaNumerica.replace(/(\d{2})(\d{2})$/, '$1:$2');
  }

  const horas = parseInt(horaNumerica.substring(0, 2));
  const minutos = parseInt(horaNumerica.substring(2, 4));

  if (horas < 0 || horas > 23 || minutos < 0 || minutos > 59) {
    return '00:00';
  }

  return horaNumerica.replace(/(\d{2})(\d{2})$/, '$1:$2');
};

export const formatarDataParaDDMMYYYY = (
  data: string | null | undefined | Dayjs,
): string | undefined => (data ? dayjs(data).format('DD/MM/YYYY') : undefined);

export const formatarDataPorFormato = (
  data: string | null | undefined | Dayjs,
  formato: string,
): string => (data ? dayjs(data).format(formato || 'DD/MM/YYYY') : '');

export const downloadBlob = (data: any, fileName: string) => {
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.setAttribute('style', 'display: none');

  const blob = new Blob([data]);
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);

  document.body.removeChild(a);
};

export const formatterCPFMask = (value: string | number | undefined) =>
  `${value}`
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');

export const maskTelefone = (value: string | number | undefined) =>
  `${value}`.replace(/^(\d{2})(\d)/g, '($1) $2').replace(/(\d)(\d{4})$/, '$1-$2');
