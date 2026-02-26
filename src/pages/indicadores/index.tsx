import React, { useEffect, useState } from 'react';
import { Col } from 'antd';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import GraficoAreaChart from '~/components/lib/area-chart';
import { AcervosCadastradosDTO } from '~/core/dto/acervos-cadastrados-dto';
import service from '~/core/services/indicadores-service';
import GraficoBarChart from '~/components/lib/bar-chart';
import './index.css';

const Indicadores = () => {
  const [dadosAcervosCadastrados, setDadosAcervosCadastrados] = useState<AcervosCadastradosDTO[]>(
    [],
  );
  const [dadosquantidadePesquisasMensais, setDadosQuantidadePesquisasMensais] = useState<
    AcervosCadastradosDTO[]
  >([]);
  const [dadosquantidadeSolicitacoesMensais, setDadosQuantidadeSolicitacoesMensais] = useState<
    AcervosCadastradosDTO[]
  >([]);

  const [dadossolicitacoesPorSituacao, setDadosSolicitacoesPorSituacao] = useState<
    AcervosCadastradosDTO[]
  >([]);
  const [anoSolicitacoesTipoAcervo, setAnoSolicitacoesTipoAcervo] = useState<number>(
    new Date().getFullYear(),
  );
  const [mesSolicitacoesTipoAcervo, setMesSolicitacoesTipoAcervo] = useState<string>('todos');
  const [dadoscontroleLivrosEmprestados, setDadosControleLivrosEmprestados] = useState<
    AcervosCadastradosDTO[]
  >([]);
  const [dadossolicitacoesTipoAcervo, setDadosSolicitacoesTipoAcervo] = useState<
    AcervosCadastradosDTO[]
  >([]);

  const [anoSolicitacoesMensais, setAnoSolicitacoesMensais] = useState<number>(
    new Date().getFullYear(),
  );
  const [tipoAtendimento, setTipoAtendimento] = useState<string>('total_solicitacoes');

  const anoAtual = new Date().getFullYear();
  const mesAtual = new Date().getMonth();

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

  const quantidadeMesesTipoAcervo = anoSolicitacoesTipoAcervo === anoAtual ? mesAtual + 1 : 12;
  const mesesOptionsTipoAcervo = [
    { value: 'todos', label: 'Todos' },
    ...nomesMeses.slice(0, quantidadeMesesTipoAcervo).map((nome, index) => ({
      value: String(index + 1),
      label: nome,
    })),
  ];

  const tipoAtendimentoOptions = [
    { value: 'total_solicitacoes', label: 'Total de Solicitações' },
    { value: 'total_por_tipo', label: 'Total por tipo de atendimento' },
  ];

  const acervosCadastrados = async () => {
    try {
      const retorno = await service.obterAcervosCadastrados();

      const dadosOrdenados = [...retorno.data].sort((a, b) => a.id - b.id);

      const primeiroRegistro = {
        id: dadosOrdenados[0].id - 1,
        nome: '',
        valor: dadosOrdenados[0].valor,
      };

      const ultimoRegistro = {
        id: dadosOrdenados[dadosOrdenados.length - 1].id + 1,
        nome: '',
        valor: dadosOrdenados[dadosOrdenados.length - 1].valor,
      };

      const final = [primeiroRegistro, ...dadosOrdenados, ultimoRegistro];

      setDadosAcervosCadastrados(final);
    } catch (error) {
      console.log(error);
    }
  };

  const quantidadePesquisasMensais = async () => {
    try {
      const retorno = await service.obterQuantidadePesquisasMensais();

      const mesesDoAno = [
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

      const recebidos: AcervosCadastradosDTO[] = retorno.data;

      const recebidosMap = new Map(recebidos.map((m) => [m.id, m]));

      const mesesCompletos: AcervosCadastradosDTO[] = mesesDoAno.map((nome, index) => {
        const id = index + 1;

        if (recebidosMap.has(id)) {
          return {
            ...recebidosMap.get(id)!,
            esconder: false,
          };
        }

        return {
          id,
          nome,
          valor: 0,
          esconder: true,
        };
      });

      setDadosQuantidadePesquisasMensais(mesesCompletos);
    } catch (error) {
      console.log(error);
    }
  };

  const quantidadeSolicitacoesMensais = async (ano: number) => {
    try {
      const retorno = await service.obterQuantidadeSolicitacoesMensais(ano);

      const mesesDoAno = [
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

      const recebidos: AcervosCadastradosDTO[] = retorno.data;

      const maiorValor = Math.max(...recebidos.map((m) => m.valor));
      const maiorTotalAutomatica = Math.max(...recebidos.map((m) => m.totalAutomatica ?? 0));
      const maiorTotalManual = Math.max(...recebidos.map((m) => m.totalManual ?? 0));
      const maior = Math.max(maiorTotalManual, maiorTotalAutomatica);
      const recebidosMap = new Map(recebidos.map((m) => [m.id, m]));

      const mesesCompletos: AcervosCadastradosDTO[] = mesesDoAno.map((nome, index) => {
        const id = index + 1;

        if (recebidosMap.has(id)) {
          return {
            ...recebidosMap.get(id)!,
            esconder: false,
          };
        }

        return {
          id,
          nome,
          valor: maiorValor,
          totalAutomatica: maior,
          totalManual: maior,
          esconder: true,
        };
      });

      setDadosQuantidadeSolicitacoesMensais(mesesCompletos);
    } catch (error) {
      console.log(error);
    }
  };

  async function solicitacoesPorSituacao() {
    try {
      const retorno = await service.obterSolicitacoesPorSituacao();
      retorno.data.sort((a, b) => a.nome.localeCompare(b.nome));
      setDadosSolicitacoesPorSituacao(retorno.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function controleLivrosEmprestados() {
    try {
      const retorno = await service.obterControleLivrosEmprestados();
      setDadosControleLivrosEmprestados(retorno.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function solicitacoesTipoAcervo(ano: number, mes: string) {
    try {
      const retorno = await service.obterSolicitacoesTipoAcervo(ano, mes);
      retorno.data.sort((a, b) => a.nome.localeCompare(b.nome));
      setDadosSolicitacoesTipoAcervo(retorno.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    acervosCadastrados();
    quantidadePesquisasMensais();
    solicitacoesPorSituacao();
    controleLivrosEmprestados();
  }, []);

  useEffect(() => {
    quantidadeSolicitacoesMensais(anoSolicitacoesMensais);
  }, [anoSolicitacoesMensais]);

  useEffect(() => {
    solicitacoesTipoAcervo(anoSolicitacoesTipoAcervo, mesSolicitacoesTipoAcervo);
  }, [anoSolicitacoesTipoAcervo, mesSolicitacoesTipoAcervo]);

  return (
    <Col>
      <HeaderPage title='Painel de indicadores'></HeaderPage>

      <CardContent>
        <div className='grafico-container'>
          <GraficoAreaChart
            dados={dadosAcervosCadastrados}
            titulo={'Acervos cadastrados'}
            subtitulo={
              'Exibe a quantidade total de acervos cadastrados em cada tipo, permitindo acompanhar a composição geral do acervo.'
            }
            labelvertical='Quantidade de acervos'
            labelHorizontal='Tipos de acervo'
          ></GraficoAreaChart>
        </div>
      </CardContent>

      <br></br>

      <CardContent>
        <div className='grafico-container'>
          <GraficoBarChart
            dados={dadossolicitacoesPorSituacao}
            titulo={'Solicitações por situação'}
            subtitulo={
              'Mostra a quantidade de solicitações em cada situação, permitindo acompanhar o status de atendimento de forma clara.'
            }
            labelvertical='Quantidade de solicitações'
            labelHorizontal='Situações'
            labelNoTopo={true}
            showFilters={false}
          ></GraficoBarChart>
        </div>
      </CardContent>

      <br></br>

      <CardContent>
        <div className='grafico-container'>
          <GraficoBarChart
            dados={dadoscontroleLivrosEmprestados}
            titulo={'Controle de livros emprestados'}
            subtitulo={
              'Exibe o total de livros emprestados em cada situação, permitindo acompanhar o status dos empréstimos de forma clara.'
            }
            labelvertical='Quantidade de solicitações'
            labelHorizontal='Situações'
            labelNoTopo={true}
            showFilters={false}
          ></GraficoBarChart>
        </div>
      </CardContent>

      <br></br>

      <CardContent>
        <div className='grafico-container'>
          <GraficoBarChart
            dados={dadosquantidadeSolicitacoesMensais}
            titulo={'Quantidade de solicitações e atendimentos por período'}
            subtitulo={
              'Exibe o total de atendimentos por mês, detalhando quantos foram atendidos no total, manualmente e de forma automática.'
            }
            labelvertical='Quantidade de solicitações'
            labelHorizontal='Meses'
            labelNoTopo={true}
            showFilters={true}
            filtros={[
              {
                label: 'Ano',
                value: anoSolicitacoesMensais,
                options: anosOptions,
                onChange: (ano) => setAnoSolicitacoesMensais(ano),
              },
              {
                label: 'Tipo de totais',
                value: tipoAtendimento,
                options: tipoAtendimentoOptions,
                onChange: (tipo) => setTipoAtendimento(tipo),
              },
            ]}
            barras={
              tipoAtendimento === 'total_por_tipo'
                ? [
                    {
                      dataKey: 'totalAutomatica',
                      color: '#FFB8C6',
                      label: 'Atendimentos automáticos',
                    },
                    { dataKey: 'totalManual', color: '#89162D', label: 'Atendimentos manuais' },
                  ]
                : undefined
            }
          ></GraficoBarChart>
        </div>
      </CardContent>

      <br></br>

      <CardContent>
        <div className='grafico-container'>
          <GraficoAreaChart
            dados={dadosquantidadePesquisasMensais}
            titulo={'Quantidade de pesquisas mensais'}
            subtitulo={
              'Exibe o total de pesquisas realizadas no ano atual, facilitando a visualização do uso ao longo do tempo.'
            }
            labelvertical='Quantidade de pesquisas'
            labelHorizontal='Meses'
          ></GraficoAreaChart>
        </div>
      </CardContent>

      <br></br>

      <CardContent>
        <div className='grafico-container'>
          <GraficoBarChart
            dados={dadossolicitacoesTipoAcervo}
            titulo={'Solicitações por tipo de acervo'}
            subtitulo={
              'Exibe a quantidade de solicitações realizadas para cada tipo de acervo, permitindo identificar quais são os mais demandados.'
            }
            labelvertical='Quantidade de solicitações'
            labelHorizontal='Tipos de acervo'
            showFilters={true}
            labelNoTopo={true}
            filtros={[
              {
                label: 'Ano',
                value: anoSolicitacoesTipoAcervo,
                options: anosOptions,
                onChange: (ano) => {
                  setAnoSolicitacoesTipoAcervo(ano);
                  setMesSolicitacoesTipoAcervo('todos');
                },
              },
              {
                label: 'Mês',
                value: mesSolicitacoesTipoAcervo,
                options: mesesOptionsTipoAcervo,
                onChange: (mes) => setMesSolicitacoesTipoAcervo(mes),
              },
            ]}
          ></GraficoBarChart>
        </div>
      </CardContent>
    </Col>
  );
};

export default Indicadores;
