import { Form, FormItemProps, Row, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useContext, useEffect, useState } from 'react';
import FormCadastrosAuxiliares from '~/components/cdep/cadastros/auxiliares/form';
import Select from '~/components/lib/inputs/select';
import { paramsConfigPageFormAutor } from '~/core/constants/config-page-cadastros-auxiliares';
import { CDEP_SELECT_AUTOR } from '~/core/constants/ids/select';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { MenuEnum } from '~/core/enum/menu-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { TipoCreditoAutoria } from '~/core/enum/tipo-credito-autoria';
import { obterCreditoAutorResumido } from '~/core/services/credito-autor-service';
import { obterPermissaoPorMenu } from '~/core/utils/perfil';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { ButtonAdicionar } from '../components/btn-add';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.Autor];

type SelectAutorProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
  tipoAcervo: TipoAcervo;
};
const SelectAutor: React.FC<SelectAutorProps> = ({ selectProps, formItemProps, tipoAcervo }) => {
  const { desabilitarCampos } = useContext(PermissaoContext);

  const permissao = obterPermissaoPorMenu(MenuEnum.Autor);

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
            id={CDEP_SELECT_AUTOR}
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
            {...paramsConfigPageFormAutor}
            isModal
            title='Cadastrar Autor'
            setOpenModal={validarAoFecharModal}
          />
        )}
      </Row>
      {formItemProps?.extra}
    </>
  );
};

export default SelectAutor;
