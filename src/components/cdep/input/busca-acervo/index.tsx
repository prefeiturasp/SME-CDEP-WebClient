import { Form, Input, Typography } from 'antd';
import React from 'react';
import { CDEP_INPUT_BUSCA_TEXTO_LIVRE } from '~/core/constants/ids/input';
import { Colors } from '~/core/styles/colors';

const InputTipoAcervoConsulta: React.FC = () => (
  <Form.Item
    label={
      <Typography style={{ fontWeight: 500, color: Colors.Neutral.WHITE }}>
        Busca por texto livre
      </Typography>
    }
    name='textoLivre'
  >
    <Input
      type='text'
      placeholder='Busque por título, assunto, autor ou crédito'
      id={CDEP_INPUT_BUSCA_TEXTO_LIVRE}
    />
  </Form.Item>
);

export default InputTipoAcervoConsulta;
