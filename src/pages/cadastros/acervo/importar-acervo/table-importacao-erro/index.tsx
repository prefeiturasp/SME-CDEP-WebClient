import { Col, Row, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react';
import { AcervoLinhaErroDTO } from '~/core/dto/acervo-linha-erro-dto';
import { AcervoLinhaRetornoDTO } from '~/core/dto/acervo-linha-retorno-dto';
import { ImportacaoArquivoRetornoDTO } from '~/core/dto/importacao-arquivo-retorno-dto';
import ModalImportacaoAcervo from '../modal';

type TableImportacaoErroProps = {
  dataSource: ImportacaoArquivoRetornoDTO[];
  obterDados: () => void;
  atualizarLinhaParaSucesso: (numeroLinha: number) => void;
  removerLinhaDoArquivo: (numeroLinha: number) => void;
};
const TableImportacaoErro: React.FC<TableImportacaoErroProps> = ({
  dataSource,
  obterDados,
  removerLinhaDoArquivo,
  atualizarLinhaParaSucesso,
}) => {
  const columnsArquivoImportacaoErros: ColumnsType<AcervoLinhaErroDTO> = [
    {
      title: 'Número linha',
      dataIndex: 'numeroLinha',
      width: 103,
    },
    {
      title: 'Título',
      dataIndex: 'titulo',
    },
    { title: 'Tombo/Código', dataIndex: 'tombo', width: 115 },
    {
      title: 'Erros',
      dataIndex: 'retornoErro',
      ellipsis: true,
      render: (retornoErro: AcervoLinhaRetornoDTO) => {
        if (retornoErro.mensagem) {
          return (
            <Row wrap>
              <Tag color='error'>{retornoErro.mensagem}</Tag>
            </Row>
          );
        }

        if (retornoErro.errosCampos?.length) {
          return (
            <Col>
              <Row gutter={[8, 8]}>
                {retornoErro.errosCampos.map((erroCampo, i) => (
                  <Tag key={i} color='error'>
                    {erroCampo}
                  </Tag>
                ))}
              </Row>
            </Col>
          );
        }

        return <></>;
      },
    },
    {
      title: 'Ações',
      align: 'center',
      width: 80,
      render: (_, row: AcervoLinhaErroDTO) => (
        <ModalImportacaoAcervo
          acervoLinhaErro={row}
          atualizarLinhaParaSucesso={() => atualizarLinhaParaSucesso(row.numeroLinha)}
          removerLinhaDoArquivo={() => removerLinhaDoArquivo(row.numeroLinha)}
          obterDados={obterDados}
        />
      ),
    },
  ];

  return (
    <Table
      columns={columnsArquivoImportacaoErros}
      rowKey='numeroLinha'
      dataSource={dataSource?.length ? dataSource[0].erros : []}
      pagination={false}
      bordered
      locale={{ emptyText: 'Sem dados' }}
      size='small'
    />
  );
};

export default TableImportacaoErro;
