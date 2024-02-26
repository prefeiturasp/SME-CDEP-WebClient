import { Col, Row, Typography } from 'antd';
import React, { useState } from 'react';
import { FaAngleRight, FaCalendarAlt } from 'react-icons/fa';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import { obterSemanas } from '~/core/services/calendario-eventos-service';
import { Colors } from '~/core/styles/colors';
import { MesesProps, mesesCalendario } from './meses';
import { CardMes, CustomHeaderCard, CustomIcon, CustomSemanas } from './styles';

export const Calendario = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleActive = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  const carregarDadosMesSelecionado = async (mesSelecionado: number) => {
    const resposta = await obterSemanas(mesSelecionado);
    if (resposta.sucesso) {
      return;
    }
  };

  const onClickMes = (mes: MesesProps, index: number) => {
    carregarDadosMesSelecionado(mes.key);
    toggleActive(index);
  };

  return (
    <Col>
      <HeaderPage title='Calendário de visitas' />
      <CardContent>
        <Row style={{ background: Colors.BACKGROUND_CONTENT }}>
          {mesesCalendario?.map((mes, index) => {
            const isActive = index === activeIndex;

            return (
              <React.Fragment key={index}>
                <Col xs={6} md={8} lg={6}>
                  <CardMes isActive={isActive} onClick={() => onClickMes(mes, index)}>
                    <CustomIcon
                      isActive={isActive}
                      component={FaAngleRight}
                      rotate={isActive ? 90 : 0}
                      onClick={() => onClickMes(mes, index)}
                    />
                    <CustomHeaderCard>
                      <Typography>{mes.label}</Typography>
                      <FaCalendarAlt size={16} />
                    </CustomHeaderCard>
                  </CardMes>
                  {isActive && <CustomSemanas>Teste</CustomSemanas>}
                </Col>
              </React.Fragment>
            );
          })}
        </Row>
      </CardContent>
    </Col>
  );
};
