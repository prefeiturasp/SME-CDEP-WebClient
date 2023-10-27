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
    <Typography style={{ fontWeight: 'bold', marginLeft: 16 }} {...typographyProps}>
      Título: <span style={{ fontWeight: 'normal' }}>{valor}</span>
    </Typography>
  );
};

export default InfoTituloConsultaAcervo;
