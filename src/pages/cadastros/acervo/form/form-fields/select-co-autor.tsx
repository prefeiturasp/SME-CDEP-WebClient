import { Form, FormItemProps, Row, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useContext, useEffect, useState } from 'react';
import FormCadastrosAuxiliares from '~/components/cdep/cadastros/auxiliares/form';
import Select from '~/components/lib/inputs/select';
import { paramsConfigPageFormAutor } from '~/core/constants/config-page-cadastros-auxiliares';
import { CDEP_SELECT_COAUTOR } from '~/core/constants/ids/select';
import { CoAutorDTO } from '~/core/dto/coautores-dto';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { MenuEnum } from '~/core/enum/menu-enum';
import { TipoCreditoAutoria } from '~/core/enum/tipo-credito-autoria';
import { obterCreditoAutorResumido } from '~/core/services/credito-autor-service';
import { obterPermissaoPorMenu } from '~/core/utils/perfil';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { ButtonAdicionar } from '../components/btn-add';
import InputTipoAutoriaLista from './input-tipo-autoria-lista';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.Coautor];

type SelectCoautorProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
  obterConteudoExtraPorCampo?: (nameFieldEnum: string) => React.ReactNode;
};

const SelectCoautor: React.FC<SelectCoautorProps> = ({
  selectProps,
  formItemProps,
  obterConteudoExtraPorCampo,
}) => {
  const { desabilitarCampos } = useContext(PermissaoContext);

  const permissao = obterPermissaoPorMenu(MenuEnum.Autor);

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

  useEffect(() => {
    obterDados();
  }, []);

  const validarAoFecharModal = (open: boolean, updateData?: boolean) => {
    setOpenModal(open);
    if (updateData) obterDados();
  };
  return (
    <Form.Item shouldUpdate style={{ margin: 0 }}>
      {(form) => {
        const listaTipoAutoria = form.getFieldValue('listaTipoAutoria');

        return (
          <>
            <Row wrap={false}>
              <Form.Item
                label={fieldProps.label}
                name={fieldProps.name}
                style={{ width: '100%', marginRight: '8px' }}
                {...formItemProps}
                shouldUpdate
                getValueFromEvent={(_, value) => value}
                extra={undefined}
              >
                <Select
                  showSearch
                  allowClear
                  labelInValue
                  mode='multiple'
                  {...selectProps}
                  options={options}
                  placeholder={fieldProps.label}
                  id={CDEP_SELECT_COAUTOR}
                  onChange={(value) => {
                    const novalistaTipoAutoria = value?.map((coAutor: CoAutorDTO) => {
                      const tipoAutoriaAtual = listaTipoAutoria?.find(
                        (item: any) => item.creditoAutorId === coAutor.value,
                      );

                      return {
                        creditoAutorId: coAutor?.value,
                        tipoAutoria: tipoAutoriaAtual?.tipoAutoria,
                      };
                    });

                    form.setFieldValue('listaTipoAutoria', novalistaTipoAutoria);
                  }}
                />
              </Form.Item>
              <ButtonAdicionar
                onClick={() => setOpenModal(true)}
                disabled={!permissao.podeIncluir || desabilitarCampos}
              />
            </Row>
            {formItemProps?.extra}
            {openModal && (
              <FormCadastrosAuxiliares
                {...paramsConfigPageFormAutor}
                isModal
                title='Cadastrar Coautor'
                setOpenModal={validarAoFecharModal}
              />
            )}
            <InputTipoAutoriaLista />
            {obterConteudoExtraPorCampo &&
              obterConteudoExtraPorCampo(PropsByFieldAcervoEnum[FieldAcervoEnum.TipoAutoria].name)}
          </>
        );
      }}
    </Form.Item>
  );
};

export default SelectCoautor;
