import { Form, FormItemProps, Row, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useContext, useEffect, useState } from 'react';
import FormCadastrosAuxiliares from '~/components/cdep/cadastros/auxiliares/form';
import Select from '~/components/lib/inputs/select';
import { paramsConfigPageFormAssunto } from '~/core/constants/config-page-cadastros-auxiliares';
import { CDEP_SELECT_ASSUNTO } from '~/core/constants/ids/select';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { MenuEnum } from '~/core/enum/menu-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { obterAssuntoResumido } from '~/core/services/assunto-service';
import { obterPermissaoPorMenu } from '~/core/utils/perfil';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { ButtonAdicionar } from '../components/btn-add';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.Assunto];

type SelectAutorProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
  tipoAcervo: TipoAcervo;
};
const SelectAssunto: React.FC<SelectAutorProps> = ({ selectProps, formItemProps, tipoAcervo }) => {
  const { desabilitarCampos } = useContext(PermissaoContext);

  const permissao = obterPermissaoPorMenu(MenuEnum.Assunto);

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
    <>
      <Row wrap={false}>
        <Form.Item
          label={fieldProps.label}
          name={fieldProps.name}
          style={{ width: '100%', marginRight: '8px' }}
          rules={[{ required }]}
          {...formItemProps}
          extra={undefined}
        >
          <Select
            showSearch
            allowClear
            mode='multiple'
            id={CDEP_SELECT_ASSUNTO}
            {...selectProps}
            options={options}
            placeholder={fieldProps.label}
          />
        </Form.Item>
        <ButtonAdicionar
          onClick={() => setOpenModal(true)}
          disabled={!permissao.podeIncluir || desabilitarCampos}
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
      {formItemProps?.extra}
    </>
  );
};

export default SelectAssunto;
