import { Col, Row, Typography } from 'antd';
import Pagination from 'antd/es/pagination';
import { useEffect, useMemo, useState } from 'react';
import { PesquisaAcervoDTO } from '~/core/dto/pesquisa-acervo-dto';
import { pesquisarAcervos } from '~/core/services/acervo-service';
import { FiltroConsultaAcervo } from './filtro-consulta-acervo';
import { ListaCardsConsultaAcervo } from './lista-cards-consulta-acervo';

export const ConsultaAcervo = () => {
  const [buscaTextoLivre, setBuscaTextoLivre] = useState<string>('');
  const [buscaTipoAcervoSelecionado, setBuscaTipoAcervoSelecionado] = useState<number | null>(null);
  const [dadosFiltro, setDadosFiltro] = useState<PesquisaAcervoDTO[]>([]);
  const numeroRegistrosPagina = 5;
  const [numeroRegistros, setNumeroRegistros] = useState(1);

  const nenhumTipoAcervoSelecionado =
    buscaTipoAcervoSelecionado === null || buscaTipoAcervoSelecionado === 0;

  const obterPesquisaArcevo = async (pagina: number) => {
    if (buscaTextoLivre && buscaTextoLivre.length < 3) return;

    const resposta = await pesquisarAcervos(
      pagina,
      numeroRegistrosPagina,
      buscaTextoLivre,
      buscaTipoAcervoSelecionado,
    );

    if (resposta?.sucesso) {
      setNumeroRegistros(resposta?.dados?.totalRegistros);
      setDadosFiltro(resposta?.dados?.items);
    }
  };

  const dadosFiltrado = useMemo(() => {
    if (!buscaTextoLivre && nenhumTipoAcervoSelecionado) return dadosFiltro;

    const filtroGeral = dadosFiltro?.filter((item: PesquisaAcervoDTO) => {
      const { titulo, creditoAutoria, assunto, descricao, tipo } = item;

      const textoLivreFiltro =
        !buscaTextoLivre ||
        (titulo + creditoAutoria + assunto + descricao)
          .toLowerCase()
          .includes(buscaTextoLivre.toLowerCase());

      const tipoAcervoFiltro = nenhumTipoAcervoSelecionado || tipo === buscaTipoAcervoSelecionado;

      return textoLivreFiltro && tipoAcervoFiltro;
    });

    return filtroGeral;
  }, [buscaTextoLivre, buscaTipoAcervoSelecionado, dadosFiltro]);

  useEffect(() => {
    obterPesquisaArcevo(1);
  }, [buscaTextoLivre, buscaTipoAcervoSelecionado]);

  return (
    <>
      <Typography style={{ fontSize: 20, fontWeight: 'bold', margin: '16px 0 0 16px' }}>
        Faça sua busca
      </Typography>
      <Col style={{ position: 'sticky', top: 0, zIndex: 1 }}>
        <FiltroConsultaAcervo
          buscaTextoLivre={buscaTextoLivre}
          buscaTipoAcervo={buscaTipoAcervoSelecionado}
          setBuscaTextoLivre={setBuscaTextoLivre}
          setBuscaTipoAcervo={setBuscaTipoAcervoSelecionado}
        />
      </Col>
      <ListaCardsConsultaAcervo dadosGerais={dadosFiltrado} />
      <Row align='middle' justify='center'>
        <Pagination
          hideOnSinglePage
          total={numeroRegistros}
          pageSize={numeroRegistrosPagina}
          onChange={(page) => {
            obterPesquisaArcevo(page);
          }}
          style={{ marginBottom: 16 }}
        />
      </Row>
    </>
  );
};
