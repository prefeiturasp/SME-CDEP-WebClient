import { SearchOutlined } from '@ant-design/icons';
import { Col, Input, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import CardContent from '~/components/lib/card-content';
import PropTypes from 'prop-types';

interface EstruturaDados {
  key: string;
  name: string;
}

type TableCadastroProps = {
  dadosTabela: EstruturaDados[];
  colunasTabela: ColumnsType<EstruturaDados>;
};
const CardTableCadastros: React.FC<TableCadastroProps> = ({ dadosTabela, colunasTabela }) => {
  return (
    <>
      <Col>
        <CardContent>
          <Input
            type='text'
            placeholder='Nome'
            prefix={<SearchOutlined />}
            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
              console.table((e.target as HTMLInputElement).value);
            }}
          />
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          <Table dataSource={dadosTabela} columns={colunasTabela} bordered />
        </CardContent>
      </Col>
    </>
  );
};
CardTableCadastros.propTypes = {
  dadosTabela: PropTypes.array.isRequired,
  colunasTabela: PropTypes.array.isRequired,
};
export default CardTableCadastros;
