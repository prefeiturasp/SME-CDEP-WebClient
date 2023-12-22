import { Button, Form, FormItemProps, Row, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import FormCadastrosAuxiliares from '~/components/cdep/cadastros/auxiliares/form';
import Select from '~/components/lib/inputs/select';
import { paramsConfigPageFormAutor } from '~/core/constants/config-page-cadastros-auxiliares';
import { CDEP_SELECT_AUTOR } from '~/core/constants/ids/select';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { TipoCreditoAutoria } from '~/core/enum/tipo-credito-autoria';
import { obterCreditoAutorResumido } from '~/core/services/credito-autor-service';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.Autor];

type SelectAutorProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
  tipoAcervo: TipoAcervo;
};
const SelectAutor: React.FC<SelectAutorProps> = ({ selectProps, formItemProps, tipoAcervo }) => {
  const [required, setRequired] = useState<boolean>(false);
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const [openModal, setOpenModal] = useState(false);

  const obterDados = async () => {
    const resposta = await obterCreditoAutorResumido(TipoCreditoAutoria.Autoria);

    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({ label: item.nome, value: item.id }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  const validarCampoObrigatorio = () => {
    switch (tipoAcervo) {
      case TipoAcervo.Bibliografico:
        setRequired(true);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    obterDados();
    validarCampoObrigatorio();
  }, []);

  const validarAoFecharModal = (open: boolean, updateData?: boolean) => {
    setOpenModal(open);
    if (updateData) obterDados();
  };

  return (
    <Row wrap={false} align='middle'>
      <Form.Item
        label={fieldProps.label}
        name={fieldProps.name}
        style={{ width: '100%', marginRight: '8px' }}
        rules={[{ required }]}
        {...formItemProps}
      >
        <Select
          showSearch
          allowClear
          mode='multiple'
          id={CDEP_SELECT_AUTOR}
          {...selectProps}
          options={options}
          placeholder={fieldProps.label}
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
          {...paramsConfigPageFormAutor}
          isModal
          title='Cadastrar Autor'
          setOpenModal={validarAoFecharModal}
        />
      )}
    </Row>
  );
};

export default SelectAutor;
