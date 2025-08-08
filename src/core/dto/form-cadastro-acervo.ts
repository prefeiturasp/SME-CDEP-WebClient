import { ColProps } from 'antd';
import { AcervoDisponibilidadeEnum } from '../enum/acervo-disponibilidade-enum';
import { FieldAcervoEnum } from '../enum/field-acervo-enum';
import { TipoAcervo } from '../enum/tipo-acervo';
import { AuditoriaDTO } from './auditoria-dto';
import { CoAutorDTO } from './coautores-dto';

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
  fieldAcervo: FieldAcervoEnum;
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
  subTitulo: string;
  codigo: string | null;
  codigoNovo: string | null;
  materialId: number;
  editoraId: number;
  idiomaId: number;
  serieColecaoId: number;
  ano: string;
  edicao: string;
  numeroPagina: number | null;
  acessoDocumentosIds: number[];
  volume: string;
  tipoAnexo: string;
  creditosAutoresIds: number[];
  assuntosIds: number[];
  coAutores: CoAutorDTO[];
  listaTipoAutoria: CoAutorDTO[];
  localizacao: string;
  localizacaoCDD: string;
  localizacaoPHA: string | null;
  notasGerais: string;
  isbn: string;
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
  situacaoSaldo: AcervoDisponibilidadeEnum;
  capaDocumento: string | null;
};
