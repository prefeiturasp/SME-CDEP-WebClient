import { Col, Row, Input, Form, Button } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useNavigate } from 'react-router-dom';
import ButtonVoltar from '~/components/cdep/button/voltar';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import {
  CDEP_BUTTON_VOLTAR,
  CDEP_BUTTON_CANCELAR,
  CDEP_BUTTON_NOVO,
} from '~/core/constants/ids/button/intex';
import { CDEP_INPUT_NOVO } from '~/core/constants/ids/input';
import { ROUTES } from '~/core/enum/routes';
import { useAppDispatch } from '~/core/hooks/use-redux';
import { setSpinning } from '~/core/redux/modules/spin/actions';
import PropTypes from 'prop-types';
type FormularioNovoProps = {
  rotaVoltar: ROUTES;
  rotaCancelar: ROUTES;
  titulo: string;
};

const FormularioNovo: React.FC<FormularioNovoProps> = ({ rotaVoltar, rotaCancelar, titulo }) => {
  const navigate = useNavigate();
  const [form] = useForm();
  const dispatch = useAppDispatch();

  const onClickVoltar = () => navigate(rotaVoltar);
  const onClickCancelar = () => {
    navigate(rotaCancelar);

    //OpenModal De Confirmação
  };
  const validateMessages = {
    required: 'Campo obrigatório',
    string: {
      range: 'Por favor, digite Nome',
    },
  };
  const onFinish = (values: string) => {
    dispatch(setSpinning(true));
    console.log(values);
    dispatch(setSpinning(false));
  };
  return (
    <>
      <Col>
        <Form
          form={form}
          layout='vertical'
          autoComplete='off'
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <HeaderPage title={titulo}>
            <Col span={24}>
              <Row gutter={[8, 8]}>
                <Col>
                  <ButtonVoltar onClick={() => onClickVoltar()} id={CDEP_BUTTON_VOLTAR} />
                </Col>
                <Col>
                  <Button
                    block
                    type='default'
                    id={CDEP_BUTTON_CANCELAR}
                    onClick={onClickCancelar}
                    style={{ fontWeight: 700 }}
                  >
                    Cancelar
                  </Button>
                </Col>
                <Col>
                  <Button
                    block
                    type='primary'
                    htmlType='submit'
                    id={CDEP_BUTTON_NOVO}
                    style={{ fontWeight: 700 }}
                  >
                    Salvar
                  </Button>
                </Col>
              </Row>
            </Col>
          </HeaderPage>
          <CardContent>
            <Form.Item
              label='Nome'
              name='nome'
              rules={[{ required: true }]}
              style={{ fontWeight: 700 }}
            >
              <Input
                type='text'
                placeholder='Informe o Nome'
                maxLength={200}
                showCount
                id={CDEP_INPUT_NOVO}
              />
            </Form.Item>
          </CardContent>
        </Form>
      </Col>
    </>
  );
};
FormularioNovo.propTypes = {
  rotaCancelar: PropTypes.any.isRequired,
  rotaVoltar: PropTypes.any.isRequired,
  titulo: PropTypes.string.isRequired,
};
export default FormularioNovo;
