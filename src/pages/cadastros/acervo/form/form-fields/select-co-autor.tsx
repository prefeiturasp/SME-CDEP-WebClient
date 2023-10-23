import { Button, Form, FormItemProps, Row, SelectProps, Space } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import FormCadastrosAuxiliares from '~/components/cdep/cadastros/auxiliares/form';
import Select from '~/components/lib/inputs/select';
import { paramsConfigPageFormAutor } from '~/core/constants/config-page-cadastros-auxiliares';
import { CDEP_SELECT_COAUTOR } from '~/core/constants/ids/select';
import { TipoCreditoAutoria } from '~/core/enum/tipo-credito-autoria';
import { obterCreditoAutorResumido } from '~/core/services/credito-autor-service';
import InputTipoAutoria from './input-tipo-autoria';

type SelectCoautorProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectCoautor: React.FC<SelectCoautorProps> = ({ selectProps, formItemProps }) => {
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
        const registrosIds = form.getFieldValue('creditosCoautoresIds');

        const registrosNomes = options
          .filter((option: any) => registrosIds?.includes(option.value) && option.label)
          .map((item) => item.label);

        return (
          <>
            <Row wrap={false} align='middle'>
              <Form.Item
                label='Coautor'
                name='creditosCoautoresIds'
                style={{ width: '100%', marginRight: '8px' }}
                {...formItemProps}
                shouldUpdate
              >
                <Select
                  showSearch
                  allowClear
                  mode='multiple'
                  id={CDEP_SELECT_COAUTOR}
                  {...selectProps}
                  options={options}
                  placeholder='Coautor'
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
            </Row>
            {openModal && (
              <FormCadastrosAuxiliares
                {...paramsConfigPageFormAutor}
                isModal
                title='Cadastrar Coautor'
                setOpenModal={validarAoFecharModal}
              />
            )}
            {registrosIds?.length ? (
              <Space size={16} wrap>
                {registrosIds.map((item: any, index: number) => {
                  return (
                    <InputTipoAutoria
                      key={item}
                      formItemProps={{ label: `Tipo de autoria - ${registrosNomes[index]}` }}
                    />
                  );
                })}
              </Space>
            ) : (
              ''
            )}
          </>
        );
      }}
    </Form.Item>
  );
};

export default SelectCoautor;
