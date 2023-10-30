import { Typography, TypographyProps } from 'antd';
import React from 'react';

type InfoAssuntoConsultaAcervoProps = {
  valor: string;
  typographyProps?: TypographyProps;
};

const InfoAssuntoConsultaAcervo: React.FC<InfoAssuntoConsultaAcervoProps> = ({
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
      Assunto: <span style={{ fontWeight: 'normal' }}>{valor}</span>
    </Typography.Text>
  );
};

export default InfoAssuntoConsultaAcervo;
