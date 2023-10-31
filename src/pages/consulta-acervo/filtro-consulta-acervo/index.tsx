import { Card, Col, Row, Space } from 'antd';
import React from 'react';
import InputTipoAcervoConsulta from '~/components/cdep/input/busca-acervo';
import SelectTipoAcervoConsulta from '~/components/cdep/input/tipo-acervo-consulta';
import LimparBuscaButton from '~/components/lib/limpar-busca-button';
import { Colors } from '~/core/styles/colors';

type FiltroConsultaAcervoProps = {
  buscaTextoLivre: string;
  buscaTipoAcervo: number | null;
  setBuscaTextoLivre: React.Dispatch<React.SetStateAction<string>>;
  setBuscaTipoAcervo: React.Dispatch<React.SetStateAction<number | null>>;
};

export const FiltroConsultaAcervo: React.FC<FiltroConsultaAcervoProps> = ({
  buscaTextoLivre,
  buscaTipoAcervo,
  setBuscaTextoLivre,
  setBuscaTipoAcervo,
}) => {
  return (
    <Card
      style={{
        margin: '0 16px',
        backgroundColor: `${Colors.CDEP_PRIMARY}`,
      }}
    >
      <Row gutter={16} justify='space-between'>
        <Col span={12}>
          <InputTipoAcervoConsulta
            inputProps={{ value: buscaTextoLivre }}
            onChange={(e) => setBuscaTextoLivre(e.target.value)}
          />
        </Col>
        <Col span={12}>
          <SelectTipoAcervoConsulta
            selectProps={{
              value: buscaTipoAcervo || undefined,
              onClear: () => setBuscaTipoAcervo(null),
            }}
            onSelect={(value) => setBuscaTipoAcervo(value)}
          />
        </Col>
      </Row>
      <Row justify='end' style={{ marginTop: 16 }}>
        <Space size={16}>
          <LimparBuscaButton
            buttonProps={{
              onClick: () => {
                setBuscaTextoLivre('');
                setBuscaTipoAcervo(null);
              },
            }}
          />
        </Space>
      </Row>
    </Card>
  );
};
