import { Alert, Col, FormInstance, Row } from 'antd';
import React from 'react';
import UploadArquivosCDEP from '~/components/cdep/upload';
import {
  AcervoLinhaRetornoCamposDTO,
  AcervoLinhaRetornoDTO,
} from '~/core/dto/acervo-linha-retorno-dto';
import {
  FieldAcervoProps,
  FormPageConfigCadastroAcervoProps,
} from '~/core/dto/form-cadastro-acervo';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import {
  EditorDescricao,
  InputAcessibilidade,
  InputAno,
  InputCodigoAntigo,
  InputCodigoNovo,
  InputCopia,
  InputDataAcervo,
  InputDimensaoAltura,
  InputDimensaoDiametro,
  InputDimensaoLargura,
  InputDimensaoProfundidade,
  InputDisponibilizacao,
  InputDuracao,
  InputEdicao,
  InputISBN,
  InputLocalizacao,
  InputLocalizacaoCDD,
  InputLocalizacaoPHA,
  InputNotasGerais,
  InputNumeroDePaginas,
  InputProcedencia,
  InputQuantidade,
  InputResolucao,
  InputSubtitulo,
  InputTamanhoArquivo,
  InputTecnica,
  InputTipoAnexo,
  InputTipoAutoria,
  InputTitulo,
  InputTombo,
  InputVolume,
  RadioAutorizacaoUsoImagem,
  RadioCopiaDigital,
  SelectAcessoDocumento,
  SelectAssunto,
  SelectAutor,
  SelectCoautor,
  SelectConservacao,
  SelectCredito,
  SelectCromia,
  SelectEditora,
  SelectFormatoImagem,
  SelectIdioma,
  SelectMaterial,
  SelectSerieColecao,
  SelectSuporte,
} from './form-fields';

type FormContentCadastroAcervoProps = {
  fieldsConfig: FormPageConfigCadastroAcervoProps | undefined;
  form: FormInstance;
  errosAcervoLinhaRetorno?: AcervoLinhaRetornoDTO;
};
const FormContentCadastroAcervo: React.FC<FormContentCadastroAcervoProps> = ({
  fieldsConfig,
  form,
  errosAcervoLinhaRetorno,
}) => {
  if (!fieldsConfig?.fields?.length) return;

  const montarAlerta = (description: string, message: string) => (
    <Alert
      style={{ margin: '8px 0px' }}
      message={message}
      showIcon
      description={description}
      type='error'
    />
  );

  const obterConteudoExtraPorCampo = (nameFieldEnum: string) => {
    if (!errosAcervoLinhaRetorno) return;

    const fieldError = errosAcervoLinhaRetorno[nameFieldEnum as keyof AcervoLinhaRetornoCamposDTO];

    if (fieldError?.possuiErro) {
      return montarAlerta(fieldError?.conteudo, fieldError?.mensagem);
    }

    return undefined;
  };

  return (
    <>
      {fieldsConfig.fields.map((field: FieldAcervoProps) => {
        let input = <></>;

        switch (field.fieldAcervo) {
          case FieldAcervoEnum.Titulo:
            input = (
              <InputTitulo
                extra={obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.Titulo])}
              />
            );
            break;
          case FieldAcervoEnum.Subtitulo:
            input = (
              <InputSubtitulo
                extra={obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.Subtitulo])}
              />
            );
            break;
          case FieldAcervoEnum.Tombo:
            input = (
              <InputTombo
                tipoAcervo={fieldsConfig.tipo}
                extra={obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.Tombo])}
              />
            );
            break;
          case FieldAcervoEnum.Credito:
            input = (
              <SelectCredito
                tipoAcervo={fieldsConfig.tipo}
                formItemProps={{
                  extra: obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.Credito]),
                }}
              />
            );
            break;
          case FieldAcervoEnum.CodigoAntigoNovo:
            input = (
              <Row gutter={16}>
                <InputCodigoAntigo
                  extra={obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.CodigoAntigo])}
                />
                <InputCodigoNovo
                  extra={obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.CodigoNovo])}
                />
              </Row>
            );
            break;
          case FieldAcervoEnum.Material:
            input = (
              <SelectMaterial
                tipoAcervo={fieldsConfig.tipo}
                formItemProps={{
                  extra: obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.Material]),
                }}
              />
            );
            break;
          case FieldAcervoEnum.Idioma:
            input = (
              <SelectIdioma
                formItemProps={{
                  extra: obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.Idioma]),
                }}
              />
            );
            break;
          case FieldAcervoEnum.Autor:
            input = (
              <SelectAutor
                tipoAcervo={fieldsConfig.tipo}
                formItemProps={{
                  extra: obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.Autor]),
                }}
              />
            );
            break;
          case FieldAcervoEnum.Coautor:
            input = (
              <SelectCoautor
                formItemProps={{
                  extra: obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.Coautor]),
                }}
              />
            );
            break;
          case FieldAcervoEnum.Editora:
            input = (
              <SelectEditora
                formItemProps={{
                  extra: obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.Editora]),
                }}
              />
            );
            break;
          case FieldAcervoEnum.SerieColecao:
            input = (
              <SelectSerieColecao
                formItemProps={{
                  extra: obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.SerieColecao]),
                }}
              />
            );
            break;
          case FieldAcervoEnum.Assunto:
            input = (
              <SelectAssunto
                tipoAcervo={fieldsConfig.tipo}
                formItemProps={{
                  extra: obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.Assunto]),
                }}
              />
            );
            break;
          case FieldAcervoEnum.Ano:
            input = (
              <InputAno
                tipoAcervo={fieldsConfig.tipo}
                extra={obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.Subtitulo])}
              />
            );
            break;
          case FieldAcervoEnum.TipoAutoria:
            input = (
              <InputTipoAutoria
                formItemProps={{
                  extra: obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.TipoAutoria]),
                }}
              />
            );
            break;
          case FieldAcervoEnum.Edicao:
            input = (
              <InputEdicao
                extra={obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.Edicao])}
              />
            );
            break;
          case FieldAcervoEnum.NumeroDePaginas:
            input = (
              <InputNumeroDePaginas
                tipoAcervo={fieldsConfig.tipo}
                extra={obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.NumeroDePaginas])}
              />
            );
            break;
          case FieldAcervoEnum.Volume:
            input = (
              <InputVolume
                extra={obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.Volume])}
              />
            );
            break;
          case FieldAcervoEnum.TipoDeAnexo:
            input = (
              <InputTipoAnexo
                extra={obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.TipoDeAnexo])}
              />
            );
            break;
          case FieldAcervoEnum.AcessoDocumento:
            input = (
              <SelectAcessoDocumento
                formItemProps={{
                  extra: obterConteudoExtraPorCampo(
                    AcervoFieldName[FieldAcervoEnum.AcessoDocumento],
                  ),
                }}
              />
            );
            break;
          case FieldAcervoEnum.Localizacao:
            input = (
              <InputLocalizacao
                extra={obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.Localizacao])}
              />
            );
            break;
          case FieldAcervoEnum.LocalizacaoCDD:
            input = (
              <InputLocalizacaoCDD
                extra={obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.LocalizacaoCDD])}
              />
            );
            break;
          case FieldAcervoEnum.LocalizacaoPHA:
            input = (
              <InputLocalizacaoPHA
                extra={obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.LocalizacaoPHA])}
              />
            );
            break;
          case FieldAcervoEnum.NotasGerais:
            input = (
              <InputNotasGerais
                extra={obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.NotasGerais])}
              />
            );
            break;
          case FieldAcervoEnum.ISBN:
            input = (
              <InputISBN
                extra={obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.ISBN])}
              />
            );
            break;
          case FieldAcervoEnum.Procedencia:
            input = (
              <InputProcedencia
                tipoAcervo={fieldsConfig.tipo}
                extra={obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.Procedencia])}
              />
            );
            break;
          case FieldAcervoEnum.DataAcervo:
            input = (
              <InputDataAcervo
                extra={obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.DataAcervo])}
              />
            );
            break;
          case FieldAcervoEnum.CopiaDigital:
            input = (
              <RadioCopiaDigital
                tipoAcervo={fieldsConfig.tipo}
                extra={obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.CopiaDigital])}
              />
            );
            break;
          case FieldAcervoEnum.Copia:
            input = (
              <InputCopia
                extra={obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.Copia])}
              />
            );
            break;
          case FieldAcervoEnum.AutorizacaoUsoImagem:
            input = (
              <RadioAutorizacaoUsoImagem
                tipoAcervo={fieldsConfig.tipo}
                extra={obterConteudoExtraPorCampo(
                  AcervoFieldName[FieldAcervoEnum.AutorizacaoUsoImagem],
                )}
              />
            );
            break;
          case FieldAcervoEnum.EstadoConservacao:
            input = (
              <SelectConservacao
                tipoAcervo={fieldsConfig.tipo}
                formItemProps={{
                  extra: obterConteudoExtraPorCampo(
                    AcervoFieldName[FieldAcervoEnum.EstadoConservacao],
                  ),
                }}
              />
            );
            break;
          case FieldAcervoEnum.Descricao:
            input = (
              <EditorDescricao
                extra={obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.Descricao])}
              />
            );
            break;
          case FieldAcervoEnum.Duracao:
            input = (
              <InputDuracao
                extra={obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.Duracao])}
              />
            );
            break;
          case FieldAcervoEnum.Quantidade:
            input = (
              <InputQuantidade
                extra={obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.Quantidade])}
              />
            );
            break;
          case FieldAcervoEnum.DimensaoLargura:
            input = (
              <InputDimensaoLargura
                extra={obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.DimensaoLargura])}
              />
            );
            break;
          case FieldAcervoEnum.DimensaoAltura:
            input = (
              <InputDimensaoAltura
                extra={obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.DimensaoAltura])}
              />
            );
            break;
          case FieldAcervoEnum.DimensaoDiametro:
            input = (
              <InputDimensaoDiametro
                extra={obterConteudoExtraPorCampo(
                  AcervoFieldName[FieldAcervoEnum.DimensaoDiametro],
                )}
              />
            );
            break;
          case FieldAcervoEnum.DimensaoProfundidade:
            input = (
              <InputDimensaoProfundidade
                extra={obterConteudoExtraPorCampo(
                  AcervoFieldName[FieldAcervoEnum.DimensaoProfundidade],
                )}
              />
            );
            break;
          case FieldAcervoEnum.Tecnica:
            input = (
              <InputTecnica
                extra={obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.Tecnica])}
              />
            );
            break;
          case FieldAcervoEnum.Suporte:
            input = (
              <SelectSuporte
                tipoAcervo={fieldsConfig.tipo}
                formItemProps={{
                  extra: obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.Suporte]),
                }}
              />
            );
            break;
          case FieldAcervoEnum.FormatoImagem:
            input = (
              <SelectFormatoImagem
                formItemProps={{
                  extra: obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.FormatoImagem]),
                }}
              />
            );
            break;
          case FieldAcervoEnum.TamanhoArquivo:
            input = (
              <InputTamanhoArquivo
                tipoAcervo={fieldsConfig.tipo}
                extra={obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.TamanhoArquivo])}
              />
            );
            break;
          case FieldAcervoEnum.Cromia:
            input = (
              <SelectCromia
                tipoAcervo={fieldsConfig.tipo}
                formItemProps={{
                  extra: obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.Cromia]),
                }}
              />
            );
            break;
          case FieldAcervoEnum.Resolucao:
            input = (
              <InputResolucao
                extra={obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.Resolucao])}
              />
            );
            break;
          case FieldAcervoEnum.Acessibilidade:
            input = (
              <InputAcessibilidade
                extra={obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.Acessibilidade])}
              />
            );
            break;
          case FieldAcervoEnum.Disponibilizacao:
            input = (
              <InputDisponibilizacao
                extra={obterConteudoExtraPorCampo(
                  AcervoFieldName[FieldAcervoEnum.Disponibilizacao],
                )}
              />
            );
            break;
          case FieldAcervoEnum.Anexos:
            input = (
              <UploadArquivosCDEP
                form={form}
                formItemProps={{
                  name: AcervoFieldName[FieldAcervoEnum.Anexos],
                  label: 'Anexo',
                  extra: obterConteudoExtraPorCampo(AcervoFieldName[FieldAcervoEnum.Anexos]),
                }}
                tipoAcervo={fieldsConfig.tipo}
              />
            );
            break;

          default:
            break;
        }

        return (
          <Col key={field.fieldAcervo} xs={24} sm={field.sm}>
            {input}
          </Col>
        );
      })}
    </>
  );
};

export default React.memo(FormContentCadastroAcervo);
