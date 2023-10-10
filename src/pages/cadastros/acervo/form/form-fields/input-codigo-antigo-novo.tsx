import { Col, Form, Input, Row } from 'antd';
import React from 'react';
import { CDEP_INPUT_CODIGO_ANTIGO, CDEP_INPUT_CODIGO_NOVO } from '~/core/constants/ids/input';

const InputCodigoAntigoNovo: React.FC = () => {
  return (
    <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
      {(form) => {
        const codigoAntigoEstaPreenchido = !!form.getFieldValue('codigo');
        const codigoNovoEstaPreenchido = !!form.getFieldValue('codigoNovo');

        return (
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label='Codigo antigo'
                name='codigo'
                rules={[{ required: !codigoNovoEstaPreenchido, whitespace: true }]}
              >
                <Input
                  type='text'
                  placeholder='Codigo antigo'
                  maxLength={15}
                  id={CDEP_INPUT_CODIGO_ANTIGO}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label='Codigo novo'
                name='codigoNovo'
                rules={[{ required: !codigoAntigoEstaPreenchido, whitespace: true }]}
              >
                <Input
                  type='text'
                  placeholder='Codigo novo'
                  maxLength={15}
                  id={CDEP_INPUT_CODIGO_NOVO}
                />
              </Form.Item>
            </Col>
          </Row>
        );
      }}
    </Form.Item>
  );
};

export default InputCodigoAntigoNovo;
