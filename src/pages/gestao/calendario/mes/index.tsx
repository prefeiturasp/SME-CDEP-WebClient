import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  DiaDTO,
  EventoDetalheDTO,
  EventoTagDTO,
  SemanaDTO,
} from '~/core/dto/calendario-evento-dto';
import { MesesEnum } from '~/core/enum/meses';
import { obterDetalheDia } from '~/core/services/calendario-eventos-service';
import { MesesRowProps } from '../meses';
import { DetalhesEventoDia } from './detalhes-evento-dia';
import { diasSemana } from './dias-semana';
import { ContainerDia, Dias, DivTag, NomeDia } from './styles';

type LinhaExpandidaProps = {
  indexLinha: number;
  keyDia: number;
};

type MesProps = {
  semanas: SemanaDTO[] | undefined;
  mesEscolhido: MesesEnum | undefined;
  onClickMes?: (mes: MesesRowProps, indexLinha: number) => void;
  carregarDadosMesSelecionado?: any;
};

export const Mes: React.FC<MesProps> = ({
  mesEscolhido,
  semanas,
  onClickMes,
  carregarDadosMesSelecionado,
}) => {
  const [dados, setDados] = useState<EventoDetalheDTO[] | undefined>();
  const [indexDiaExpandido, setIndexDiaExpandido] = useState<LinhaExpandidaProps | undefined>();
  const [diaEscolhido, setDiaEscolhido] = useState<number>();

  const toggleActive = (dia: DiaDTO, indexLinha: number) => {
    if (indexDiaExpandido?.keyDia === dia.dia) {
      setIndexDiaExpandido(undefined);
    } else {
      setIndexDiaExpandido({ indexLinha, keyDia: dia.dia });
      setDiaEscolhido(dia.dia);
    }
  };

  const carregarDadosDiaSelecionado = async (diaSelecionado: number) => {
    if (mesEscolhido) {
      await obterDetalheDia(diaSelecionado, mesEscolhido).then((resposta) => {
        if (resposta.sucesso) {
          setDados([resposta?.dados]);
        }
      });
    }
  };

  const onClickDia = (dia: DiaDTO, indexLinha: number) => {
    carregarDadosDiaSelecionado(dia.dia);
    toggleActive(dia, indexLinha);
  };

  useEffect(() => {
    if (onClickMes) {
      setIndexDiaExpandido(undefined);
    }
  }, [onClickMes]);

  return (
    <Col xs={24}>
      <Row>
        {diasSemana?.map((item, index) => {
          return <NomeDia key={index}>{item.label}</NomeDia>;
        })}
      </Row>

      {semanas?.map((semana) => {
        const linhaExpandida = semana?.numero === indexDiaExpandido?.indexLinha;

        const row = semana?.dias.map((dia) => {
          const diaExpandido = dia.dia === indexDiaExpandido?.keyDia;
          const eventoTipoId = dia.eventosTag.find((item) => item?.tipoId);

          return (
            <Dias
              key={dia.dia}
              dayOfWeek={dia.dayOfWeek}
              diaExpandido={diaExpandido}
              eventoTipoId={eventoTipoId}
              desabilitado={dia.desabilitado}
              onClick={() => {
                onClickDia(dia, semana?.numero);
              }}
            >
              <Col xs={24}>
                <Row>
                  <Col>{dia.dia}</Col>
                  <Col>
                    <ContainerDia>
                      {dia?.eventosTag?.map((tag: EventoTagDTO) => {
                        return (
                          <DivTag tipoId={tag?.tipoId} key={tag.tipoId}>
                            {tag.tipo}
                          </DivTag>
                        );
                      })}
                    </ContainerDia>
                  </Col>
                </Row>
              </Col>
            </Dias>
          );
        });

        return (
          <Col key={semana.numero} xs={24}>
            <Row>{row}</Row>
            {linhaExpandida && (
              <>
                {dados?.map((evento) => {
                  return (
                    <DetalhesEventoDia
                      evento={evento}
                      key={evento.id}
                      mesEscolhido={mesEscolhido}
                      diaEscolhido={diaEscolhido}
                      carregarDadosMesSelecionado={carregarDadosMesSelecionado}
                    />
                  );
                })}
              </>
            )}
          </Col>
        );
      })}
    </Col>
  );
};
