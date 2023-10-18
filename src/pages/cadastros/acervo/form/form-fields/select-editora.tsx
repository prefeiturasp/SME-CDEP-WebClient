import { Button, Form, FormItemProps, Row, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import FormCadastrosAuxiliares from '~/components/cdep/cadastros/auxiliares/form';
import Select from '~/components/lib/inputs/select';
import { paramsConfigPageFormEditora } from '~/core/constants/config-page-cadastros-auxiliares';
import { CDEP_SELECT_EDITORA } from '~/core/constants/ids/select';
import { obterEditora } from '~/core/services/editora-service';

type SelectEditoraProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectEditora: React.FC<SelectEditoraProps> = ({ selectProps, formItemProps }) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const obterDados = async () => {
    const resposta = await obterEditora();

    if (resposta.sucesso) {
      const newOptions = resposta?.dados?.items?.map((item) => ({
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
        label='Editora'
        name='editora'
        style={{ width: '100%', marginRight: '8px' }}
        {...formItemProps}
      >
        <Select
          showSearch
          allowClear
          id={CDEP_SELECT_EDITORA}
          {...selectProps}
          options={options}
          placeholder='Editora'
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
          {...paramsConfigPageFormEditora}
          isModal
          title='Cadastrar Editora'
          maxLength={200}
          setOpenModal={validarAoFecharModal}
        />
      )}
    </Row>
  );
};

export default SelectEditora;
