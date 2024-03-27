import { Space, Tag, Tooltip, Typography } from 'antd';
import React from 'react';
import { AcervoDisponibilidadeSituacaoEnum } from '~/core/enum/acervo-disponibilidade-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { configTagAcervoDisponibilidadeMap } from '~/pages/operacoes/solicitacao/components/lista-acervos-solicitacao/utils';

type InfoTituloConsultaAcervoProps = {
  label: string;
  description: string | React.ReactNode;
  ellipsis?: boolean;
  exibirLabelSemValor?: boolean;
  exibirTooltip?: boolean;
  dangerouslyInnerHTML?: boolean;
  item?: any;
};

export const TextItemCardContentConsultaAcervo: React.FC<InfoTituloConsultaAcervoProps> = ({
  item,
  label,
  description,
  ellipsis = false,
  exibirTooltip = false,
  exibirLabelSemValor = false,
  dangerouslyInnerHTML = false,
}) => {
  if (!exibirLabelSemValor && !description) return <></>;

  let conteudo: string | React.ReactNode = description;

  const getDescription = () => {
    if (typeof description === 'string') {
      if (description?.length > 250) return `${description?.substring(0, 250)}...`;

      return description;
    }
  };

  if (dangerouslyInnerHTML) {
    conteudo = <Typography dangerouslySetInnerHTML={{ __html: description ?? '' }} />;
  }

  let config;
  const validarDisponibilidade = item?.temControleDisponibilidade && item?.estaDisponivel;

  if (validarDisponibilidade) {
    config = configTagAcervoDisponibilidadeMap[AcervoDisponibilidadeSituacaoEnum.DISPONIVEL];
  } else if (!validarDisponibilidade) {
    config = {};
  }

  return (
    <Space>
      <Typography.Text strong ellipsis={ellipsis} style={{ width: '100%' }}>
        {label}
        <span style={{ fontWeight: 'normal' }}>
          {exibirTooltip ? (
            <Tooltip autoAdjustOverflow title={getDescription()}>
              {conteudo}
            </Tooltip>
          ) : (
            conteudo
          )}
        </span>
      </Typography.Text>
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
    </Space>
  );
};
