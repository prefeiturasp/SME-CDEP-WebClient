import { Button, Col, Row, Typography } from 'antd';

import { useNavigate } from 'react-router-dom';
import { CDEP_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { ROUTES } from '~/core/enum/routes';

const TokenExpirado = () => {
  const navigate = useNavigate();

  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);

  return (
    <Col span={14}>
      <Row justify='center' gutter={[0, 30]}>
        <Col span={24}>
          <Typography.Text strong style={{ fontSize: 24 }}>
            Redefinição de Senha
          </Typography.Text>
        </Col>
        <Col span={24}>
          <Typography.Text style={{ fontSize: 14 }}>
            {`Este link expirou, utilize a opção "Esqueci minha senha" para solicitar um novo link.`}
          </Typography.Text>
        </Col>
        <Col span={24}>
          <Button
            type='default'
            block
            style={{ fontWeight: 700 }}
            onClick={() => onClickVoltar()}
            id={CDEP_BUTTON_VOLTAR}
          >
            Voltar
          </Button>
        </Col>
      </Row>
    </Col>
  );
};

export default TokenExpirado;
