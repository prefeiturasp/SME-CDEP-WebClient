import { Table } from 'antd';
import { TablePaginationConfig, TableProps } from 'antd/es/table';
import { AxiosError } from 'axios';
import queryString from 'query-string';
import { useCallback, useContext, useEffect, useState } from 'react';
import ButtonOrdenacao from '~/components/cdep/button/ordenacao';
import { PaginacaoResultadoDTO } from '~/core/dto/paginacao-resultado-dto';
import { RetornoBaseDTO } from '~/core/dto/retorno-base-dto';
import { TipoOrdenacaoEnum } from '~/core/enum/tipo-ordenacao';
import api from '~/core/services/api';
import { scrollNoInicio } from '~/core/utils/functions';
import { openNotificationErrors } from '../notification';
import { DataTableContext } from './provider';

interface TableParams {
  pagination?: TablePaginationConfig;
  order?: TipoOrdenacaoEnum;
}

type DataTableProps<T> = {
  filters?: any;
  url?: string;
  showOrderButton?: boolean;
} & TableProps<T>;

const DataTable = <T extends object>({
  filters,
  url,
  columns,
  showOrderButton = true,
  ...rest
}: DataTableProps<T>) => {
  const { setTableState } = useContext(DataTableContext);

  const [data, setData] = useState<T[]>();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      locale: { items_per_page: '' },
      disabled: false,
      pageSizeOptions: [10, 20, 50, 100],
      position: ['bottomCenter'],
    },
    order: TipoOrdenacaoEnum.DATA,
  });

  const fetchData = useCallback(
    (newParams: TableParams) => {
      if (!url) return;

      setLoading(true);
      let urlQuery = '';

      if (url.includes('?')) {
        urlQuery = `${url}&`;
      } else {
        urlQuery = `${url}?`;
      }

      urlQuery = `${urlQuery}numeroPagina=${newParams?.pagination?.current}&numeroRegistros=${newParams?.pagination?.pageSize}&ordenacao=${newParams.order}`;

      api
        .get<PaginacaoResultadoDTO<T[]>>(urlQuery, {
          params: filters,
          paramsSerializer: {
            serialize: (params) => {
              return queryString.stringify(params, {
                arrayFormat: 'bracket',
                skipEmptyString: true,
                skipNull: true,
              });
            },
          },
        })
        .then((response) => {
          if (response?.data.items) {
            setData(response.data.items);
            setTableParams({
              ...newParams,
              pagination: {
                ...newParams.pagination,
                total: response.data.totalRegistros,
              },
            });
          }
        })
        .catch((error: AxiosError<RetornoBaseDTO>) => {
          const mensagens = error?.response?.data?.mensagens?.length
            ? error?.response?.data?.mensagens
            : [];

          openNotificationErrors(mensagens);
        })
        .finally(() => setLoading(false));
    },
    [url, filters],
  );

  useEffect(() => {
    fetchData(tableParams);
    setTableState({
      reloadData: () => {
        fetchData(tableParams);
      },
    });
  }, [JSON.stringify(filters), fetchData]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const newParams = {
      ...tableParams,
      pagination,
    };

    setTableParams(newParams);

    fetchData(newParams);

    if (pagination.pageSize !== newParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const handleTableChangeDefaultTable = (pagination: TablePaginationConfig) => {
    const newParams = {
      ...tableParams,
      pagination,
    };

    setTableParams(newParams);
  };

  const onClickOrdenar = (ordenacaoNova: TipoOrdenacaoEnum) => {
    const newParams = {
      ...tableParams,
      order: ordenacaoNova,
    };

    setTableParams(newParams);

    fetchData(newParams);
  };

  useEffect(() => {
    scrollNoInicio();
  }, [tableParams.pagination?.current, !tableParams.pagination?.pageSize]);

  return (
    <>
      {showOrderButton && <ButtonOrdenacao onClick={onClickOrdenar} />}
      <Table
        columns={columns}
        rowKey='id'
        pagination={tableParams.pagination}
        loading={loading}
        onChange={url ? handleTableChange : handleTableChangeDefaultTable}
        bordered
        locale={{ emptyText: 'Sem dados' }}
        size='small'
        {...rest}
        dataSource={url ? data : rest.dataSource}
      />
    </>
  );
};

export default DataTable;
