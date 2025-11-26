import React, { useEffect, useState } from 'react';
import { Col } from 'antd';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import GraficoAreaChart from '~/components/lib/area-chart';
import { AcervosCadastradosDTO } from '~/core/dto/acervos-cadastrados-dto';
import service from '~/core/services/indicadores-service';
import GraficoBarChart from '~/components/lib/bar-chart';

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

      setDadosQuantidadePesquisasMensais(final);
    } catch (error) {
      console.log(error);
    }
  };

  const quantidadeSolicitacoesMensais = async () => {
    try {
      const retorno = await service.obterQuantidadeSolicitacoesMensais();

      const dadosOrdenados = [...retorno.data].sort((a, b) => a.id - b.id);

      setDadosQuantidadeSolicitacoesMensais(dadosOrdenados);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    acervosCadastrados();
    quantidadePesquisasMensais();
    quantidadeSolicitacoesMensais();
  }, []);

  return (
    <Col>
      <HeaderPage title='Painel de indicadores'></HeaderPage>

      <CardContent>
        <GraficoAreaChart
          dados={dadosAcervosCadastrados}
          titulo={'Acervos cadastrados'}
          subtitulo={
            'Exibe a quantidade total de acervos cadastrados em cada tipo, permitindo acompanhar a composição geral do acervo.'
          }
          labelvertical='Quantidade de acervos'
          labelHorizontal='Tipos de acervo'
        ></GraficoAreaChart>
      </CardContent>

      <br></br>

      <CardContent>
        <GraficoBarChart
          dados={dadosquantidadeSolicitacoesMensais}
          titulo={'Solicitações por tipo de acervo'}
          subtitulo={
            'Exibe a quantidade de solicitações realizadas para cada tipo de acervo, permitindo identificar quais são os mais demandados.'
          }
          labelvertical='Quantidade de solicitações'
          labelHorizontal='Meses'
        ></GraficoBarChart>
      </CardContent>

      <br></br>

      <CardContent>
        <GraficoAreaChart
          dados={dadosquantidadePesquisasMensais}
          titulo={'Quantidade de pesquisas mensais'}
          subtitulo={
            'Exibe o total de pesquisas realizadas no ano atual, facilitando a visualização do uso ao longo do tempo.'
          }
          labelvertical='Quantidade de pesquisas'
          labelHorizontal='Meses'
        ></GraficoAreaChart>
      </CardContent>
    </Col>
  );
};

export default Indicadores;
