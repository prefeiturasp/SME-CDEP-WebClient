import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
  BarChart,
  Bar,
  ResponsiveContainer,
  LabelList,
  Cell,
} from 'recharts';

import { Typography, Space, Row, Col, Select } from 'antd';
import { AcervosCadastradosDTO } from '~/core/dto/acervos-cadastrados-dto';

const { Title, Text } = Typography;

interface GraficoAreaChartProps {
  dados: AcervosCadastradosDTO[];
}

const CustomTooltip = ({ active, payload, labelHorizontal }: any) => {
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
        {/* <p style={{ margin: 0, color: '#89162D' }}>
          <strong>{labelHorizontal}:</strong> {payload[0].payload.nome}
        </p> */}

        <p style={{ margin: 0 }}>
          {payload[0].payload.nome}
        </p>

        <p style={{ margin: 0 }}>
          <strong>{payload[0].value} Solicitações</strong>
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
  showFilters: boolean;
  labelNoTopo?: boolean;
  onAnoChange?: (ano: number) => void;
  onMesChange?: (mes: string) => void;
}

export default function GraficoBarChart({
  dados,
  titulo,
  subtitulo,
  labelvertical,
  labelHorizontal,
  showFilters,
  labelNoTopo = false,
  onAnoChange,
  onMesChange,
}: GraficoAreaChartProps) {
  const semDados = !dados || dados.length === 0;

  const anoAtual = new Date().getFullYear();
  const anosOptions = Array.from({ length: 3 }, (_, i) => ({
    value: anoAtual - i,
    label: String(anoAtual - i),
  }));

  const nomesMeses = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  const mesAtual = new Date().getMonth();
  const ultimosMeses = Array.from({ length: 3 }, (_, i) => {
    const indice = (mesAtual - i + 12) % 12;
    return { value: String(indice + 1), label: nomesMeses[indice] };
  }).reverse();
  const mesesOptions = [{ value: 'todos', label: 'Todos' }, ...ultimosMeses];

  return (
    <>
      <Space direction='vertical' size={16} style={{ marginBottom: 16, width: '100%' }}>
        <Title level={4} style={{ margin: 0, color: '#595959' }}>
          {titulo}
        </Title>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Text
            type='secondary'
            style={{
              marginTop: 16,
              fontFamily: 'Roboto',
              fontWeight: 400,
              fontStyle: 'normal',
              fontSize: 14,
              lineHeight: '100%',
              letterSpacing: 0,
              color: '#595959',
            }}
          >
            {subtitulo}
          </Text>

          {showFilters && (
            <Space>
              <Select
                defaultValue={anoAtual}
                options={anosOptions}
                style={{ width: 100 }}
                onChange={onAnoChange}
              />
              <Select
                defaultValue='todos'
                options={mesesOptions}
                style={{ width: 130 }}
                onChange={onMesChange}
              />
            </Space>
          )}
        </div>
      </Space>

      {semDados ? (
        <Row>
          <Col span={24}>
            <div
              style={{
                width: '100%',
                height: '30vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text type='secondary' style={{ fontSize: 16 }}>
                NADA FOI ENCONTRADO
              </Text>
            </div>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col span={24}>
            <div style={{ width: '100%', height: '50vh' }}>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart
                  data={dados}
                  syncId={titulo}
                  margin={{ top: 20, right: 20, left: 30, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray='3 3' vertical={false} />

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
                      position='insideLeft'
                      dx={-20}
                      style={{
                        textAnchor: 'middle',
                        fontSize: 14,
                        fill: '#595959',
                        fontWeight: 'bold',
                      }}
                    />
                  </YAxis>

                  <Tooltip
                    content={(props: any) => {
                      const { active, payload } = props;

                      if (!active || !payload || !payload.length) return null;

                      if (payload[0].payload.esconder) return null;

                      return <CustomTooltip {...props} labelHorizontal={labelHorizontal} />;
                    }}
                  />

                  <Bar dataKey='valor' radius={[4, 4, 0, 0]}>
                    {dados.map((entry, index) => (
                      <Cell key={index} fill={entry.esconder ? '#BFBFBF33' : '#89162D'} />
                    ))}

                    <LabelList
                      dataKey='valor'
                      content={(props: any) => {
                        const { value, x, y, width, height, index } = props;

                        const item = dados[index];

                        if (!item || item.esconder) return null;

                        return (
                          <text
                            x={x + width / 2}
                            y={labelNoTopo ? y - 8 : y + height - 8}
                            fill={labelNoTopo ? '#000000' : '#FFFFFF'}
                            fontWeight='bold'
                            fontSize={12}
                            textAnchor='middle'
                          >
                            {value}
                          </text>
                        );
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Col>
        </Row>
      )}
    </>
  );
}
