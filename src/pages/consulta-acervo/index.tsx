import { Col, Typography } from 'antd';
import { useMemo, useState } from 'react';
import cdepLogo from '~/assets/cdep-logo-centralizado.svg';
import { PesquisaAcervoDTO } from '~/core/dto/pesquisa-acervo-dto';
import { FiltroConsultaAcervo } from './filtro-consulta-acervo';
import { ListaCardsConsultaAcervo } from './lista-cards-consulta-acervo';

export const ConsultaAcervo = () => {
  const [buscaTextoLivre, setBuscaTextoLivre] = useState<string>('');
  const [buscaTipoAcervo, setBuscaTipoAcervo] = useState<number>(0);

  const dadosFiltrado = useMemo(() => {
    const dadosGerais: PesquisaAcervoDTO[] = [
      {
        id: 1,
        tipoAcervoId: 1,
        titulo: 'titulo',
        creditoAutoria: 'creditoAutoria',
        assunto: 'assunto',
        descricao: 'descricao',
        data: 'data',
        tipoAcervoTag: 1,
        enderecoImagem: cdepLogo,
      },
      {
        id: 1,
        tipoAcervoId: 2,
        titulo: 'cachorro',
        creditoAutoria: 'creditoAutoria',
        assunto: 'assunto',
        descricao: 'descricao',
        data: 'data',
        tipoAcervoTag: 2,
        enderecoImagem: cdepLogo,
      },
      {
        id: 1,
        tipoAcervoId: 3,
        titulo: 'gato',
        creditoAutoria: 'creditoAutoria',
        assunto: 'assunto',
        descricao: 'descricao',
        data: 'data',
        tipoAcervoTag: 3,
        enderecoImagem: cdepLogo,
      },
      {
        id: 1,
        tipoAcervoId: 4,
        titulo: 'papagaio',
        creditoAutoria: 'creditoAutoria',
        assunto: 'assunto',
        descricao: 'descricao',
        data: 'data',
        tipoAcervoTag: 2,
        enderecoImagem: cdepLogo,
      },
      {
        id: 1,
        tipoAcervoId: 5,
        titulo: 'elefante',
        creditoAutoria: 'creditoAutoria',
        assunto: 'assunto',
        descricao: 'descricao',
        data: 'data',
        tipoAcervoTag: 1,
        enderecoImagem: cdepLogo,
      },
    ];

    if (!buscaTextoLivre) return dadosGerais;
    const valorFiltroMinusculo = buscaTextoLivre.toLowerCase();

    return dadosGerais.filter((item) => {
      const { titulo, creditoAutoria, assunto, descricao, tipoAcervoTag } = item;

      return (
        titulo.toLowerCase().includes(valorFiltroMinusculo) ||
        creditoAutoria.toLowerCase().includes(valorFiltroMinusculo) ||
        assunto.toLowerCase().includes(valorFiltroMinusculo) ||
        descricao.toLowerCase().includes(valorFiltroMinusculo)
      );
    });
  }, [buscaTextoLivre, buscaTipoAcervo]);

  return (
    <>
      <Typography style={{ fontSize: 20, fontWeight: 'bold', margin: '16px 0 0 16px' }}>
        Faça sua busca
      </Typography>
      <Col style={{ position: 'sticky', top: 0, zIndex: 1 }}>
        <FiltroConsultaAcervo
          setBuscaTextoLivre={setBuscaTextoLivre}
          setBuscaTipoAcervo={setBuscaTipoAcervo}
        />
      </Col>
      <ListaCardsConsultaAcervo dadosGerais={dadosFiltrado} />
    </>
  );
};
