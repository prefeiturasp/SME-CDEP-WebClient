import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react';
import { AcervoLinhaRetornoSucessoDTO } from '~/core/dto/acervo-linha-sucesso-dto';
import { ImportacaoArquivoRetornoDTO } from '~/core/dto/importacao-arquivo-retorno-dto';

const columnsArquivoImportacaoSucesso: ColumnsType<AcervoLinhaRetornoSucessoDTO> = [
  {
    title: 'Número linha',
    dataIndex: 'numeroLinha',
    width: 103,
  },
  {
    title: 'Título',
    dataIndex: 'titulo',
  },
  {
    title: 'Tombo/Código',
    dataIndex: 'tombo',
  },
];

type TableImportacaoSucessoProps = {
  dataSource: ImportacaoArquivoRetornoDTO[];
};
const TableImportacaoSucesso: React.FC<TableImportacaoSucessoProps> = ({ dataSource }) => (
  <Table
    columns={columnsArquivoImportacaoSucesso}
    rowKey='numeroLinha'
    dataSource={dataSource?.length ? dataSource[0].sucesso : []}
    pagination={false}
    bordered
    locale={{ emptyText: 'Sem dados' }}
    size='small'
  />
);

export default TableImportacaoSucesso;
