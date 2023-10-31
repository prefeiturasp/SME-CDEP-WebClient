import { Typography, TypographyProps } from 'antd';
import React from 'react';

type InfoDataConsultaAcervoProps = {
  valor: string;
  typographyProps?: TypographyProps;
};

const InfoDataConsultaAcervo: React.FC<InfoDataConsultaAcervoProps> = ({
  valor,
  typographyProps,
}) => {
  return (
    <Typography style={{ fontWeight: 'bold', marginLeft: 16 }} {...typographyProps}>
      Data: <span style={{ fontWeight: 'normal' }}>{valor}</span>
    </Typography>
  );
};

export default InfoDataConsultaAcervo;
