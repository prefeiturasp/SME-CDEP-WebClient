import { Col, Form, Input, Row } from 'antd';
import React from 'react';
import { CDEP_INPUT_CODIGO_NOVO, CDEP_INPUT_TOMBO } from '~/core/constants/ids/input';

const InputCodigoAntigoNovo: React.FC = () => {
  return (
    <Form.Item shouldUpdate>
      {(form) => {
        const codigoAntigoEstaPreenchido = form.getFieldValue('codigo')?.length ? false : true;
        const codigoNovoEstaPreenchido = form.getFieldValue('codigoNovo')?.length ? false : true;

        return (
          <Row gutter={16}>
            <Col sm={12}>
              <Form.Item
                label='Codigo Antigo'
                name='codigo'
                rules={[{ required: codigoNovoEstaPreenchido, whitespace: true }]}
              >
                <Input
                  type='text'
                  placeholder='Codigo Antigo'
                  maxLength={15}
                  id={CDEP_INPUT_TOMBO}
                />
              </Form.Item>
            </Col>
            <Col sm={12}>
              <Form.Item
                label='Codigo Novo'
                name='codigoNovo'
                rules={[{ required: codigoAntigoEstaPreenchido, whitespace: true }]}
              >
                <Input
                  type='text'
                  placeholder='Codigo Novo'
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
