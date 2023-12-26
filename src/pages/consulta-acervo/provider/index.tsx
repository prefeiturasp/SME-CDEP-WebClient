/* eslint-disable @typescript-eslint/no-empty-function */
import { FormInstance } from 'antd';
import { PaginationConfig } from 'antd/es/pagination';
import React, { PropsWithChildren, createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiltroTextoLivreTipoAcervoDTO } from '~/core/dto/filtro-texto-livre-tipo-acervo-dto';
import { PesquisaAcervoDTO } from '~/core/dto/pesquisa-acervo-dto';
import { ROUTES } from '~/core/enum/routes';
import { pesquisarAcervosAreaPublica } from '~/core/services/acervo-service';

type ConsultaAcervoContextProps = {
  dataSource: PesquisaAcervoDTO[];
  setDataSource?: React.Dispatch<React.SetStateAction<PesquisaAcervoDTO[]>>;
  loading: boolean;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  listParams: PaginationConfig;
  setListParams?: React.Dispatch<React.SetStateAction<PaginationConfig>>;
  carregarDados: (listParams: PaginationConfig, params: FiltroTextoLivreTipoAcervoDTO) => void;
  onClickBuscar: (form: FormInstance) => void;
  limparDados: (form: FormInstance) => void;
};

const DEFAULT_VALUES: ConsultaAcervoContextProps = {
  dataSource: [],
  loading: false,
  listParams: {
    current: 1,
    pageSize: 5,
    showSizeChanger: true,
    hideOnSinglePage: true,
    defaultCurrent: 1,
    position: 'bottom',
    align: 'center',
    locale: { items_per_page: '' },
    disabled: false,
    pageSizeOptions: [5, 10, 20, 50, 100],
  },
  carregarDados: () => {},
  onClickBuscar: () => {},
  limparDados: () => {},
};

export const ConsultaAcervoContext = createContext<ConsultaAcervoContextProps>(DEFAULT_VALUES);

const ConsultaAcervoContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();

  const [dataSource, setDataSource] = useState<PesquisaAcervoDTO[]>(DEFAULT_VALUES.dataSource);
  const [loading, setLoading] = useState<boolean>(DEFAULT_VALUES.loading);

  const [listParams, setListParams] = useState<PaginationConfig>(DEFAULT_VALUES.listParams);

  const limparDados = (form: FormInstance) => {
    form.resetFields();
    setDataSource(DEFAULT_VALUES.dataSource);
    setListParams(DEFAULT_VALUES.listParams);
  };

  const carregarDados = (listParams: PaginationConfig, params: FiltroTextoLivreTipoAcervoDTO) => {
    const numeroPagina = listParams?.current || 1;
    const numeroRegistros = listParams?.pageSize || 5;

    navigate(ROUTES.CONSULTA_ACERVO);

    setLoading(true);
    pesquisarAcervosAreaPublica(numeroPagina, numeroRegistros, params)
      .then((response) => {
        if (response.sucesso) {
          setDataSource(response.dados.items);

          setListParams({
            ...listParams,
            total: response.dados.totalRegistros,
          });
        } else {
          setDataSource([]);
        }
      })
      .finally(() => setLoading(false));
  };

  const onClickBuscar = (form: FormInstance) => {
    form.validateFields().then((values: FiltroTextoLivreTipoAcervoDTO) => {
      const filtroConsulta = { ...values };
      carregarDados({ ...listParams, current: 1 }, filtroConsulta);
    });
  };

  return (
    <ConsultaAcervoContext.Provider
      value={{
        dataSource,
        setDataSource,
        loading,
        setLoading,
        listParams,
        carregarDados,
        onClickBuscar,
        limparDados,
      }}
    >
      {children}
    </ConsultaAcervoContext.Provider>
  );
};

export default ConsultaAcervoContextProvider;
