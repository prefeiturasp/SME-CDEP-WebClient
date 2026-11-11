import { render, screen } from '~/tests/test-utils';
import { TextItemCardContentConsultaAcervo } from './index';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { AcervoDisponibilidadeSituacaoEnum } from '~/core/enum/acervo-disponibilidade-enum';
import { configTagAcervoDisponibilidadeMap } from '~/pages/operacoes/solicitacao/components/lista-acervos-solicitacao/utils';

describe('TextItemCardContentConsultaAcervo', () => {
  describe('Renderização básica e condicional de conteúdo', () => {
    test('não renderiza nada quando description não for informada e exibirLabelSemValor for false', () => {
      const { container } = render(
        <TextItemCardContentConsultaAcervo
          label='Título: '
          description=''
          exibirLabelSemValor={false}
        />,
      );

      expect(container).toBeEmptyDOMElement();
    });

    test('não renderiza nada por padrão quando description for nula/vazia', () => {
      const { container } = render(
        <TextItemCardContentConsultaAcervo label='Autor: ' description={null as any} />,
      );

      expect(container).toBeEmptyDOMElement();
    });

    test('renderiza label mesmo com description vazia quando exibirLabelSemValor for true', () => {
      render(
        <TextItemCardContentConsultaAcervo
          label='Editora: '
          description=''
          exibirLabelSemValor={true}
        />,
      );

      expect(screen.getByText('Editora:')).toBeInTheDocument();
    });

    test('renderiza label e description corretamente como string', () => {
      render(<TextItemCardContentConsultaAcervo label='Autor: ' description='Machado de Assis' />);

      expect(screen.getByText('Autor:')).toBeInTheDocument();
      expect(screen.getByText('Machado de Assis')).toBeInTheDocument();
    });

    test('renderiza description quando for um ReactNode', () => {
      render(
        <TextItemCardContentConsultaAcervo
          label='Status: '
          description={<span data-testid='custom-node'>Ativo</span>}
        />,
      );

      expect(screen.getByText('Status:')).toBeInTheDocument();
      expect(screen.getByTestId('custom-node')).toBeInTheDocument();
      expect(screen.getByText('Ativo')).toBeInTheDocument();
    });
  });

  describe('Tooltip e Ellipsis', () => {
    test('exibe o atributo title com a description quando exibirTooltip for true e description for string', () => {
      const { container } = render(
        <TextItemCardContentConsultaAcervo
          label='Descrição: '
          description='Texto descritivo longo'
          exibirTooltip={true}
        />,
      );

      const typographyElement = container.querySelector('.ant-typography');
      expect(typographyElement).toHaveAttribute('title', 'Texto descritivo longo');
    });

    test('não exibe o atributo title quando exibirTooltip for false', () => {
      const { container } = render(
        <TextItemCardContentConsultaAcervo
          label='Descrição: '
          description='Texto descritivo longo'
          exibirTooltip={false}
        />,
      );

      const typographyElement = container.querySelector('.ant-typography');
      expect(typographyElement).toHaveAttribute('title', '');
    });

    test('não exibe o atributo title quando description não for string mesmo com exibirTooltip true', () => {
      const { container } = render(
        <TextItemCardContentConsultaAcervo
          label='Componente: '
          description={<span>Node React</span>}
          exibirTooltip={true}
        />,
      );

      const typographyElement = container.querySelector('.ant-typography');
      expect(typographyElement).toHaveAttribute('title', '');
    });

    test('aplica classe de ellipsis quando a propriedade ellipsis for true', () => {
      const { container } = render(
        <TextItemCardContentConsultaAcervo
          label='Título: '
          description='Título Muito Longo'
          ellipsis={true}
        />,
      );

      const typographyElement = container.querySelector('.ant-typography');
      expect(typographyElement).toHaveClass('ant-typography-ellipsis');
    });
  });

  describe('Parsing de HTML (esconderTagsHTML)', () => {
    test('faz o parse de HTML quando esconderTagsHTML for true e substitui tag p', () => {
      render(
        <TextItemCardContentConsultaAcervo
          label='Resumo: '
          description='<p>Primeiro parágrafo</p><span>Texto em span</span>'
          esconderTagsHTML={true}
        />,
      );

      expect(screen.getByText('Resumo:')).toBeInTheDocument();
      const pElement = screen.getByText('Primeiro parágrafo');
      expect(pElement.tagName.toLowerCase()).toBe('p');
      expect(pElement).toHaveStyle({ marginBottom: '0px' });
      expect(screen.getByText('Texto em span')).toBeInTheDocument();
    });

    test('mantém ReactNode inalterado quando esconderTagsHTML for true mas description não for string', () => {
      render(
        <TextItemCardContentConsultaAcervo
          label='Detalhe: '
          description={<strong data-testid='strong-node'>Importante</strong>}
          esconderTagsHTML={true}
        />,
      );

      expect(screen.getByTestId('strong-node')).toBeInTheDocument();
      expect(screen.getByText('Importante')).toBeInTheDocument();
    });
  });

  describe('Texto destacado (hasHighlightedText)', () => {
    test('renderiza texto com destaque quando hasHighlightedText for true e description for string', () => {
      const { container } = render(
        <TextItemCardContentConsultaAcervo
          label='Título: '
          description='Dom Casmurro'
          hasHighlightedText={true}
          termoPesquisado={['Casmurro']}
        />,
      );

      expect(screen.getByText('Título:')).toBeInTheDocument();
      const markElement = container.querySelector('mark');
      expect(markElement).toBeInTheDocument();
      expect(markElement).toHaveTextContent('Casmurro');
    });

    test('lida com description não sendo string quando hasHighlightedText for true', () => {
      render(
        <TextItemCardContentConsultaAcervo
          label='Custom: '
          description={12345 as any}
          hasHighlightedText={true}
          termoPesquisado={['123']}
        />,
      );

      expect(screen.getByText('Custom:')).toBeInTheDocument();
    });
  });

  describe('Tag de Disponibilidade para Acervo Bibliográfico', () => {
    const configDisponivel =
      configTagAcervoDisponibilidadeMap[AcervoDisponibilidadeSituacaoEnum.DISPONIVEL];
    const configIndisponivel =
      configTagAcervoDisponibilidadeMap[
        AcervoDisponibilidadeSituacaoEnum.INDISPONIVEL_PARA_RESERVA_EMPRESTIMO
      ];

    test('renderiza a tag com cor disponível quando item for bibliográfico (via tipo) e disponível', () => {
      render(
        <TextItemCardContentConsultaAcervo
          label='Exemplar: '
          description='Disponível na biblioteca'
          item={{
            tipo: TipoAcervo.Bibliografico,
            temControleDisponibilidade: true,
            estaDisponivel: true,
            situacaoDisponibilidade: 'Disponível',
          }}
        />,
      );

      const situacaoText = screen.getByText('Disponível');
      expect(situacaoText).toBeInTheDocument();
      expect(situacaoText).toHaveStyle({ color: configDisponivel.labelColor });

      const tagElement = situacaoText.closest('.ant-tag');
      expect(tagElement).toBeInTheDocument();
      expect(tagElement).toHaveClass('ant-tag-has-color');
      expect(tagElement).toHaveStyle({ backgroundColor: configDisponivel.bgColor });
    });

    test('renderiza a tag com cor indisponível quando item for bibliográfico (via tipoAcervoId) e indisponível', () => {
      render(
        <TextItemCardContentConsultaAcervo
          label='Exemplar: '
          description='Livro em empréstimo'
          item={{
            tipoAcervoId: TipoAcervo.Bibliografico,
            temControleDisponibilidade: true,
            estaDisponivel: false,
            situacaoDisponibilidade: 'Indisponível',
          }}
        />,
      );

      const situacaoText = screen.getByText('Indisponível');
      expect(situacaoText).toBeInTheDocument();
      expect(situacaoText).toHaveStyle({ color: configIndisponivel.labelColor });

      const tagElement = situacaoText.closest('.ant-tag');
      expect(tagElement).toBeInTheDocument();
      expect(tagElement).toHaveClass('ant-tag-has-color');
      expect(tagElement).toHaveStyle({ backgroundColor: configIndisponivel.bgColor });
    });

    test('não renderiza tag de disponibilidade quando o tipo não for Bibliografico', () => {
      render(
        <TextItemCardContentConsultaAcervo
          label='Vídeo: '
          description='Documentário'
          item={{
            tipo: TipoAcervo.Audiovisual,
            temControleDisponibilidade: true,
            estaDisponivel: true,
            situacaoDisponibilidade: 'Disponível',
          }}
        />,
      );

      expect(screen.queryByText('Disponível')).not.toBeInTheDocument();
    });

    test('não renderiza tag de disponibilidade quando item não for informado', () => {
      render(
        <TextItemCardContentConsultaAcervo label='Sem Item: ' description='Apenas descrição' />,
      );

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });
});
