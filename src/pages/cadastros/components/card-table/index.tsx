import { SearchOutlined } from '@ant-design/icons';
import { Col, Input, Row } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import CardContent from '~/components/lib/card-content';
import DataTable from '~/components/lib/data-table';
import { CadastroAuxiliarDTO } from '~/core/dto/cadastro-auxiliar-dto';

interface EstruturaDados {
  key: string;
  name: string;
}

type TableCadastroProps = {
  dadosTabela: EstruturaDados[];
  colunasTabela: ColumnsType<EstruturaDados>;
};
const CardTableCadastros: React.FC<TableCadastroProps> = () => {
  const [filters, setFilters] = useState({ nome: '' });

  const columns: ColumnsType<CadastroAuxiliarDTO> = [
    {
      title: 'Nome',
      dataIndex: 'nome',
    },
  ];

  return (
    <CardContent>
      <Row gutter={[8, 16]}>
        <Col span={24}>
          <Input
            type='text'
            placeholder='Nome'
            prefix={<SearchOutlined />}
            onChange={(e: any) => {
              setFilters({ nome: e.target.value });
            }}
          />
        </Col>

        <Col span={24}>
          <DataTable filters={filters} url='v1/assunto' columns={columns} />
        </Col>
      </Row>
    </CardContent>
  );
};

export default CardTableCadastros;
