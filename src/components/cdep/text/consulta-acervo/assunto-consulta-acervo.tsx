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
    <Typography style={{ fontWeight: 'bold', marginLeft: 16 }} {...typographyProps}>
      Assunto: <span style={{ fontWeight: 'normal' }}>{valor}</span>
    </Typography>
  );
};

export default InfoAssuntoConsultaAcervo;
