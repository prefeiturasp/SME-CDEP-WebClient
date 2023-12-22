import { Col } from 'antd';
import React from 'react';
import {
  ConsultaAcervoDetalhesDTO,
  FieldAcervoDetalhesProps,
} from '~/core/dto/form-cadastro-detalhes';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import TextItemCardContentConsultaAcervo from '../components/text-content-card';

type DetalhesAcervoAreaPublicaProps = {
  fields: FieldAcervoDetalhesProps[];
  dados?: ConsultaAcervoDetalhesDTO;
};
const DetalhesAcervoAreaPublica: React.FC<DetalhesAcervoAreaPublicaProps> = ({ fields, dados }) => {
  if (!fields?.length || !dados) return;

  return (
    <>
      {fields.map((field: FieldAcervoDetalhesProps) => {
        let input = undefined;

        switch (field.fieldAcervo) {
          case FieldAcervoEnum.Titulo:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Titulo].label}: `}
                description={dados.titulo}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Subtitulo:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Subtitulo].label}: `}
                description={dados.subTitulo}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Tombo:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Tombo].label}: `}
                description={dados.codigo}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Credito:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Credito].label}: `}
                description={dados.creditosAutores}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.CodigoAntigo:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.CodigoAntigo].label}: `}
                description={dados.codigo}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.CodigoNovo:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.CodigoNovo].label}: `}
                description={dados.codigoNovo}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Material:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Material].label}: `}
                description={dados.material}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Idioma:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Idioma].label}: `}
                description={dados.idioma}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Autor:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Autor].label}: `}
                description={dados.creditosAutores}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Coautor:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Coautor].label}: `}
                description={dados.coautor} // Validar
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Editora:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Editora].label}: `}
                description={dados.editora}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.SerieColecao:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.SerieColecao].label}: `}
                description={dados.serieColecao}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Assunto:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Assunto].label}: `}
                description={dados.assunto}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Ano:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Ano].label}: `}
                description={dados.ano}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.TipoAutoria:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.TipoAutoria].label}: `}
                description={dados.tipoAutoria}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Edicao:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Edicao].label}: `}
                description={dados.edicao}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.NumeroDePaginas:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.NumeroDePaginas].label}: `}
                description={dados.numeroPagina}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Volume:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Volume].label}: `}
                description={dados.volume}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.TipoDeAnexo:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.TipoDeAnexo].label}: `}
                description={dados.tipoAnexo}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.AcessoDocumento:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.AcessoDocumento].label}: `}
                description={dados.acessosDocumentos}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Localizacao:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Localizacao].label}: `}
                description={dados.localizacao}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.LocalizacaoCDD:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.LocalizacaoCDD].label}: `}
                description={dados.localizacaoCDD}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.LocalizacaoPHA:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.LocalizacaoPHA].label}: `}
                description={dados.localizacaoPHA}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.NotasGerais:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.NotasGerais].label}: `}
                description={dados.notasGerais}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.ISBN:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.ISBN].label}: `}
                description={dados.isbn}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Procedencia:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Procedencia].label}: `}
                description={dados.procedencia}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.DataAcervo:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.DataAcervo].label}: `}
                description={dados.dataAcervo}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.CopiaDigital:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.CopiaDigital].label}: `}
                description={dados.copiaDigital}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Copia:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Copia].label}: `}
                description={dados.copia}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.AutorizacaoUsoImagem:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.AutorizacaoUsoImagem].label}: `}
                description={dados.permiteUsoImagem}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.EstadoConservacao:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.EstadoConservacao].label}: `}
                description={dados.conservacao}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Descricao:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Descricao].label}: `}
                description={dados.descricao}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Duracao:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Duracao].label}: `}
                description={dados.duracao}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Quantidade:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Quantidade].label}: `}
                description={dados.quantidade}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Dimensoes:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Dimensoes].label}: `}
                description={dados.dimensoes}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Tecnica:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Tecnica].label}: `}
                description={dados.tecnica}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Suporte:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Suporte].label}: `}
                description={dados.suporte}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.FormatoImagem:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.FormatoImagem].label}: `}
                description={dados.formato}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.TamanhoArquivo:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.TamanhoArquivo].label}: `}
                description={dados.tamanhoArquivo}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Cromia:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Cromia].label}: `}
                description={dados.cromia}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Resolucao:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Resolucao].label}: `}
                description={dados.resolucao}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Acessibilidade:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Acessibilidade].label}: `}
                description={dados.acessibilidade}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Disponibilizacao:
            input = (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Disponibilizacao].label}: `}
                description={dados.disponibilizacao}
                ellipsis={!!field.ellipsis}
              />
            );
            break;

          default:
            break;
        }

        if (input) {
          return (
            <Col xs={24} key={field.fieldAcervo}>
              {input}
            </Col>
          );
        }

        return <></>;
      })}
    </>
  );
};

export default React.memo(DetalhesAcervoAreaPublica);
