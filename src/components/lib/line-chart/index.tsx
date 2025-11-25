import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts';

import { Typography, Space, Row, Col } from 'antd';
import { AcervosCadastradosDTO } from '~/core/dto/acervos-cadastrados-dto';

const { Title, Text } = Typography;

interface GraficoAreaChartProps {
  dados: AcervosCadastradosDTO[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: '#fff',
          padding: 12,
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <p style={{ margin: 0, color: '#89162D' }}>
          <strong>Tipo de acervo:</strong> {label}
        </p>

        <p style={{ margin: 0 }}>
          <strong>Quantidade:</strong> {payload[0].value}
        </p>
      </div>
    );
  }

  return null;
};

interface GraficoAreaChartProps {
  dados: AcervosCadastradosDTO[];
  titulo: string;
  subtitulo: string;
  labelvertical: string;
  labelHorizontal: string;
}

export default function GraficoAreaChart({ dados, titulo, subtitulo, labelvertical, labelHorizontal }: GraficoAreaChartProps) {
  if (!dados || dados.length === 0) return 'NADA FOI ENCONTRADO';

  return (
    <>
      <Space direction='vertical' size={4} style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          {titulo}
        </Title>

        <Text type='secondary'>{subtitulo}</Text>
      </Space>

      <Row>
        <Col span={24}>
          <div style={{ width: '100%', height: '50vh' }}>
            <ResponsiveContainer width='100%' height='100%'>
              <AreaChart
                data={dados}
                syncId={titulo}
                margin={{ top: 20, right: 20, left: 30, bottom: 70 }}
              >
                <defs>
                  <linearGradient id='fadeWhite' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='0%' stopColor='#89162D' stopOpacity={0.5} />
                    <stop offset='100%' stopColor='#89162D' stopOpacity={0.01} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray='3 3' />

                <XAxis
                  dataKey='nome'
                  tick={{ fill: '#000' }}
                  tickMargin={15}
                  axisLine={false}
                  tickLine={false}
                  style={{ textAnchor: 'middle', fontSize: 14, fill: '#595959' }}
                >
                  <Label
                    value={labelHorizontal}
                    position='bottom'
                    offset={50}
                    style={{
                      textAnchor: 'middle',
                      fontSize: 14,
                      fontWeight: 'bold',
                      fill: '#595959',
                    }}
                  />
                </XAxis>

                <YAxis
                  tick={{ fill: '#000' }}
                  stroke='#EDEDED'
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  style={{ textAnchor: 'middle', fontSize: 14, fill: '#595959' }}
                >
                  <Label
                    value={labelvertical}
                    angle={-90}
                    position='left'
                    offset={0}
                    style={{
                      textAnchor: 'middle',
                      fontSize: 14,
                      fill: '#595959',
                      fontWeight: 'bold',
                    }}
                  />
                </YAxis>

                <Tooltip content={<CustomTooltip />} />

                <Area dataKey='valor' stroke='#89162D' strokeWidth={2} fill='url(#fadeWhite)' />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>
    </>
  );
}
