import { Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import cdepLogoHorizontal from '~/assets/cdep-logo-horizontal.svg';
import Header from '~/components/lib/header';
import { ListaCardsConsultaAcervo } from './lista-cards-consulta-acervo';

export const ConsultaAcervo = () => {
  const [form] = useForm();

  return (
    <>
      <Header
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
        <ListaCardsConsultaAcervo />
      </Form>
    </>
  );
};
