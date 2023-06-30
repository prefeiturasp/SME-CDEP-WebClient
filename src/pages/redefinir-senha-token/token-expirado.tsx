import { Button, Result, Row } from 'antd';

import { useNavigate } from 'react-router-dom';
import { CDEP_BUTTON_ESQUECI_SENHA } from '~/core/constants/ids/button/intex';
import { ROUTES } from '~/core/enum/routes';

const TokenExpirado = () => {
  const navigate = useNavigate();

  const onClickEsqueciSenha = () => navigate(ROUTES.REDEFINIR_SENHA);

  return (
    <Result
      status='error'
      title='Redefinição de Senha'
      subTitle='Este link expirou, utilize a opção "Esqueci minha senha" para solicitar um novo link.'
      extra={[
        <Row justify='center' key='ROW_VOLTAR'>
          <Button
            type='text'
            block
            style={{ fontSize: 12 }}
            onClick={() => onClickEsqueciSenha()}
            id={CDEP_BUTTON_ESQUECI_SENHA}
          >
            Esqueci minha senha
          </Button>
        </Row>,
      ]}
    />
  );
};

export default TokenExpirado;
