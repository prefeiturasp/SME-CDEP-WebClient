import { Typography, TypographyProps } from 'antd';
import React from 'react';

type InfoTipoAcervoConsultaAcervoProps = {
  valor: string;
  typographyProps?: TypographyProps;
};

const InfoTipoAcervoConsultaAcervo: React.FC<InfoTipoAcervoConsultaAcervoProps> = ({
  valor,
  typographyProps,
}) => {
  return (
    <Typography style={{ fontWeight: 'bold', marginLeft: 16 }} {...typographyProps}>
      Tipo de acervo: <span style={{ fontWeight: 'normal' }}>{valor}</span>
    </Typography>
  );
};

export default InfoTipoAcervoConsultaAcervo;
