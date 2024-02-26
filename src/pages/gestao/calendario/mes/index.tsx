import { Col, Row } from 'antd';
import { CalendarioEventoDTO, EventoTagDTO, SemanaDTO } from '~/core/dto/calendario-evento-dto';
import { diasSemana } from './dias-semana';
import { Dias, DivDia, DivTag, NomeDia } from './styles';

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
                  <DivDia>
                    {dia.dia}
                    {dia?.eventosTag?.map((tag: EventoTagDTO) => {
                      return (
                        <DivTag tipoId={tag?.tipoId} key={tag.tipoId}>
                          {tag.tipo}
                        </DivTag>
                      );
                    })}
                  </DivDia>
                </Dias>
              );
            })}
          </Row>
        );
      })}
    </Col>
  );
};
