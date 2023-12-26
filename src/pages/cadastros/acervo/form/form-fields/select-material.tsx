import { Button, Form, FormItemProps, Row } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import FormCadastrosAuxiliares from '~/components/cdep/cadastros/auxiliares/form';
import Select from '~/components/lib/inputs/select';
import { paramsConfigPageFormMaterial } from '~/core/constants/config-page-cadastros-auxiliares';
import { CDEP_SELECT_MATERIAL } from '~/core/constants/ids/select';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { TipoMaterial } from '~/core/enum/tipo-material-enum';
import { obterMaterial } from '~/core/services/material-service';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.Material];

type SelectMaterialProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
  tipoAcervo: TipoAcervo;
};
const SelectMaterial: React.FC<SelectMaterialProps> = ({
  selectProps,
  formItemProps,
  tipoAcervo,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [required, setRequired] = useState<boolean>(false);
  const [habilitaBotaoAdicionar, setHabilitaBotaoAdicionar] = useState(true);
  const [tipo, setTipo] = useState(TipoMaterial.NAO_DEFINIDO);

  const obterDados = async () => {
    let tipoMaterial = tipo;

    switch (tipoAcervo) {
      case TipoAcervo.Bibliografico:
        setHabilitaBotaoAdicionar(false);
        tipoMaterial = TipoMaterial.BIBLIOGRAFICO;
        break;
      case TipoAcervo.DocumentacaoHistorica:
        tipoMaterial = TipoMaterial.DOCUMENTAL;
        break;
      default:
        break;
    }

    setTipo(tipoMaterial);

    const resposta = await obterMaterial(tipoMaterial);

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
        rules={[{ required }]}
        style={{ width: '100%', marginRight: habilitaBotaoAdicionar ? '8px' : '' }}
        {...formItemProps}
      >
        <Select
          showSearch
          allowClear
          id={CDEP_SELECT_MATERIAL}
          {...selectProps}
          options={options}
          placeholder={fieldProps.label}
        />
      </Form.Item>
      {habilitaBotaoAdicionar && (
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
      )}
      {openModal && (
        <FormCadastrosAuxiliares
          {...paramsConfigPageFormMaterial}
          initialValues={{ tipo }}
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
