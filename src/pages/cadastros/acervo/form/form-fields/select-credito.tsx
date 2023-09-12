import { Button, Form, FormItemProps, Row, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CDEP_SELECT_CREDITO } from '~/core/constants/ids/select';
import { TipoCreditoAutoria } from '~/core/enum/tipo-credito-autoria';
import { obterCreditoAutorResumido } from '~/core/services/credito-autor';
import ModalEditTelefone from '~/pages/meus-dados/components/modal-edit-telefone/modal-edit-telefone';

type SelectCreditoProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectCredito: React.FC<SelectCreditoProps> = ({ selectProps, formItemProps }) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const [open, setOpen] = useState(false);

  const showModal = () => setOpen(true);

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
      <Button onClick={showModal}>Alterar</Button>
      {open && (
        <ModalEditTelefone
          updateFields={() => null}
          initialValues={{ telefone: '' }}
          closeModal={() => setOpen(false)}
        />
      )}
    </Row>
  );
};

export default SelectCredito;
