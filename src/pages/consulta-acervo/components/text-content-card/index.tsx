import { Tooltip, Typography } from 'antd';
import React from 'react';

type InfoTituloConsultaAcervoProps = {
  label: string;
  description: string;
  ellipsis?: boolean;
  exibirLabelSemValor?: boolean;
};

const TextItemCardContentConsultaAcervo: React.FC<InfoTituloConsultaAcervoProps> = ({
  label,
  description,
  ellipsis = false,
  exibirLabelSemValor = true,
}) => {
  if (!exibirLabelSemValor && !description) return <></>;

  const getDescription = () => {
    if (description?.length > 250) return `${description.substring(0, 250)}...`;

    return description;
  };

  return (
    <Typography.Text strong ellipsis={ellipsis} style={{ width: '100%' }}>
      {label}
      <span style={{ fontWeight: 'normal' }}>
        <Tooltip autoAdjustOverflow title={getDescription()}>
          {description}
        </Tooltip>
      </span>
    </Typography.Text>
  );
};

export default TextItemCardContentConsultaAcervo;
