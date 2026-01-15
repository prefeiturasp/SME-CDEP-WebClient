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
  const [dadoscontroleLivrosEmprestados, setDadosControleLivrosEmprestados] = useState<
    AcervosCadastradosDTO[]
  >([]);
  const [dadossolicitacoesTipoAcervo, setDadosSolicitacoesTipoAcervo] = useState<
    AcervosCadastradosDTO[]
  >([]);

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

  const quantidadeSolicitacoesMensais = async () => {
    try {
      const retorno = await service.obterQuantidadeSolicitacoesMensais();

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

  async function solicitacoesTipoAcervo() {
    try {
      const retorno = await service.obterSolicitacoesTipoAcervo();
      retorno.data.sort((a, b) => a.nome.localeCompare(b.nome));
      setDadosSolicitacoesTipoAcervo(retorno.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    acervosCadastrados();
    quantidadePesquisasMensais();
    quantidadeSolicitacoesMensais();

    solicitacoesPorSituacao();
    controleLivrosEmprestados();
    solicitacoesTipoAcervo();
  }, []);

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
          ></GraficoBarChart>
        </div>
      </CardContent>          

      <br></br>

      <CardContent>
        <div className='grafico-container'>
          <GraficoBarChart
            dados={dadosquantidadeSolicitacoesMensais}
            titulo={'Quantidade de solicitações mensais'}
            subtitulo={
              'Exibe o total de solicitações realizadas em cada mês, permitindo acompanhar a demanda ao longo do ano atual.'
            }
            labelvertical='Quantidade de solicitações'
            labelHorizontal='Meses'
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
          ></GraficoBarChart>
        </div>
      </CardContent>
    </Col>
  );
};

export default Indicadores;
