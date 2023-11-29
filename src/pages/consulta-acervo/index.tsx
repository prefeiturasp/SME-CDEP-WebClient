import { Col, Row, Typography } from 'antd';
import Pagination from 'antd/es/pagination';
import { useEffect, useState } from 'react';
import { PesquisaAcervoDTO } from '~/core/dto/pesquisa-acervo-dto';
import { pesquisarAcervos } from '~/core/services/acervo-service';
import { FiltroConsultaAcervo } from './filtro-consulta-acervo';
import { ListaCardsConsultaAcervo } from './lista-cards-consulta-acervo';

export const ConsultaAcervo = () => {
  const [buscaTextoLivre, setBuscaTextoLivre] = useState<string>('');
  const [dadosFiltro, setDadosFiltro] = useState<PesquisaAcervoDTO[]>([]);
  const [buscaTipoAcervoSelecionado, setBuscaTipoAcervoSelecionado] = useState<number | null>(null);

  const [numeroRegistrosPagina, setNumeroRegistrosPagina] = useState(5);
  const [numeroRegistros, setNumeroRegistros] = useState(1);
  const [numeroPaginaSelecionada, setNumeroPaginaSelecionada] = useState(1);

  const obterPesquisaArcevo = async (pagina: number, quantidadePagina: number) => {
    if (buscaTextoLivre && buscaTextoLivre.length < 3) return;

    const resposta = await pesquisarAcervos(
      pagina,
      quantidadePagina,
      buscaTextoLivre,
      buscaTipoAcervoSelecionado,
    );

    if (resposta?.sucesso) {
      setNumeroRegistrosPagina(quantidadePagina);
      setNumeroRegistros(resposta?.dados?.totalRegistros);
      setDadosFiltro(resposta?.dados?.items);
      setNumeroPaginaSelecionada(pagina);
    }
  };

  useEffect(() => {
    obterPesquisaArcevo(1, numeroRegistrosPagina);
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
      <ListaCardsConsultaAcervo dadosGerais={dadosFiltro} />
      <Row align='middle' justify='center'>
        <Pagination
          showSizeChanger
          hideOnSinglePage
          defaultCurrent={1}
          current={numeroPaginaSelecionada}
          total={numeroRegistros}
          locale={{ items_per_page: '' }}
          pageSize={numeroRegistrosPagina}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          onChange={(page, pageSize) => obterPesquisaArcevo(page, pageSize)}
          style={{ marginBottom: 16 }}
        />
      </Row>
    </>
  );
};
