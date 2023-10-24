import { Col } from 'antd';
import { FiltroConsultaAcervo } from './filtro-consulta-acervo';
import { ListaCardsConsultaAcervo } from './lista-cards-consulta-acervo';

export const ConsultaAcervo = () => {
  return (
    <>
      <Col style={{ position: 'sticky', top: 0, zIndex: 1 }}>
        <FiltroConsultaAcervo />
      </Col>
      <ListaCardsConsultaAcervo />
    </>
  );
};
