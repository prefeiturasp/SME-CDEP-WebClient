import { Alert, Col, FormInstance } from 'antd';
import React, { useContext } from 'react';
import UploadArquivosCDEP from '~/components/cdep/upload';
import {
  AcervoLinhaRetornoCamposDTO,
  AcervoLinhaRetornoDTO,
} from '~/core/dto/acervo-linha-retorno-dto';
import {
  FieldAcervoProps,
  FormPageConfigCadastroAcervoProps,
} from '~/core/dto/form-cadastro-acervo';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';
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
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';

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
  const { desabilitarCampos } = useContext(PermissaoContext);

  if (!fieldsConfig?.fields?.length) return;

  const montarAlerta = (description: string, message: string) => (
    <Alert
      style={{ margin: '8px 0px' }}
      message={message}
      showIcon
      description={`Planilha: ${description}`}
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
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.Titulo].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.Subtitulo:
            input = (
              <InputSubtitulo
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.Subtitulo].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.Tombo:
            input = (
              <InputTombo
                tipoAcervo={fieldsConfig.tipo}
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.Tombo].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.Credito:
            input = (
              <SelectCredito
                tipoAcervo={fieldsConfig.tipo}
                formItemProps={{
                  extra: obterConteudoExtraPorCampo(
                    PropsByFieldAcervoEnum[FieldAcervoEnum.Credito].name,
                  ),
                }}
              />
            );
            break;
          case FieldAcervoEnum.CodigoAntigo:
            input = (
              <InputCodigoAntigo
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.CodigoAntigo].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.CodigoNovo:
            input = (
              <InputCodigoNovo
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.CodigoNovo].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.Material:
            input = (
              <SelectMaterial
                tipoAcervo={fieldsConfig.tipo}
                formItemProps={{
                  extra: obterConteudoExtraPorCampo(
                    PropsByFieldAcervoEnum[FieldAcervoEnum.Material].name,
                  ),
                }}
              />
            );
            break;
          case FieldAcervoEnum.Idioma:
            input = (
              <SelectIdioma
                formItemProps={{
                  extra: obterConteudoExtraPorCampo(
                    PropsByFieldAcervoEnum[FieldAcervoEnum.Idioma].name,
                  ),
                }}
              />
            );
            break;
          case FieldAcervoEnum.Autor:
            input = (
              <SelectAutor
                tipoAcervo={fieldsConfig.tipo}
                formItemProps={{
                  extra: obterConteudoExtraPorCampo(
                    PropsByFieldAcervoEnum[FieldAcervoEnum.Autor].name,
                  ),
                }}
              />
            );
            break;
          case FieldAcervoEnum.Coautor:
            input = (
              <SelectCoautor
                formItemProps={{
                  extra: obterConteudoExtraPorCampo(
                    PropsByFieldAcervoEnum[FieldAcervoEnum.Coautor].name,
                  ),
                }}
              />
            );
            break;
          case FieldAcervoEnum.Editora:
            input = (
              <SelectEditora
                formItemProps={{
                  extra: obterConteudoExtraPorCampo(
                    PropsByFieldAcervoEnum[FieldAcervoEnum.Editora].name,
                  ),
                }}
              />
            );
            break;
          case FieldAcervoEnum.SerieColecao:
            input = (
              <SelectSerieColecao
                formItemProps={{
                  extra: obterConteudoExtraPorCampo(
                    PropsByFieldAcervoEnum[FieldAcervoEnum.SerieColecao].name,
                  ),
                }}
              />
            );
            break;
          case FieldAcervoEnum.Assunto:
            input = (
              <SelectAssunto
                tipoAcervo={fieldsConfig.tipo}
                formItemProps={{
                  extra: obterConteudoExtraPorCampo(
                    PropsByFieldAcervoEnum[FieldAcervoEnum.Assunto].name,
                  ),
                }}
              />
            );
            break;
          case FieldAcervoEnum.Ano:
            input = (
              <InputAno
                formItemProps={{
                  extra: obterConteudoExtraPorCampo(
                    PropsByFieldAcervoEnum[FieldAcervoEnum.Ano].name,
                  ),
                }}
              />
            );
            break;
          case FieldAcervoEnum.TipoAutoria:
            input = (
              <InputTipoAutoria
                formItemProps={{
                  extra: obterConteudoExtraPorCampo(
                    PropsByFieldAcervoEnum[FieldAcervoEnum.TipoAutoria].name,
                  ),
                }}
              />
            );
            break;
          case FieldAcervoEnum.Edicao:
            input = (
              <InputEdicao
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.Edicao].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.NumeroDePaginas:
            input = (
              <InputNumeroDePaginas
                tipoAcervo={fieldsConfig.tipo}
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.NumeroDePaginas].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.Volume:
            input = (
              <InputVolume
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.Volume].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.TipoDeAnexo:
            input = (
              <InputTipoAnexo
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.TipoDeAnexo].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.AcessoDocumento:
            input = (
              <SelectAcessoDocumento
                formItemProps={{
                  extra: obterConteudoExtraPorCampo(
                    PropsByFieldAcervoEnum[FieldAcervoEnum.AcessoDocumento].name,
                  ),
                }}
              />
            );
            break;
          case FieldAcervoEnum.Localizacao:
            input = (
              <InputLocalizacao
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.Localizacao].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.LocalizacaoCDD:
            input = (
              <InputLocalizacaoCDD
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.LocalizacaoCDD].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.LocalizacaoPHA:
            input = (
              <InputLocalizacaoPHA
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.LocalizacaoPHA].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.NotasGerais:
            input = (
              <InputNotasGerais
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.NotasGerais].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.ISBN:
            input = (
              <InputISBN
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.ISBN].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.Procedencia:
            input = (
              <InputProcedencia
                tipoAcervo={fieldsConfig.tipo}
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.Procedencia].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.DataAcervo:
            input = (
              <InputDataAcervo
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.DataAcervo].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.CopiaDigital:
            input = (
              <RadioCopiaDigital
                tipoAcervo={fieldsConfig.tipo}
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.CopiaDigital].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.Copia:
            input = (
              <InputCopia
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.Copia].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.AutorizacaoUsoImagem:
            input = (
              <RadioAutorizacaoUsoImagem
                tipoAcervo={fieldsConfig.tipo}
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.AutorizacaoUsoImagem].name,
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
                    PropsByFieldAcervoEnum[FieldAcervoEnum.EstadoConservacao].name,
                  ),
                }}
              />
            );
            break;
          case FieldAcervoEnum.Descricao:
            input = (
              <EditorDescricao
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.Descricao].name,
                )}
                disabled={desabilitarCampos}
              />
            );
            break;
          case FieldAcervoEnum.Duracao:
            input = (
              <InputDuracao
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.Duracao].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.Quantidade:
            input = (
              <InputQuantidade
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.Quantidade].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.DimensaoLargura:
            input = (
              <InputDimensaoLargura
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.DimensaoLargura].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.DimensaoAltura:
            input = (
              <InputDimensaoAltura
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.DimensaoAltura].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.DimensaoDiametro:
            input = (
              <InputDimensaoDiametro
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.DimensaoDiametro].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.DimensaoProfundidade:
            input = (
              <InputDimensaoProfundidade
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.DimensaoProfundidade].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.Tecnica:
            input = (
              <InputTecnica
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.Tecnica].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.Suporte:
            input = (
              <SelectSuporte
                tipoAcervo={fieldsConfig.tipo}
                formItemProps={{
                  extra: obterConteudoExtraPorCampo(
                    PropsByFieldAcervoEnum[FieldAcervoEnum.Suporte].name,
                  ),
                }}
              />
            );
            break;
          case FieldAcervoEnum.FormatoImagem:
            input = (
              <SelectFormatoImagem
                formItemProps={{
                  extra: obterConteudoExtraPorCampo(
                    PropsByFieldAcervoEnum[FieldAcervoEnum.FormatoImagem].name,
                  ),
                }}
              />
            );
            break;
          case FieldAcervoEnum.TamanhoArquivo:
            input = (
              <InputTamanhoArquivo
                tipoAcervo={fieldsConfig.tipo}
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.TamanhoArquivo].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.Cromia:
            input = (
              <SelectCromia
                tipoAcervo={fieldsConfig.tipo}
                formItemProps={{
                  extra: obterConteudoExtraPorCampo(
                    PropsByFieldAcervoEnum[FieldAcervoEnum.Cromia].name,
                  ),
                }}
              />
            );
            break;
          case FieldAcervoEnum.Resolucao:
            input = (
              <InputResolucao
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.Resolucao].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.Acessibilidade:
            input = (
              <InputAcessibilidade
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.Acessibilidade].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.Disponibilizacao:
            input = (
              <InputDisponibilizacao
                extra={obterConteudoExtraPorCampo(
                  PropsByFieldAcervoEnum[FieldAcervoEnum.Disponibilizacao].name,
                )}
              />
            );
            break;
          case FieldAcervoEnum.Anexos:
            input = (
              <UploadArquivosCDEP
                form={form}
                formItemProps={{
                  name: PropsByFieldAcervoEnum[FieldAcervoEnum.Anexos].name,
                  label: PropsByFieldAcervoEnum[FieldAcervoEnum.Anexos].label,
                  extra: obterConteudoExtraPorCampo(
                    PropsByFieldAcervoEnum[FieldAcervoEnum.Anexos].name,
                  ),
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
