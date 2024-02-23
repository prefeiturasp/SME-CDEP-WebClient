import { Col, Row, Typography } from 'antd';
import { useState } from 'react';
import { FaAngleRight, FaCalendarAlt } from 'react-icons/fa';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import { mesesCalendario } from './meses';
import { CardMes, CustomHeaderCard, CustomIcon } from './styles';

export const Calendario = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleActive = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <Col>
      <HeaderPage title='Calendário de visitas' />
      <CardContent>
        <Row>
          {mesesCalendario?.map((mes, index) => {
            const isActive = index === activeIndex;

            return (
              <Col xs={6} md={8} lg={6} key={index}>
                <CardMes isActive={isActive} onClick={() => toggleActive(index)}>
                  <CustomIcon
                    isActive={isActive}
                    component={FaAngleRight}
                    rotate={isActive ? 90 : 0}
                    onClick={() => toggleActive(index)}
                  />
                  <CustomHeaderCard>
                    <Typography>{mes.label}</Typography>
                    <FaCalendarAlt size={16} />
                  </CustomHeaderCard>
                </CardMes>
              </Col>
            );
          })}
        </Row>
      </CardContent>
    </Col>
  );
};
