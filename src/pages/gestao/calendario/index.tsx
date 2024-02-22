import { Col } from 'antd';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';

export const Calendario = () => {
  return (
    <Col>
      <HeaderPage title='Calendário de visitas' />
      <CardContent>Calendário</CardContent>
    </Col>
  );
};
