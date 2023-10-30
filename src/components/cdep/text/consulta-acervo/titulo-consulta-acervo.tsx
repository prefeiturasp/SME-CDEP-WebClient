import { Typography, TypographyProps } from 'antd';
import React from 'react';

type InfoTituloConsultaAcervoProps = {
  valor: string;
  typographyProps?: TypographyProps;
};

const InfoTituloConsultaAcervo: React.FC<InfoTituloConsultaAcervoProps> = ({
  valor,
  typographyProps,
}) => {
  return (
    <Typography.Text
      ellipsis
      style={{
        marginLeft: 16,
        marginRight: 16,
        fontWeight: 'bold',
        width: valor.length > 100 ? 500 : 'auto',
      }}
      {...typographyProps}
    >
      Título: <span style={{ fontWeight: 'normal' }}>{valor}</span>
    </Typography.Text>
  );
};

export default InfoTituloConsultaAcervo;
