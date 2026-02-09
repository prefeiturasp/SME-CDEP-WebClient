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

import { useState } from 'react';
import { Typography, Space, Row, Col, Select } from 'antd';
import { AcervosCadastradosDTO } from '~/core/dto/acervos-cadastrados-dto';

const { Title, Text } = Typography;

interface GraficoAreaChartProps {
  dados: AcervosCadastradosDTO[];
}

const CustomTooltip = ({ active, payload, labelHorizontal }: any) => {
  console.log(labelHorizontal)
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
  const mesAtual = new Date().getMonth();

  const [anoSelecionado, setAnoSelecionado] = useState<number>(anoAtual);
  const [mesSelecionado, setMesSelecionado] = useState<string>('todos');

  const anosOptions = Array.from({ length: 5 }, (_, i) => ({
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

  const quantidadeMeses = anoSelecionado === anoAtual ? mesAtual + 1 : 12;
  const mesesOptions = [
    { value: 'todos', label: 'Todos' },
    ...nomesMeses.slice(0, quantidadeMeses).map((nome, index) => ({
      value: String(index + 1),
      label: nome,
    })),
  ];

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
            <div style={{ display: 'flex', flex: 1, gap: 8, marginLeft: 16 }}>
              <div style={{ flex: 1 }}>
                <Text strong>Ano</Text>
                <Select
                  value={anoSelecionado}
                  options={anosOptions}
                  style={{ width: '100%', display: 'block' }}
                  onChange={(ano) => {
                    setAnoSelecionado(ano);
                    setMesSelecionado('todos');
                    onAnoChange?.(ano);
                    onMesChange?.('todos');
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Text strong>Mês</Text>
                <Select
                  value={mesSelecionado}
                  options={mesesOptions}
                  style={{ width: '100%', display: 'block' }}
                  onChange={(mes) => {
                    setMesSelecionado(mes);
                    onMesChange?.(mes);
                  }}
                />
              </div>
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
