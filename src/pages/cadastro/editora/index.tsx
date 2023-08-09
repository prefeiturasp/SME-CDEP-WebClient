import { Button, Col, Row } from 'antd';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonVoltar from '~/components/cdep/button/voltar';
import HeaderPage from '~/components/lib/header-page';
import { CDEP_BUTTON_CADASTRAR, CDEP_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { ROUTES } from '~/core/enum/routes';
import { useAppDispatch } from '~/core/hooks/use-redux';
import { setSpinning } from '~/core/redux/modules/spin/actions';

const Editora: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);

  const obterDados = useCallback(() => {
    dispatch(setSpinning(false));
  }, [dispatch]);

  useEffect(() => {
    obterDados();
  }, [obterDados]);

  return (
    <>
      <HeaderPage title='Editora'>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <ButtonVoltar onClick={() => onClickVoltar()} id={CDEP_BUTTON_VOLTAR} />
            </Col>
            <Col>
              <Button
                block
                type='primary'
                htmlType='submit'
                id={CDEP_BUTTON_CADASTRAR}
                style={{ fontWeight: 700 }}
              >
                Novo
              </Button>
            </Col>
          </Row>
        </Col>
      </HeaderPage>
    </>
  );
};

export default Editora;
