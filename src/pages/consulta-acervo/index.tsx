import { Col, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import cdepLogoHorizontal from '~/assets/cdep-logo-horizontal.svg';
import Header from '~/components/lib/header';
import { ROUTES } from '~/core/enum/routes';
import { ButtonEnviarParaMinhaSelecao } from './components/button-enviar-para-minha-selecao';
import { FiltroConsultaAcervo } from './filtro-consulta-acervo';
import ConsultaAcervoContextProvider, { ConsultaAcervoContext } from './provider';

const StickyButtonEnviar: React.FC = () => {
  const location = useLocation();
  const { dataSource } = useContext(ConsultaAcervoContext);

  if (location.pathname !== ROUTES.CONSULTA_ACERVO || dataSource.length === 0) return null;

  return (
    <Row justify='end' style={{ padding: '20px 60px', backgroundColor: '#fff' }}>
      <Col>
        <ButtonEnviarParaMinhaSelecao />
      </Col>
    </Row>
  );
};

export const ConsultaAcervo = () => {
  const [form] = useForm();

  return (
    <>
      <Header
        disableSticky
        style={{ backgroundColor: '#F4F4F2' }}
        logo={
          <img style={{ width: '245px' }} src={cdepLogoHorizontal} alt='CDEP LOGO HORIZONTAL' />
        }
      />
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        initialValues={{ anoInicial: '', anoFinal: '' }}
      >
        <ConsultaAcervoContextProvider>
          <div style={{ position: 'sticky', top: 0, zIndex: 5 }}>
            <FiltroConsultaAcervo />
            <StickyButtonEnviar />
          </div>
          <Outlet />
        </ConsultaAcervoContextProvider>
      </Form>
    </>
  );
};
