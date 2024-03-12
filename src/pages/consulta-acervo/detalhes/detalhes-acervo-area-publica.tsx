import { Col } from 'antd';
import React from 'react';
import {
  ConsultaAcervoDetalhesDTO,
  FieldAcervoDetalhesProps,
} from '~/core/dto/form-cadastro-detalhes';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { TextItemCardContentConsultaAcervo } from '../components/text-content-card';

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
            input = dados.titulo && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Titulo].label}: `}
                description={dados.titulo}
                ellipsis={!!field.ellipsis}
                item={dados}
              />
            );
            break;
          case FieldAcervoEnum.Subtitulo:
            input = dados.subTitulo && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Subtitulo].label}: `}
                description={dados.subTitulo}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Tombo:
            input = dados.codigo && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Tombo].label}: `}
                description={dados.codigo}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Credito:
            input = dados.creditosAutores && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Credito].label}: `}
                description={dados.creditosAutores}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.CodigoAntigo:
            input = dados.codigo && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.CodigoAntigo].label}: `}
                description={dados.codigo}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.CodigoNovo:
            input = dados.codigoNovo && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.CodigoNovo].label}: `}
                description={dados.codigoNovo}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Material:
            input = dados.material && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Material].label}: `}
                description={dados.material}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Idioma:
            input = dados.idioma && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Idioma].label}: `}
                description={dados.idioma}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Autor:
            input = dados.creditosAutores && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Autor].label}: `}
                description={dados.creditosAutores}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Editora:
            input = dados.editora && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Editora].label}: `}
                description={dados.editora}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.SerieColecao:
            input = dados.serieColecao && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.SerieColecao].label}: `}
                description={dados.serieColecao}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Assunto:
            input = dados.assuntos && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Assunto].label}: `}
                description={dados.assuntos}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Ano:
            input = dados.ano && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Ano].label}: `}
                description={dados.ano}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.TipoAutoria:
            input = dados.tipoAutoria && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.TipoAutoria].label}: `}
                description={dados.tipoAutoria}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Edicao:
            input = dados.edicao && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Edicao].label}: `}
                description={dados.edicao}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.NumeroDePaginas:
            input = dados.numeroPagina && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.NumeroDePaginas].label}: `}
                description={dados.numeroPagina}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Volume:
            input = dados.volume && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Volume].label}: `}
                description={dados.volume}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.TipoDeAnexo:
            input = dados.tipoAnexo && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.TipoDeAnexo].label}: `}
                description={dados.tipoAnexo}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.AcessoDocumento:
            input = dados.acessosDocumentos && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.AcessoDocumento].label}: `}
                description={dados.acessosDocumentos}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Localizacao:
            input = dados.localizacao && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Localizacao].label}: `}
                description={dados.localizacao}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.LocalizacaoCDDPHA:
            input = dados.localizacao && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.LocalizacaoCDDPHA].label}: `}
                description={dados.localizacao}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.NotasGerais:
            input = dados.notasGerais && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.NotasGerais].label}: `}
                description={dados.notasGerais}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.ISBN:
            input = dados.isbn && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.ISBN].label}: `}
                description={dados.isbn}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Procedencia:
            input = dados.procedencia && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Procedencia].label}: `}
                description={dados.procedencia}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.DataAcervo:
            input = dados.dataAcervo && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.DataAcervo].label}: `}
                description={dados.dataAcervo}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.CopiaDigital:
            input = dados.copiaDigital && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.CopiaDigital].label}: `}
                description={dados.copiaDigital}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Copia:
            input = dados.copia && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Copia].label}: `}
                description={dados.copia}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.AutorizacaoUsoImagem:
            input = dados.permiteUsoImagem && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.AutorizacaoUsoImagem].label}: `}
                description={dados.permiteUsoImagem}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.EstadoConservacao:
            input = dados.conservacao && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.EstadoConservacao].label}: `}
                description={dados.conservacao}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Descricao:
            input = dados.descricao && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Descricao].label}: `}
                description={dados.descricao}
                ellipsis={!!field.ellipsis}
                dangerouslyInnerHTML
              />
            );
            break;
          case FieldAcervoEnum.Duracao:
            input = dados.duracao && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Duracao].label}: `}
                description={dados.duracao}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Quantidade:
            input = dados.quantidade && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Quantidade].label}: `}
                description={dados.quantidade}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Dimensoes:
            input = dados.dimensoes && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Dimensoes].label}: `}
                description={dados.dimensoes}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Tecnica:
            input = dados.tecnica && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Tecnica].label}: `}
                description={dados.tecnica}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Suporte:
            input = dados.suporte && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Suporte].label}: `}
                description={dados.suporte}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.FormatoImagem:
            input = dados.formato && (
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
            input = dados.cromia && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Cromia].label}: `}
                description={dados.cromia}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Resolucao:
            input = dados.resolucao && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Resolucao].label}: `}
                description={dados.resolucao}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Acessibilidade:
            input = dados.acessibilidade && (
              <TextItemCardContentConsultaAcervo
                label={`${PropsByFieldAcervoEnum[FieldAcervoEnum.Acessibilidade].label}: `}
                description={dados.acessibilidade}
                ellipsis={!!field.ellipsis}
              />
            );
            break;
          case FieldAcervoEnum.Disponibilizacao:
            input = dados.disponibilizacao && (
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
            <Col xs={24} key={field.fieldAcervo} style={{ marginBottom: 8, paddingLeft: 32 }}>
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
