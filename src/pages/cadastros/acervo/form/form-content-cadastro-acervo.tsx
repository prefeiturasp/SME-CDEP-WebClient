import { Col, FormInstance } from 'antd';
import React from 'react';
import UploadArquivosCDEP from '~/components/cdep/upload';
import {
  FieldAcervoProps,
  FormPageConfigCadastroAcervoProps,
} from '~/core/dto/form-cadastro-acervo';
import { FieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import {
  EditorDescricao,
  InputAcessibilidade,
  InputCopia,
  InputDataAcervo,
  InputDimensaoAltura,
  InputDimensaoDiametro,
  InputDimensaoLargura,
  InputDimensaoProfundidade,
  InputDisponibilizacao,
  InputDuracao,
  InputLocalizacao,
  InputProcedencia,
  InputQuantidade,
  InputResolucao,
  InputTamanhoArquivo,
  InputTecnica,
  InputTitulo,
  InputTombo,
  RadioAutorizacaoUsoImagem,
  RadioCopiaDigital,
  SelectConservacao,
  SelectCredito,
  SelectCromia,
  SelectFormatoImagem,
  SelectSuporte,
} from './form-fields';

type FormContentCadastroAcervoProps = {
  fieldsConfig: FormPageConfigCadastroAcervoProps | undefined;
  form: FormInstance;
};
const FormContentCadastroAcervo: React.FC<FormContentCadastroAcervoProps> = ({
  fieldsConfig,
  form,
}) => {
  if (!fieldsConfig?.fields?.length) return;

  return (
    <>
      {fieldsConfig.fields.map((field: FieldAcervoProps) => {
        let input = <></>;

        switch (field.fieldCervo) {
          case FieldAcervoEnum.Titulo:
            input = <InputTitulo />;
            break;
          case FieldAcervoEnum.Tombo:
            input = <InputTombo tipoAcervo={fieldsConfig.tipo} />;
            break;
          case FieldAcervoEnum.Credito:
            input = <SelectCredito tipoAcervo={fieldsConfig.tipo} />;
            break;
          case FieldAcervoEnum.Localizacao:
            input = <InputLocalizacao />;
            break;
          case FieldAcervoEnum.Procedencia:
            input = <InputProcedencia tipoAcervo={fieldsConfig.tipo} />;
            break;
          case FieldAcervoEnum.DataAcervo:
            input = <InputDataAcervo />;
            break;
          case FieldAcervoEnum.CopiaDigital:
            input = <RadioCopiaDigital tipoAcervo={fieldsConfig.tipo} />;
            break;
          case FieldAcervoEnum.Copia:
            input = <InputCopia />;
            break;
          case FieldAcervoEnum.AutorizacaoUsoImagem:
            input = <RadioAutorizacaoUsoImagem tipoAcervo={fieldsConfig.tipo} />;
            break;
          case FieldAcervoEnum.EstadoConservacao:
            input = <SelectConservacao tipoAcervo={fieldsConfig.tipo} />;
            break;
          case FieldAcervoEnum.Descricao:
            input = <EditorDescricao />;
            break;
          case FieldAcervoEnum.Duracao:
            input = <InputDuracao />;
            break;
          case FieldAcervoEnum.Quantidade:
            input = <InputQuantidade />;
            break;
          case FieldAcervoEnum.DimensaoLargura:
            input = <InputDimensaoLargura />;
            break;
          case FieldAcervoEnum.DimensaoAltura:
            input = <InputDimensaoAltura />;
            break;
          case FieldAcervoEnum.DimensaoDiametro:
            input = <InputDimensaoDiametro />;
            break;
          case FieldAcervoEnum.DimensaoProfundidade:
            input = <InputDimensaoProfundidade />;
            break;
          case FieldAcervoEnum.Tecnica:
            input = <InputTecnica />;
            break;
          case FieldAcervoEnum.Suporte:
            input = <SelectSuporte tipoAcervo={fieldsConfig.tipo} />;
            break;
          case FieldAcervoEnum.FormatoImagem:
            input = <SelectFormatoImagem />;
            break;
          case FieldAcervoEnum.TamanhoArquivo:
            input = <InputTamanhoArquivo tipoAcervo={fieldsConfig.tipo} />;
            break;
          case FieldAcervoEnum.Cromia:
            input = <SelectCromia tipoAcervo={fieldsConfig.tipo} />;
            break;
          case FieldAcervoEnum.Resolucao:
            input = <InputResolucao />;
            break;
          case FieldAcervoEnum.Acessibilidade:
            input = <InputAcessibilidade />;
            break;
          case FieldAcervoEnum.Disponibilizacao:
            input = <InputDisponibilizacao />;
            break;
          case FieldAcervoEnum.Anexos:
            input = (
              <UploadArquivosCDEP
                form={form}
                formItemProps={{
                  name: 'arquivos',
                  label: 'Anexo',
                }}
              />
            );
            break;

          default:
            break;
        }

        return (
          <Col key={field.fieldCervo} xs={24} sm={field.sm}>
            {input}
          </Col>
        );
      })}
    </>
  );
};

export default React.memo(FormContentCadastroAcervo);
