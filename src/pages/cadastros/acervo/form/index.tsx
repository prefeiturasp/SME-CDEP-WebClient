import { Col, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useNavigate, useParams } from 'react-router-dom';
import ButtonVoltar from '~/components/cdep/button/voltar';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import { CDEP_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { ROUTES } from '~/core/enum/routes';

const FormAcervo: React.FC = () => {
  const navigate = useNavigate();
  const paramsRoute = useParams();
  const [form] = useForm();

  const id = paramsRoute?.id || 0;
  const title = id ? 'Editar Acervo' : 'Novo Acervo';

  const onFinish = (values: any) => {
    console.log(values);
  };

  const onClickVoltar = () => {
    navigate(ROUTES.ACERVO);
  };

  return (
    <Col>
      <Form form={form} layout='vertical' autoComplete='off' onFinish={onFinish}>
        <HeaderPage title={title}>
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col>
                <ButtonVoltar onClick={() => onClickVoltar()} id={CDEP_BUTTON_VOLTAR} />
              </Col>
            </Row>
          </Col>
        </HeaderPage>

        <CardContent>Form</CardContent>
      </Form>
    </Col>
  );
};

export default FormAcervo;
