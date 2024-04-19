import { Form, FormItemProps, Row, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useContext, useEffect, useState } from 'react';
import FormCadastrosAuxiliares from '~/components/cdep/cadastros/auxiliares/form';
import Select from '~/components/lib/inputs/select';
import { paramsConfigPageFormSerieColecao } from '~/core/constants/config-page-cadastros-auxiliares';
import { CDEP_SELECT_SERIE_COLECAO } from '~/core/constants/ids/select';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { MenuEnum } from '~/core/enum/menu-enum';
import { obterSerieColecaoResumido } from '~/core/services/serie-colecao-service';
import { obterPermissaoPorMenu } from '~/core/utils/perfil';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { ButtonAdicionar } from '../components/btn-add';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.SerieColecao];

type SelectSerieColecaoProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};
const SelectSerieColecao: React.FC<SelectSerieColecaoProps> = ({ selectProps, formItemProps }) => {
  const { desabilitarCampos } = useContext(PermissaoContext);

  const permissao = obterPermissaoPorMenu(MenuEnum.SerieColecao);

  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const [openModal, setOpenModal] = useState(false);

  const obterDados = async () => {
    const resposta = await obterSerieColecaoResumido();

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
          style={{ width: '100%', marginRight: '8px' }}
          {...formItemProps}
          extra={undefined}
        >
          <Select
            showSearch
            allowClear
            id={CDEP_SELECT_SERIE_COLECAO}
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
            {...paramsConfigPageFormSerieColecao}
            isModal
            title='Cadastrar Série/Coleção'
            setOpenModal={validarAoFecharModal}
          />
        )}
      </Row>
      {formItemProps?.extra}
    </>
  );
};

export default SelectSerieColecao;
