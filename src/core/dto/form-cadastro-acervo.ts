import { ColProps } from 'antd';
import { FieldAcervoEnum } from '../enum/field-acervo-enum';
import { TipoAcervo } from '../enum/tipo-acervo';
import { AcervoFotograficoDTO } from './acervo-fotografico-dto';

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
} & AcervoFotograficoDTO;
