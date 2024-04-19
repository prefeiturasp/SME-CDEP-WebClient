import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { dayjs } from '~/core/date/dayjs';
import React from 'react';
import { ImportacaoArquivoRetornoDTO } from '~/core/dto/importacao-arquivo-retorno-dto';

const columnsArquivoImportacao: ColumnsType<ImportacaoArquivoRetornoDTO> = [
  {
    title: 'Nome do arquivo Importado',
    dataIndex: 'nome',
  },
  {
    title: 'Data da Importação',
    dataIndex: 'dataImportacao',
    render: (dataImportacao: string) => dayjs(dataImportacao).format('DD/MM/YYYY - HH:mm'),
  },
];

type TableImportacaoProps = {
  dataSource: ImportacaoArquivoRetornoDTO[];
};
const TableImportacao: React.FC<TableImportacaoProps> = ({ dataSource }) => (
  <Table
    rowKey='id'
    columns={columnsArquivoImportacao}
    dataSource={dataSource}
    pagination={false}
    bordered
    locale={{ emptyText: 'Sem dados' }}
    size='small'
  />
);

export default TableImportacao;
