import Icon from '@ant-design/icons';
import { Col, Collapse, CollapseProps, Row } from 'antd';
import { FaAngleRight, FaCalendarAlt } from 'react-icons/fa';
import styled from 'styled-components';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import { Colors } from '~/core/styles/colors';
import { mesesCalendario } from './meses';

const DivCalendar = styled(Col)`
  .ant-collapse-item .ant-collapse-header {
    padding-left: 0;
    border-left: 24px solid ${Colors.SystemSME.CDEP.PRIMARY};

    &.ant-collapse-header {
      border-radius: 0;
    }

    .ant-collapse-expand-icon {
      left: -29px;
      position: relative;
      color: ${Colors.Neutral.WHITE};

      .ant-collapse-arrow {
        font-size: large;
      }
    }
  }
`;

export const Calendario = () => {
  return (
    <Col>
      <HeaderPage title='Calendário de visitas' />
      <CardContent>
        <Row>
          {mesesCalendario?.map((mes, index) => {
            const items: CollapseProps['items'] = [
              {
                key: index,
                label: mes.label,
                extra: <FaCalendarAlt size={16} />,
                children: <Col>Dias do mes selecionado</Col>,
              },
            ];

            return (
              <Col
                xs={24}
                md={8}
                lg={6}
                key={index}
                style={{
                  background: Colors.BACKGROUND_CONTENT,
                }}
              >
                <DivCalendar>
                  <Collapse
                    accordion
                    size='large'
                    items={items}
                    destroyInactivePanel
                    style={{
                      borderRadius: 0,
                      background: Colors.Neutral.WHITE,
                    }}
                    expandIcon={({ isActive }) => (
                      <Icon component={FaAngleRight} rotate={isActive ? 90 : 0} />
                    )}
                  />
                </DivCalendar>
              </Col>
            );
          })}
        </Row>
      </CardContent>
    </Col>
  );
};
