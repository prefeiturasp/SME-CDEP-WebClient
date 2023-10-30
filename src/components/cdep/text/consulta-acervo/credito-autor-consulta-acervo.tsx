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
      Autoria/Crédito: <span style={{ fontWeight: 'normal' }}>{valor}</span>
    </Typography.Text>
  );
};

export default InfoCreditoAutorConsultaAcervo;
