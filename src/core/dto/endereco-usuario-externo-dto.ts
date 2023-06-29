export type EnderecoUsuarioExternoDTO = {
  endereco: string;
  complemento?: string;
  numero: string | number;
  cidade: string;
  estado: string;
  cep: string;
  bairro: string;
};
