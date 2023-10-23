import { Button, Form, FormItemProps, Row, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import FormCadastrosAuxiliares from '~/components/cdep/cadastros/auxiliares/form';
import Select from '~/components/lib/inputs/select';
import { paramsConfigPageFormSerieColecao } from '~/core/constants/config-page-cadastros-auxiliares';
import { CDEP_SELECT_SERIE_COLECAO } from '~/core/constants/ids/select';
import { obterSerieColecaoResumido } from '~/core/services/serie-colecao-service';

type SelectSerieColecaoProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectSerieColecao: React.FC<SelectSerieColecaoProps> = ({ selectProps, formItemProps }) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const [openModal, setOpenModal] = useState(false);

  const obterDados = async () => {
    //TODO: depois que o Vini terminar o endpoint, ajustar endpoint para "/resumido"
    const resposta = await obterSerieColecaoResumido();

    if (resposta.sucesso) {
      const newOptions = resposta?.dados?.items?.map((item) => ({
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
    <Row wrap={false} align='middle'>
      <Form.Item
        label='Série/Coleção'
        name='serieColecaoIds'
        style={{ width: '100%', marginRight: '8px' }}
        {...formItemProps}
      >
        <Select
          showSearch
          allowClear
          id={CDEP_SELECT_SERIE_COLECAO}
          {...selectProps}
          options={options}
          placeholder='Série/Coleção'
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
          {...paramsConfigPageFormSerieColecao}
          isModal
          title='Cadastrar Série/Coleção'
          setOpenModal={validarAoFecharModal}
        />
      )}
    </Row>
  );
};

export default SelectSerieColecao;
