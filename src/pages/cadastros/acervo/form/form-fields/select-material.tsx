import { Button, Form, FormItemProps, Row } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import FormCadastrosAuxiliares from '~/components/cdep/cadastros/auxiliares/form';
import Select from '~/components/lib/inputs/select';
import { paramsConfigPageFormMaterial } from '~/core/constants/config-page-cadastros-auxiliares';
import { CDEP_SELECT_MATERIAL } from '~/core/constants/ids/select';
import { obterMaterial } from '~/core/services/acervo-documentacao-historica-service';

type SelectMaterialProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectMaterial: React.FC<SelectMaterialProps> = ({ selectProps, formItemProps }) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const obterDados = async () => {
    const resposta = await obterMaterial();

    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({
        label: item.nome,
        value: item.id,
      }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    obterDados();
  }, []);

  const validarAoFecharModal = (open: boolean, updateData?: boolean) => {
    setOpenModal(open);
    if (updateData) obterDados();
  };

  return (
    <Row wrap={false} align='middle'>
      <Form.Item
        label='Material'
        name='materiaisIds'
        style={{ width: '100%', marginRight: '8px' }}
        {...formItemProps}
      >
        <Select
          showSearch
          allowClear
          mode='multiple'
          id={CDEP_SELECT_MATERIAL}
          {...selectProps}
          options={options}
          placeholder='Material'
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
          {...paramsConfigPageFormMaterial}
          isModal
          title='Cadastrar Material'
          maxLength={15}
          setOpenModal={validarAoFecharModal}
        />
      )}
    </Row>
  );
};

export default SelectMaterial;
