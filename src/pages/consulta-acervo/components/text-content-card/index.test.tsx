import { render, screen } from '@testing-library/react';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { TextItemCardContentConsultaAcervo } from './index';

describe('TextItemCardContentConsultaAcervo', () => {
  it('C10: não renderiza quando description está vazia e exibirLabelSemValor=false; renderiza quando true', () => {
    const { container, rerender } = render(
      <TextItemCardContentConsultaAcervo label='Título: ' description='' />,
    );
    expect(container.firstChild).toBeNull();

    rerender(
      <TextItemCardContentConsultaAcervo label='Título: ' description='' exibirLabelSemValor />,
    );
    expect(screen.getByText('Título:')).toBeInTheDocument();
  });

  it('C11: processa tags HTML quando esconderTagsHTML=true e preserva ReactNode', () => {
    const { rerender } = render(
      <TextItemCardContentConsultaAcervo
        label='Descrição: '
        description='<p>Parágrafo teste</p><span>Span teste</span>'
        esconderTagsHTML
      />,
    );
    expect(screen.getByText('Parágrafo teste')).toBeInTheDocument();

    rerender(
      <TextItemCardContentConsultaAcervo
        label='Links: '
        description={<span data-testid='custom-node'>Link</span>}
        esconderTagsHTML
      />,
    );
    expect(screen.getByTestId('custom-node')).toBeInTheDocument();
  });

  it('C12: aplica HighlightedText quando hasHighlightedText=true para string e fallback não-string', () => {
    const { rerender } = render(
      <TextItemCardContentConsultaAcervo
        label='Autor: '
        description='Paulo Freire'
        hasHighlightedText
        termoPesquisado={['Paulo']}
      />,
    );
    expect(screen.getByText('Paulo')).toBeInTheDocument();

    rerender(
      <TextItemCardContentConsultaAcervo
        label='Autor: '
        description={<span>Outro</span>}
        hasHighlightedText
      />,
    );
    expect(screen.getByText('Autor:')).toBeInTheDocument();
  });

  it('C13: exibe tag de disponibilidade para acervo bibliográfico e tooltip quando exibirTooltip=true', () => {
    const { rerender } = render(
      <TextItemCardContentConsultaAcervo
        label='Título: '
        description='Livro A'
        exibirTooltip
        item={{
          tipo: TipoAcervo.Bibliografico,
          temControleDisponibilidade: true,
          estaDisponivel: true,
          situacaoDisponibilidade: 'Disponível',
        }}
      />,
    );

    expect(screen.getByText('Disponível')).toBeInTheDocument();
    expect(screen.getByTitle('Livro A')).toBeInTheDocument();

    rerender(
      <TextItemCardContentConsultaAcervo
        label='Título: '
        description='Livro B'
        item={{
          tipoAcervoId: TipoAcervo.Bibliografico,
          temControleDisponibilidade: true,
          estaDisponivel: false,
          situacaoDisponibilidade: 'Indisponível',
        }}
      />,
    );
    expect(screen.getByText('Indisponível')).toBeInTheDocument();
  });
});
