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
import { diasSemana } from './dias-semana';
import { ContainerDia, ContainerDiaExpandido, Dias, DivTag, NomeDia } from './styles';

type LinhaExpandidaProps = {
  indexLinha: number;
  keyDia: number;
};

type MesProps = {
  semanas: SemanaDTO[] | undefined;
  mesEscolhido: MesesEnum | undefined;
  onClickMes?: (mes: MesesRowProps, indexLinha: number) => void;
};

export const Mes: React.FC<MesProps> = ({ mesEscolhido, semanas, onClickMes }) => {
  const [dados, setDados] = useState<EventoDetalheDTO>();
  const [indexDiaExpandido, setIndexDiaExpandido] = useState<LinhaExpandidaProps | undefined>();

  const toggleActive = (dia: DiaDTO, indexLinha: number) => {
    if (indexDiaExpandido?.keyDia === dia.dia) {
      setIndexDiaExpandido(undefined);
    } else {
      setIndexDiaExpandido({ indexLinha, keyDia: dia.dia });
    }
  };

  const carregarDadosDiaSelecionado = async (diaSelecionado: number) => {
    if (mesEscolhido) {
      await obterDetalheDia(diaSelecionado, mesEscolhido).then((resposta) => {
        if (resposta.sucesso) {
          setDados(resposta?.dados);
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

          return (
            <Dias
              key={dia.dia}
              dayOfWeek={dia.dayOfWeek}
              desabilitado={dia.desabilitado}
              diaExpandido={diaExpandido}
              onClick={() => onClickDia(dia, semana?.numero)}
            >
              <ContainerDia>
                {dia.dia}
                {dia?.eventosTag?.map((tag: EventoTagDTO) => {
                  return (
                    <DivTag tipoId={tag?.tipoId} key={tag.tipoId}>
                      {tag.tipo}
                    </DivTag>
                  );
                })}
              </ContainerDia>
            </Dias>
          );
        });

        return (
          <Col key={semana.numero} xs={24}>
            <Row>{row}</Row>
            {linhaExpandida && <ContainerDiaExpandido>dados</ContainerDiaExpandido>}
          </Col>
        );
      })}
    </Col>
  );
};
