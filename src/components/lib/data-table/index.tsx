import { useEffect, useState } from 'react';

import { Table } from 'antd';
import type { TablePaginationConfig, TableProps } from 'antd/es/table';
import queryString from 'query-string';
import { PaginacaoResultadoDTO } from '~/core/dto/paginacao-resultado-dto';
import { TipoOrdenacaoEnum } from '~/core/enum/tipo-ordenacao';
import api from '~/core/services/api';
import ButtonOrdenacao from '~/components/cdep/button/ordenacao';

interface TableParams {
  pagination?: TablePaginationConfig;
  order?: TipoOrdenacaoEnum;
}

type DataTableProps<T> = {
  filters?: any;
  url: string;
} & TableProps<T>;

const DataTable = <T extends object>({ filters, url, columns, ...rest }: DataTableProps<T>) => {
  const [data, setData] = useState<T[]>();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    order: TipoOrdenacaoEnum.DATA,
  });

  const fetchData = () => {
    setLoading(true);
    const urlQuery = `${url}?numeroPagina=${tableParams?.pagination?.current}&numeroRegistros=${tableParams?.pagination?.pageSize}&ordenacao=${tableParams.order}`;

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
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: response.data.totalRegistros,
            },
          });
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams), JSON.stringify(filters)]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setTableParams({
      ...tableParams,
      pagination,
    });

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const onClickOrdenar = (ordenacaoNova: TipoOrdenacaoEnum) => {
    setTableParams({
      ...tableParams,
      order: ordenacaoNova,
    });
  };

  return (
    <>
      <ButtonOrdenacao onClick={onClickOrdenar} />
      <Table
        columns={columns}
        rowKey='id'
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        bordered
        locale={{ emptyText: 'Sem dados' }}
        size='small'
        {...rest}
      />
    </>
  );
};

export default DataTable;
