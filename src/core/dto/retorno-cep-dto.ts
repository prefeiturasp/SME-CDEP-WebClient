export type RetornoCEPDTO = {
  uf: string;
  cep: string;
  bairro: string;
  logradouro: string;
  localidade: string;
  complemento?: string;
};
