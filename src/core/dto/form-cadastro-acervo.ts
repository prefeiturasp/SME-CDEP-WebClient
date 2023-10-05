import { ColProps } from 'antd';
import { FieldAcervoEnum } from '../enum/field-acervo-enum';
import { TipoAcervo } from '../enum/tipo-acervo';
import { AuditoriaDTO } from './auditoria-dto';

type FormPageInputsProps = {
  name: string;
  placeholder: string;
};

type FormPageCadastrosAuxiliaresProps = {
  title: string;
  urlBase: string;
  inputs: FormPageInputsProps[];
  urlMainPage: string;
};

export type FormCadastroAcervoProps = {
  page: FormPageCadastrosAuxiliaresProps;
};

export type FieldAcervoProps = {
  fieldCervo: FieldAcervoEnum;
} & ColProps;

export type FormPageConfigCadastroAcervoProps = {
  tipo: TipoAcervo;
  urlBase: string;
  fields: FieldAcervoProps[];
};

export type FormDefaultCadastroAcervoDTO = {
  id: number;
  acervoId: number;
  tipoAcervoId: TipoAcervo;
  auditoria: AuditoriaDTO;
  titulo: string;
  codigo: string;
  copia: string;
  creditosAutoresIds: number[];
  localizacao: string;
  procedencia: string;
  dataAcervo: string;
  duracao: string;
  copiaDigital: boolean;
  permiteUsoImagem: boolean;
  conservacaoId: number;
  descricao: string;
  quantidade: number;
  largura: string | null;
  altura: string | null;
  diametro: string | null;
  profundidade: string | null;
  suporteId: number;
  formatoId: number;
  tamanhoArquivo: string;
  acessibilidade: string;
  disponibilizacao: string;
  cromiaId: number;
  resolucao: string;
  arquivos?: any;
  tecnica: string;
};
