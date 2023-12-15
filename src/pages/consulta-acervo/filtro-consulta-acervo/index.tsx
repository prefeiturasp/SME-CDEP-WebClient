import { Col, Row, Typography } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React from 'react';
import InputTipoAcervoConsulta from '~/components/cdep/input/busca-acervo';
import SelectTipoAcervo from '~/components/cdep/input/tipo-acervo';
import LimparBuscaButton from '~/components/lib/limpar-busca-button';
import { CDEP_INPUT_ANO_FINAL, CDEP_INPUT_ANO_INICIAL } from '~/core/constants/ids/input';
import { Colors } from '~/core/styles/colors';
import { InputAno } from '~/pages/cadastros/acervo/form/form-fields';

export const FiltroConsultaAcervo: React.FC = () => {
  const form = useFormInstance();

  return (
    <Col
      xs={24}
      style={{
        position: 'sticky',
        top: 72,
        zIndex: 1,
        backgroundColor: Colors.BACKGROUND_FILTRO_AREA_PUBLICA,
        padding: '20px 60px',
      }}
    >
      <Row gutter={16}>
        <Col xs={24}>
          <Typography style={{ fontSize: 24, fontWeight: 'bold', color: '#292929' }}>
            Faça sua busca
          </Typography>
        </Col>

        <Col xs={24} md={8}>
          <InputTipoAcervoConsulta />
        </Col>

        <Col xs={24} sm={6} md={4}>
          <InputAno
            formItemProps={{
              rules: [{ required: false }],
              name: 'anoInicial',
              label: (
                <Typography style={{ fontWeight: 500, color: '#292929' }}>Ano inicial</Typography>
              ),
            }}
            inputItemProps={{ placeholder: 'Ano inicial', id: CDEP_INPUT_ANO_INICIAL }}
          />
        </Col>

        <Col xs={24} sm={6} md={4}>
          <InputAno
            formItemProps={{
              rules: [{ required: false }],
              name: 'anoFinal',
              label: (
                <Typography style={{ fontWeight: 500, color: '#292929' }}>Ano final</Typography>
              ),
            }}
            inputItemProps={{ placeholder: 'Ano final', id: CDEP_INPUT_ANO_FINAL }}
          />
        </Col>

        <Col xs={24} sm={12} md={8}>
          <SelectTipoAcervo
            formItemProps={{
              label: (
                <Typography style={{ fontWeight: 500, color: '#292929' }}>
                  Busca por tipos de acervos
                </Typography>
              ),
            }}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={24}>
          <Row justify='end'>
            <LimparBuscaButton
              buttonProps={{
                onClick: () => {
                  form.resetFields();
                },
              }}
            />
          </Row>
        </Col>
      </Row>
    </Col>
  );
};
