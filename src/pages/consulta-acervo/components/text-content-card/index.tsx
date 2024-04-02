import { Col, Row, Tag, Typography } from 'antd';
import React from 'react';
import { HighlightedText } from '~/components/cdep/destacar-texto';
import { AcervoDisponibilidadeSituacaoEnum } from '~/core/enum/acervo-disponibilidade-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { configTagAcervoDisponibilidadeMap } from '~/pages/operacoes/solicitacao/components/lista-acervos-solicitacao/utils';

type InfoTituloConsultaAcervoProps = {
  label: string;
  description: string;
  ellipsis?: boolean;
  exibirLabelSemValor?: boolean;
  exibirTooltip?: boolean;
  dangerouslyInnerHTML?: boolean;
  item?: any;
  hasHighlightedText?: boolean;
  termoPesquisado?: any;
};

export const TextItemCardContentConsultaAcervo: React.FC<InfoTituloConsultaAcervoProps> = ({
  item,
  label,
  description,
  ellipsis = false,
  exibirTooltip = false,
  exibirLabelSemValor = false,
  dangerouslyInnerHTML = false,
  hasHighlightedText = false,
  termoPesquisado = [],
}) => {
  if (!exibirLabelSemValor && !description) return <></>;

  let conteudo: string | React.ReactNode = description;

  if (dangerouslyInnerHTML) {
    conteudo = <Typography dangerouslySetInnerHTML={{ __html: description ?? '' }} />;
  }

  let config;
  const validarDisponibilidade = item?.temControleDisponibilidade && item?.estaDisponivel;

  if (validarDisponibilidade) {
    config = configTagAcervoDisponibilidadeMap[AcervoDisponibilidadeSituacaoEnum.DISPONIVEL];
  } else if (!validarDisponibilidade) {
    config =
      configTagAcervoDisponibilidadeMap[
        AcervoDisponibilidadeSituacaoEnum.INDISPONIVEL_PARA_RESERVA_EMPRESTIMO
      ];
  }

  if (hasHighlightedText) {
    conteudo = <HighlightedText text={description} searchTerm={termoPesquisado} />;
  }

  return (
    <Row wrap={false} gutter={12}>
      <Col>
        <Typography.Text ellipsis={ellipsis} title={exibirTooltip ? description : ''}>
          <span style={{ fontWeight: 700 }}>{label}</span>
          <span>{conteudo}</span>
        </Typography.Text>
      </Col>

      <Col>
        {(item?.tipo || item?.tipoAcervoId) === TipoAcervo?.Bibliografico && (
          <Tag color={config?.bgColor}>
            <Typography.Text
              style={{
                color: config?.labelColor,
              }}
            >
              {item?.situacaoDisponibilidade}
            </Typography.Text>
          </Tag>
        )}
      </Col>
    </Row>
  );
};
