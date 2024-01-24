import { useEffect, useState } from 'react';

import { Table } from 'antd';
import type { TablePaginationConfig, TableProps } from 'antd/es/table';
import queryString from 'query-string';
import ButtonOrdenacao from '~/components/cdep/button/ordenacao';
import { PaginacaoResultadoDTO } from '~/core/dto/paginacao-resultado-dto';
import { TipoOrdenacaoEnum } from '~/core/enum/tipo-ordenacao';
import api from '~/core/services/api';

interface TableParams {
  pagination?: TablePaginationConfig;
  order?: TipoOrdenacaoEnum;
}

type DataTableProps<T> = {
  filters?: any;
  url: string;
  showOrderButton?: boolean;
} & TableProps<T>;

const DataTable = <T extends object>({
  filters,
  url,
  columns,
  showOrderButton = true,
  ...rest
}: DataTableProps<T>) => {
  const [data, setData] = useState<T[]>();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      locale: { items_per_page: '' },
      pageSizeOptions: [10, 20, 50, 100],
      position: ['bottomCenter'],
    },
    order: TipoOrdenacaoEnum.DATA,
  });

  const fetchData = (newParams: TableParams) => {
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
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData(tableParams);
  }, [JSON.stringify(filters)]);

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

  const onClickOrdenar = (ordenacaoNova: TipoOrdenacaoEnum) => {
    const newParams = {
      ...tableParams,
      order: ordenacaoNova,
    };

    setTableParams(newParams);

    fetchData(newParams);
  };

  return (
    <>
      {showOrderButton && <ButtonOrdenacao onClick={onClickOrdenar} />}
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
