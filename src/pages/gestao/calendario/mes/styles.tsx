import styled from 'styled-components';
import { DiasSemanaEnum } from '~/core/enum/dias-semana';
import { Colors } from '~/core/styles/colors';

type DiasProps = {
  desabilitado?: boolean;
  dayOfWeek?: DiasSemanaEnum;
};

export const NomeDia = styled.div`
  height: 38px;
  display: flex;
  align-items: center;
  width: calc(100% / 7);
  justify-content: center;
  background: ${Colors.Neutral.WHITE};
`;

export const Dias = styled.div<DiasProps>`
  height: 64px;
  padding: 4px;
  display: flex;
  align-items: end;
  border: 1px solid;
  width: calc(100% / 7);
  border: 1px solid ${Colors.Components.BORDER_CARD_MESES_CALENDAR};
  background: ${(props) => {
    if (props.dayOfWeek === DiasSemanaEnum.Domingo) {
      return `${Colors.Components.BACKGROUND_CALENDARIO_DOMINGOS}`;
    } else if (props.dayOfWeek === DiasSemanaEnum.Sabado) {
      return `${Colors.BACKGROUND_CONTENT}`;
    } else if (props.desabilitado) {
      return `${Colors.BACKGROUND_CONTENT}`;
    }

    return `${Colors.Neutral.WHITE}`;
  }};
  color: ${(props) => {
    if (props.desabilitado) {
      return `${Colors.Neutral.LIGHT}`;
    }
  }};
`;
