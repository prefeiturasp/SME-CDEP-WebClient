import { Button, Form, FormItemProps, Row, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useContext, useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import FormCadastrosAuxiliares from '~/components/cdep/cadastros/auxiliares/form';
import Select from '~/components/lib/inputs/select';
import { paramsConfigPageFormCredito } from '~/core/constants/config-page-cadastros-auxiliares';
import { CDEP_SELECT_CREDITO } from '~/core/constants/ids/select';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { MenuEnum } from '~/core/enum/menu-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { TipoCreditoAutoria } from '~/core/enum/tipo-credito-autoria';
import { obterCreditoAutorResumido } from '~/core/services/credito-autor-service';
import { obterPermissaoPorMenu } from '~/core/utils/perfil';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.Credito];

type SelectCreditoProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
  tipoAcervo?: TipoAcervo;
};

const SelectCredito: React.FC<SelectCreditoProps> = ({
  selectProps,
  formItemProps,
  tipoAcervo,
}) => {
  const { desabilitarCampos } = useContext(PermissaoContext);

  const permissao = obterPermissaoPorMenu(MenuEnum.Credito);

  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const [required, setRequired] = useState<boolean>(true);
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

  const validarCampoObrigatorio = () => {
    switch (tipoAcervo) {
      case TipoAcervo.ArtesGraficas:
      case TipoAcervo.Audiovisual:
        setRequired(false);
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
        style={{ width: '100%', marginRight: '8px' }}
        {...formItemProps}
      >
        <Select
          showSearch
          allowClear
          mode='multiple'
          id={CDEP_SELECT_CREDITO}
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
        disabled={!permissao.podeIncluir || desabilitarCampos}
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
          {...paramsConfigPageFormCredito}
          isModal
          title='Cadastrar Crédito'
          maxLength={200}
          setOpenModal={validarAoFecharModal}
        />
      )}
    </Row>
  );
};

export default SelectCredito;
