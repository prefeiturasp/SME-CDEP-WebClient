import dayjs from 'dayjs';

export const removerTudoQueNaoEhDigito = (value: any) => `${value}`.replace(/\D/g, '');

export const formatarDataHoraAuditoria = (data: string) =>
  dayjs(data).format('DD/MM/YYYY [às] HH:mm');

export const formatarDuasCasasDecimais = (value: any) =>
  removerTudoQueNaoEhDigito(value).replace(/(\d)(\d{2})$/, '$1,$2');

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
