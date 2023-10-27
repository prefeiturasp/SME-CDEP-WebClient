import { Typography, TypographyProps } from 'antd';
import React from 'react';

type InfoDescricaoConsultaAcervoProps = {
  valor: string;
  typographyProps?: TypographyProps;
};

const InfoDescricaoConsultaAcervo: React.FC<InfoDescricaoConsultaAcervoProps> = ({
  valor,
  typographyProps,
}) => {
  return (
    <Typography style={{ fontWeight: 'bold', marginLeft: 16 }} {...typographyProps}>
      Descrição: <span style={{ fontWeight: 'normal' }}>{valor}</span>
    </Typography>
  );
};

export default InfoDescricaoConsultaAcervo;
