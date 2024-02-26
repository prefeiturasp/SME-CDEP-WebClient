import Icon from '@ant-design/icons';
import { Col, Flex } from 'antd';
import styled from 'styled-components';
import { Colors } from '~/core/styles/colors';

type CardMesProps = {
  isActive?: boolean;
};

export const CardMes = styled(Flex)<CardMesProps>`
  width: 100%;
  align-items: center;
  padding: 16px 16px 16px 0;
  justify-content: space-between;
  background: ${Colors.Neutral.WHITE};
  border: 1px solid ${Colors.Components.BORDER_CARD_MESES_CALENDAR};
  border-left: ${(props) =>
    props.isActive
      ? `24px solid ${Colors.Neutral.WHITE}`
      : `24px solid ${Colors.SystemSME.CDEP.PRIMARY}`};
`;

export const CustomIcon = styled(Icon)<CardMesProps>`
  margin: -22px;
  font-size: 20px;
  color: ${(props) => (props.isActive ? Colors.Neutral.DARK : Colors.Neutral.WHITE)};
`;

export const CustomHeaderCard = styled(Flex)<CardMesProps>`
  width: 100%;
  cursor: pointer;
  padding-left: 16px;
  justify-content: space-between;
`;

export const CustomSemanas = styled(Col)`
  background: #ce2;
`;
