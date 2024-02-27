import { Form, FormItemProps, Row } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import FormCadastrosAuxiliares from '~/components/cdep/cadastros/auxiliares/form';
import Select from '~/components/lib/inputs/select';
import { paramsConfigPageFormIdioma } from '~/core/constants/config-page-cadastros-auxiliares';
import { CDEP_SELECT_IDIOMA } from '~/core/constants/ids/select';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { obterIdioma } from '~/core/services/idioma-service';
import { ButtonAdicionar } from '../components/btn-add';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.Idioma];

type SelectIdiomaProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectIdioma: React.FC<SelectIdiomaProps> = ({ selectProps, formItemProps }) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const obterDados = async () => {
    const resposta = await obterIdioma();

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
    <>
      <Row wrap={false}>
        <Form.Item
          label={fieldProps.label}
          name={fieldProps.name}
          rules={[{ required: true }]}
          style={{ width: '100%', marginRight: '8px' }}
          {...formItemProps}
          extra={undefined}
        >
          <Select
            showSearch
            allowClear
            id={CDEP_SELECT_IDIOMA}
            {...selectProps}
            options={options}
            placeholder={fieldProps.label}
          />
        </Form.Item>
        <ButtonAdicionar onClick={() => setOpenModal(true)} />
        {openModal && (
          <FormCadastrosAuxiliares
            {...paramsConfigPageFormIdioma}
            isModal
            title='Cadastrar Idioma'
            maxLength={15}
            setOpenModal={validarAoFecharModal}
          />
        )}
      </Row>
      {formItemProps?.extra}
    </>
  );
};

export default SelectIdioma;
