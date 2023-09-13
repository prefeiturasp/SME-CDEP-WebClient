import { Button, Form, FormItemProps, Row, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import FormCadastrosAuxiliares from '~/components/cdep/cadastros/auxiliares/form';
import Select from '~/components/lib/inputs/select';
import { CDEP_SELECT_CREDITO } from '~/core/constants/ids/select';
import { INPUTS_NAMES } from '~/core/constants/inputs-cadastros';
import { FormCadastrosAuxiliaresProps } from '~/core/dto/form-cadastros-auxiliares';
import { ROUTES } from '~/core/enum/routes';
import { TipoCreditoAutoria } from '~/core/enum/tipo-credito-autoria';
import { URL_API_CREDITO_AUTOR, obterCreditoAutorResumido } from '~/core/services/credito-autor';

type SelectCreditoProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectCredito: React.FC<SelectCreditoProps> = ({ selectProps, formItemProps }) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const [openModal, setOpenModal] = useState(false);

  const obterDados = async () => {
    const resposta = await obterCreditoAutorResumido(TipoCreditoAutoria.Credito);

    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({ label: item.nome, value: item.id }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    obterDados();
  }, []);

  const paramsConfigPage: FormCadastrosAuxiliaresProps = {
    page: {
      title: 'Crédito',
      urlMainPage: ROUTES.CREDITO,
      urlBase: URL_API_CREDITO_AUTOR,
      inputs: [
        {
          name: INPUTS_NAMES.TEXT.NOME,
          placeholder: 'Informe o nome do crédito',
        },
      ],
    },
    initialValues: { tipo: TipoCreditoAutoria.Credito },
  };

  const validarAoFecharModal = (open: boolean, updateData?: boolean) => {
    setOpenModal(open);
    if (updateData) obterDados();
  };

  return (
    <Row wrap={false} align='middle'>
      <Form.Item
        label='Crédito'
        name='creditoAutorId'
        rules={[{ required: true }]}
        style={{ width: '100%', marginRight: '8px' }}
        {...formItemProps}
      >
        <Select
          showSearch
          allowClear
          id={CDEP_SELECT_CREDITO}
          {...selectProps}
          options={options}
          placeholder='Crédito'
        />
      </Form.Item>
      <Button
        type='default'
        block
        icon={<FaPlus />}
        onClick={() => setOpenModal(true)}
        style={{
          fontSize: 16,
          width: '43px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
      {openModal && (
        <FormCadastrosAuxiliares
          {...paramsConfigPage}
          isModal
          setOpenModal={validarAoFecharModal}
        />
      )}
    </Row>
  );
};

export default SelectCredito;
