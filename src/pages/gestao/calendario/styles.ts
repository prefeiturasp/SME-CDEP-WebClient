import Icon from '@ant-design/icons';
import { Col, Flex } from 'antd';
import styled from 'styled-components';
import { Colors } from '~/core/styles/colors';

type CardMesProps = {
  mesExpandido?: boolean;
};

export const CardMes = styled(Flex)<CardMesProps>`
  width: 100%;
  align-items: center;
  justify-content: space-between;
  background: ${Colors.Neutral.WHITE};
`;

export const WrapperMes = styled(Col)`
  border: 1px solid ${Colors.Components.BORDER_CARD_MESES_CALENDAR};
`;

export const CustomIcon = styled(Icon)<CardMesProps>`
  width: 24px;
  height: 100%;
  font-size: 20px;
  padding-left: 2px;
  position: absolute;
  background: ${(props) =>
    props.mesExpandido ? `${Colors.Neutral.WHITE}` : `${Colors.SystemSME.CDEP.PRIMARY}`};
  color: ${(props) => (props.mesExpandido ? Colors.Neutral.DARK : Colors.Neutral.WHITE)};
`;

export const CustomHeaderCard = styled(Flex)<CardMesProps>`
  width: 100%;
  height: 65px;
  padding: 12px;
  cursor: pointer;
  margin-left: 24px;
  align-items: center;
  justify-content: space-between;
  border-left: ${(props) =>
    props.mesExpandido
      ? `2px solid ${Colors.Neutral.WHITE}`
      : `2px solid ${Colors.Components.BORDER_CARD_MESES_CALENDAR}`};
`;

export const ContainerMes = styled(Col)`
  width: 100%;
  min-height: 64px;
  border-left: 1px solid ${Colors.Components.BORDER_CARD_MESES_CALENDAR};
  border-right: 1px solid ${Colors.Components.BORDER_CARD_MESES_CALENDAR};
`;
