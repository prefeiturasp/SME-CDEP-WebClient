import { Col, Row, Typography } from 'antd';
import { useState } from 'react';
import { FaAngleRight, FaCalendarAlt } from 'react-icons/fa';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import { MesesEnum } from '~/core/enum/meses';
import { obterSemanas } from '~/core/services/calendario-eventos-service';
import { Colors } from '~/core/styles/colors';
import { MesesRowProps, mesesCalendario } from './meses';
import { CardMes, CustomHeaderCard, CustomIcon, CustomSemanas, DivRow } from './styles';

type LinhaExpandidaProps = {
  indexLinha: number;
  keyMes: MesesEnum;
};
export const Calendario = () => {
  const [indexMesExpandido, setIndexMesExpandido] = useState<LinhaExpandidaProps | undefined>();

  const toggleActive = (mes: MesesRowProps, indexLinha: number) => {
    if (indexMesExpandido?.keyMes === mes.key) {
      setIndexMesExpandido(undefined);
    } else {
      setIndexMesExpandido({ indexLinha, keyMes: mes.key });
    }
  };

  const carregarDadosMesSelecionado = async (mesSelecionado: number) => {
    const resposta = await obterSemanas(mesSelecionado);
    if (resposta.sucesso) {
      return;
    }
  };

  const onClickMes = (mes: MesesRowProps, indexLinha: number) => {
    carregarDadosMesSelecionado(mes.key);
    toggleActive(mes, indexLinha);
  };

  return (
    <Col>
      <HeaderPage title='Calendário de visitas' />
      <CardContent>
        <Row style={{ background: Colors.BACKGROUND_CONTENT }}>
          {mesesCalendario.map((item, indexLinha) => {
            const linhaExpandida = indexLinha === indexMesExpandido?.indexLinha;

            const row = item.row.map((mes) => {
              const mesExpandido = mes.key === indexMesExpandido?.keyMes;

              return (
                <DivRow key={mes.key} xs={6}>
                  <CardMes mesExpandido={mesExpandido} onClick={() => onClickMes(mes, indexLinha)}>
                    <CustomIcon
                      component={FaAngleRight}
                      mesExpandido={mesExpandido}
                      rotate={mesExpandido ? 90 : 0}
                      onClick={() => onClickMes(mes, indexLinha)}
                    />
                    <CustomHeaderCard>
                      <Typography>{mes.label}</Typography>
                      <FaCalendarAlt size={16} />
                    </CustomHeaderCard>
                  </CardMes>
                </DivRow>
              );
            });

            return (
              <Col key={indexLinha} xs={24}>
                <Row>{row}</Row>
                {linhaExpandida && <CustomSemanas>{indexMesExpandido.keyMes}</CustomSemanas>}
              </Col>
            );
          })}
        </Row>
      </CardContent>
    </Col>
  );
};
