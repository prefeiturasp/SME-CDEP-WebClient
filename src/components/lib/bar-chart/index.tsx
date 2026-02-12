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

import { Typography, Space, Row, Col, Select, Empty } from 'antd';
import { AcervosCadastradosDTO } from '~/core/dto/acervos-cadastrados-dto';

const { Title, Text } = Typography;

export interface FiltroConfig {
  label: string;
  value: string | number;
  options: { value: string | number; label: string }[];
  onChange: (value: any) => void;
}

export interface BarraConfig {
  dataKey: string;
  color: string;
  hiddenColor?: string;
  label?: string;
}

const formatarNumero = (valor: number) => valor.toLocaleString('pt-BR');

const CustomTooltip = ({ active, payload, barras }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    if (barras && barras.length > 0) {
      const total = barras.reduce(
        (acc: number, barra: BarraConfig) => acc + (Number(data[barra.dataKey]) || 0),
        0,
      );

      return (
        <div
          style={{
            background: '#fff',
            padding: 12,
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          {/* <p style={{ margin: 0 }}>{data.nome}</p> */}
          {barras.map((barra: BarraConfig) => (
            <p key={barra.dataKey} style={{ margin: 0 }}>
              {barra.label}: <strong>{formatarNumero(Number(data[barra.dataKey]) || 0)}</strong>
            </p>
          ))}
          <p style={{ margin: 0 }}>
            Total de solicitações: <strong>{formatarNumero(total)}</strong>
          </p>
        </div>
      );
    }

    return (
      <div
        style={{
          background: '#fff',
          padding: 12,
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <p style={{ margin: 0 }}>{data.nome}</p>
        <p style={{ margin: 0 }}>
          <strong>{formatarNumero(payload[0].value)} Solicitações</strong>
        </p>
      </div>
    );
  }

  return null;
};

interface GraficoBarChartProps {
  dados: AcervosCadastradosDTO[];
  titulo: string;
  subtitulo: string;
  labelvertical: string;
  labelHorizontal: string;
  showFilters: boolean;
  labelNoTopo?: boolean;
  filtros?: FiltroConfig[];
  barras?: BarraConfig[];
}

export default function GraficoBarChart({
  dados,
  titulo,
  subtitulo,
  labelvertical,
  labelHorizontal,
  showFilters,
  labelNoTopo = false,
  filtros = [],
  barras,
}: GraficoBarChartProps) {
  const semDadosBase = !dados || dados.length === 0;
  const dadosVisiveis = dados?.filter((d) => !d.esconder) ?? [];
  const semDadosBarras =
    barras &&
    dados?.length > 0 &&
    dadosVisiveis.every((d: any) => barras.every((b) => !d[b.dataKey]));
  const semDadosValor = !barras && dados?.length > 0 && dadosVisiveis.every((d) => !d.valor);
  const semDados = semDadosBase || semDadosBarras || semDadosValor;

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

          {showFilters && filtros.length > 0 && (
            <div style={{ display: 'flex', flex: 1, gap: 8, marginLeft: 16 }}>
              {filtros.map((filtro, index) => (
                <div key={index} style={{ flex: 1, paddingLeft: 10 }}>
                  <Text strong>{filtro.label}</Text>
                  <Select
                    value={filtro.value}
                    options={filtro.options}
                    style={{ width: '100%', display: 'block' }}
                    onChange={filtro.onChange}
                  />
                </div>
              ))}
            </div>
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
              <Empty description='Sem dados' />
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
                    {!barras && (
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
                    )}
                  </XAxis>

                  <YAxis
                    tick={{ fill: '#000' }}
                    stroke='#EDEDED'
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                    domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.3)]}
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

                      return <CustomTooltip {...props} barras={barras} />;
                    }}
                  />

                  {barras ? (
                    barras.map((barra) => (
                      <Bar key={barra.dataKey} dataKey={barra.dataKey} radius={[4, 4, 0, 0]}>
                        {dados.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={entry.esconder ? barra.hiddenColor ?? '#BFBFBF33' : barra.color}
                          />
                        ))}
                      </Bar>
                    ))
                  ) : (
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
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {barras && barras.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 16,
                  marginTop: 0,
                }}
              >
                <Text style={{ fontSize: 13, color: '#595959' }}>
                  <strong>Atendimentos feitos de forma:</strong>
                </Text>
                {barras.map((barra: BarraConfig) => (
                  <div
                    key={barra.dataKey}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: 14,
                        height: 14,
                        borderRadius: 2,
                        backgroundColor: barra.color,
                      }}
                    />
                    <Text style={{ fontSize: 13, color: '#595959', fontWeight: 'bold' }}>
                      {barra.label
                        ?.replace('Atendimentos manuais', 'Manuais')
                        .replace('Atendimentos automáticas', 'Automáticos')}
                    </Text>
                  </div>
                ))}
              </div>
            )}
          </Col>
        </Row>
      )}
    </>
  );
}
