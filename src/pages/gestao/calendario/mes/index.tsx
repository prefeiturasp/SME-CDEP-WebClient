import { Col, Row } from 'antd';
import { CalendarioEventoDTO, SemanaDTO } from '~/core/dto/calendario-evento-dto';
import { diasSemana } from './dias-semana';
import { Dias, NomeDia } from './styles';

export const Mes = ({ semanas }: CalendarioEventoDTO) => {
  return (
    <Col xs={24}>
      <Row>
        {diasSemana?.map((item, index) => {
          return <NomeDia key={index}>{item.label}</NomeDia>;
        })}
      </Row>

      {semanas?.map((semana: SemanaDTO) => {
        return (
          <Row key={semana?.numero}>
            {semana?.dias.map((dia, index) => {
              return (
                <Dias desabilitado={dia.desabilitado} dayOfWeek={dia.dayOfWeek} key={index}>
                  {dia.dia}
                </Dias>
              );
            })}
          </Row>
        );
      })}
    </Col>
  );
};
