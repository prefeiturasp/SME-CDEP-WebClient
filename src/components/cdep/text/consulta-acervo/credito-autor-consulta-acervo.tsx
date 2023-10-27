import { Typography, TypographyProps } from 'antd';
import React from 'react';

type InfoCreditoAutorConsultaAcervoProps = {
  valor: string;
  typographyProps?: TypographyProps;
};

const InfoCreditoAutorConsultaAcervo: React.FC<InfoCreditoAutorConsultaAcervoProps> = ({
  valor,
  typographyProps,
}) => {
  return (
    <Typography style={{ fontWeight: 'bold', marginLeft: 16 }} {...typographyProps}>
      Crédito/Autor: <span style={{ fontWeight: 'normal' }}>{valor}</span>
    </Typography>
  );
};

export default InfoCreditoAutorConsultaAcervo;
