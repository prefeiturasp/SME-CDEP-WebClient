import { Button, Col, Row, Typography } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React, { useContext } from 'react';
import InputTipoAcervoConsulta from '~/components/cdep/input/busca-acervo';
import SelectTipoAcervo from '~/components/cdep/input/tipo-acervo';
import LimparBuscaButton from '~/components/lib/limpar-busca-button';
import { CDEP_INPUT_ANO_FINAL, CDEP_INPUT_ANO_INICIAL } from '~/core/constants/ids/input';
import { Colors } from '~/core/styles/colors';
import { removerTudoQueNaoEhDigito } from '~/core/utils/functions';
import { InputAno } from '~/pages/cadastros/acervo/form/form-fields';
import { ConsultaAcervoContext } from '../provider';
import { notification } from '~/components/lib/notification';

export const FiltroConsultaAcervo: React.FC = () => {
  const form = useFormInstance();

  const { onClickBuscar, limparDados } = useContext(ConsultaAcervoContext);

  const rulesAnoInicialFinal = {
    message: (
      <Typography style={{ color: Colors.Neutral.WHITE }}>
        O ano inicial deve começar a partir de 1900
      </Typography>
    ),
    pattern: /^(19\d{2}|20\d{2})$/,
  };

  const removerCaracteresEspeciaisAnoInicialFinal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = removerTudoQueNaoEhDigito(e.target.value);
    return value;
  };

  return (
    <Col
      xs={24}
      style={{
        position: 'sticky',
        top: 72,
        zIndex: 5,
        backgroundColor: Colors.Components.BACKGROUND_FILTRO_AREA_PUBLICA,
        padding: '20px 60px',
      }}
    >
      <Row gutter={16}>
        <Col xs={24}>
          <Typography
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: Colors.Components.LABEL_FILTRO_AREA_PUBLICA,
            }}
          >
            Faça sua busca
          </Typography>
        </Col>

        <Col xs={24} md={8}>
          <InputTipoAcervoConsulta />
        </Col>

        <Col xs={24} sm={6} md={4}>
          <InputAno
            formItemProps={{
              rules: [rulesAnoInicialFinal, { required: false }],
              name: 'anoInicial',
              label: (
                <Typography
                  style={{ fontWeight: 500, color: Colors.Components.LABEL_FILTRO_AREA_PUBLICA }}
                >
                  Ano inicial
                </Typography>
              ),
              getValueFromEvent: removerCaracteresEspeciaisAnoInicialFinal,
            }}
            inputItemProps={{
              placeholder: 'Ano inicial',
              id: CDEP_INPUT_ANO_INICIAL,
            }}
          />
        </Col>

        <Col xs={24} sm={6} md={4}>
          <InputAno
            formItemProps={{
              rules: [rulesAnoInicialFinal, { required: false }],
              name: 'anoFinal',
              label: (
                <Typography
                  style={{ fontWeight: 500, color: Colors.Components.LABEL_FILTRO_AREA_PUBLICA }}
                >
                  Ano final
                </Typography>
              ),
              getValueFromEvent: removerCaracteresEspeciaisAnoInicialFinal,
            }}
            inputItemProps={{ placeholder: 'Ano final', id: CDEP_INPUT_ANO_FINAL }}
          />
        </Col>

        <Col xs={24} sm={12} md={8}>
          <SelectTipoAcervo
            formItemProps={{
              label: (
                <Typography
                  style={{ fontWeight: 500, color: Colors.Components.LABEL_FILTRO_AREA_PUBLICA }}
                >
                  Busca por tipos de acervos
                </Typography>
              ),
            }}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={24}>
          <Row justify='end' gutter={16}>
            <Col>
              <LimparBuscaButton
                buttonProps={{
                  onClick: () => {
                    limparDados(form);
                  },
                }}
              />
            </Col>
            <Col>
              <Button
                style={{ backgroundColor: '#8F2D40', color: 'white' }}
                onClick={() => {
                  const { anoInicial, anoFinal } = form.getFieldsValue(['anoInicial', 'anoFinal']);

                  const validateDates = (anoInicial: string, anoFinal: string) => {
                    if (anoInicial && anoFinal && parseInt(anoInicial) > parseInt(anoFinal)) {
                      notification.error({
                        message: 'Erro',
                        description: 'Ano inicial não pode ser maior que ano final',
                      });
                      return false;
                    }
                    return true;
                  };

                  if (validateDates(anoInicial, anoFinal)) {
                    onClickBuscar(form);
                  }
                }}
              >
                Buscar
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Col>
  );
};
