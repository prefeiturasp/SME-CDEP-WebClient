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
      Descrição: <span style={{ fontWeight: 'normal' }}>{valor}</span>
    </Typography.Text>
  );
};

export default InfoDescricaoConsultaAcervo;
