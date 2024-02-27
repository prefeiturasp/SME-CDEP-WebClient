import { Col, Row, Tag } from 'antd';
import styled from 'styled-components';
import { DiasSemanaEnum } from '~/core/enum/dias-semana';
import { TipoEventoEnum } from '~/core/enum/tipo-evento-enum';
import { Colors } from '~/core/styles/colors';

type DiasProps = {
  desabilitado?: boolean;
  dayOfWeek?: DiasSemanaEnum;
  diaExpandido?: boolean;
};

type EventosTagProps = {
  tipoId: TipoEventoEnum;
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
  cursor: pointer;
  align-items: end;
  width: calc(100% / 7);
  border: 1px solid ${Colors.Components.BORDER_CARD_MESES_CALENDAR};
  border-bottom: ${(props) =>
    props.diaExpandido ? 'none' : `1px solid ${Colors.Components.BORDER_CARD_MESES_CALENDAR}`};
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

export const ContainerDia = styled(Row)`
  width: 100%;
  border-radius: 5px;
  justify-content: space-between;
  padding-left: 6px;
`;

export const DivTag = styled(Tag)<EventosTagProps>`
  border-radius: 10px;
  justify-content: space-between;
  color: ${Colors.Neutral.WHITE};
  background: ${(props) => {
    if (props.tipoId === TipoEventoEnum.FERIADO) {
      return `${Colors.Components.BACKGROUND_TAGS_CALENDARIO.FERIADO}`;
    } else if (props.tipoId === TipoEventoEnum.VISITA) {
      return `${Colors.Components.BACKGROUND_TAGS_CALENDARIO.VISITA}`;
    } else if (props.tipoId === TipoEventoEnum.SUSPENSAO) {
      return `${Colors.Components.BACKGROUND_TAGS_CALENDARIO.SUSPENSAO}`;
    }
  }};
`;

export const ContainerDiaExpandido = styled(Col)`
  width: 100%;
  min-height: 64px;
  border-left: 1px solid ${Colors.Components.BORDER_CARD_MESES_CALENDAR};
  border-right: 1px solid ${Colors.Components.BORDER_CARD_MESES_CALENDAR};
  background: ${Colors.Neutral.WHITE};
`;
