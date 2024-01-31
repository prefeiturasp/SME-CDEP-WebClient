import { Tooltip, Typography } from 'antd';
import React from 'react';

type InfoTituloConsultaAcervoProps = {
  label: string;
  description: string;
  ellipsis?: boolean;
  exibirLabelSemValor?: boolean;
  exibirTooltip?: boolean;
  dangerouslyInnerHTML?: boolean;
};

const TextItemCardContentConsultaAcervo: React.FC<InfoTituloConsultaAcervoProps> = ({
  label,
  description,
  ellipsis = false,
  exibirLabelSemValor = false,
  exibirTooltip = false,
  dangerouslyInnerHTML = false,
}) => {
  if (!exibirLabelSemValor && !description) return <></>;

  let conteudo: string | React.ReactNode = description;

  const getDescription = () => {
    if (description?.length > 250) return `${description.substring(0, 250)}...`;

    return description;
  };

  if (dangerouslyInnerHTML) {
    conteudo = <Typography dangerouslySetInnerHTML={{ __html: description }} />;
  }

  return (
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
  );
};

export default TextItemCardContentConsultaAcervo;
