import { Button, Form, FormItemProps, Row, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import FormCadastrosAuxiliares from '~/components/cdep/cadastros/auxiliares/form';
import Select from '~/components/lib/inputs/select';
import { paramsConfigPageFormAssunto } from '~/core/constants/config-page-cadastros-auxiliares';
import { CDEP_SELECT_ASSUNTO } from '~/core/constants/ids/select';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { obterAssuntoResumido } from '~/core/services/assunto-service';

type SelectAutorProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
  tipoAcervo: TipoAcervo;
};

const SelectAssunto: React.FC<SelectAutorProps> = ({ selectProps, formItemProps, tipoAcervo }) => {
  const [required, setRequired] = useState<boolean>(false);
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const [openModal, setOpenModal] = useState(false);

  const obterDados = async () => {
    const resposta = await obterAssuntoResumido();

    if (resposta.sucesso) {
      const newOptions = resposta?.dados?.map((item) => ({
        label: item.nome,
        value: item.id,
      }));
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
        label='Assunto'
        name={AcervoFieldName[FieldAcervoEnum.Assunto]}
        style={{ width: '100%', marginRight: '8px' }}
        rules={[{ required }]}
        {...formItemProps}
      >
        <Select
          showSearch
          allowClear
          mode='multiple'
          id={CDEP_SELECT_ASSUNTO}
          {...selectProps}
          options={options}
          placeholder='Assunto'
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
          {...paramsConfigPageFormAssunto}
          isModal
          title='Cadastrar Assunto'
          setOpenModal={validarAoFecharModal}
        />
      )}
    </Row>
  );
};

export default SelectAssunto;
