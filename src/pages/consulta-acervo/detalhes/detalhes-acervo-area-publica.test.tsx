import { render, screen } from '~/tests/test-utils';
import DetalhesAcervoAreaPublica from './detalhes-acervo-area-publica';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import {
  ConsultaAcervoDetalhesDTO,
  FieldAcervoDetalhesProps,
} from '~/core/dto/form-cadastro-detalhes';
import { TipoAcervo } from '~/core/enum/tipo-acervo';

describe('DetalhesAcervoAreaPublica', () => {
  const mockDadosCompleto: ConsultaAcervoDetalhesDTO = {
    titulo: 'O Alienista',
    subTitulo: 'Conto clássico',
    codigo: 'TOMBO-001',
    codigoNovo: 'COD-NOVO-002',
    creditosAutores: 'Machado de Assis',
    material: 'Papel',
    idioma: 'Português',
    editora: 'Editora Garnier',
    serieColecao: 'Clássicos Brasileiros',
    assuntos: 'Literatura Brasileira',
    ano: '1882',
    tipoAutoria: 'Autor principal',
    edicao: '1ª Edição',
    numeroPagina: '95',
    volume: '1',
    tipoAnexo: 'PDF',
    acessosDocumentos: 'Público',
    localizacao: 'Estante 4, Prateleira B',
    localizacaoCDD: '869.3',
    localizacaoPHA: 'PHA-12',
    notasGerais: 'Edição rara',
    isbn: '978-85-000-0000-0',
    procedencia: 'Doação',
    dataAcervo: '15/03/1882',
    copiaDigital: 'Sim',
    copia: 'Física',
    permiteUsoImagem: 'Autorizado',
    conservacao: 'Bom',
    descricao: '<p>Uma narrativa satírica.</p>',
    duracao: '2h',
    quantidade: '3 exemplares',
    dimensoes: '21x14 cm',
    tecnica: 'Tipografia',
    suporte: 'Papel pólen',
    formato: 'Livro',
    tamanhoArquivo: '15 MB',
    cromia: 'Monocromático',
    resolucao: '300 DPI',
    acessibilidade: 'Braille disponível',
    disponibilizacao: 'https://exemplo.com/acervo1 https://exemplo.com/acervo2',
    imagens: [],
    enderecoImagemPadrao: '',
    estaDisponivel: true,
    situacaoDisponibilidade: 'Disponível',
    temControleDisponibilidade: true,
    tipoAcervoId: TipoAcervo.Bibliografico,
  };

  describe('Retorno antecipado (Early return)', () => {
    test('não renderiza nada se fields for indefinido ou vazio', () => {
      const { container: container1 } = render(
        <DetalhesAcervoAreaPublica fields={[]} dados={mockDadosCompleto} />,
      );
      expect(container1).toBeEmptyDOMElement();

      const { container: container2 } = render(
        <DetalhesAcervoAreaPublica fields={undefined as any} dados={mockDadosCompleto} />,
      );
      expect(container2).toBeEmptyDOMElement();
    });

    test('não renderiza nada se dados for indefinido', () => {
      const { container } = render(
        <DetalhesAcervoAreaPublica
          fields={[{ fieldAcervo: FieldAcervoEnum.Titulo }]}
          dados={undefined}
        />,
      );
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('Renderização dos campos mapeados (switch)', () => {
    const todosCamposMapeados: FieldAcervoEnum[] = [
      FieldAcervoEnum.Titulo,
      FieldAcervoEnum.Subtitulo,
      FieldAcervoEnum.Tombo,
      FieldAcervoEnum.Credito,
      FieldAcervoEnum.CodigoAntigo,
      FieldAcervoEnum.CodigoNovo,
      FieldAcervoEnum.Material,
      FieldAcervoEnum.Idioma,
      FieldAcervoEnum.Autor,
      FieldAcervoEnum.Editora,
      FieldAcervoEnum.SerieColecao,
      FieldAcervoEnum.Assunto,
      FieldAcervoEnum.Ano,
      FieldAcervoEnum.TipoAutoria,
      FieldAcervoEnum.Edicao,
      FieldAcervoEnum.NumeroDePaginas,
      FieldAcervoEnum.Volume,
      FieldAcervoEnum.TipoDeAnexo,
      FieldAcervoEnum.AcessoDocumento,
      FieldAcervoEnum.Localizacao,
      FieldAcervoEnum.LocalizacaoCDDPHA,
      FieldAcervoEnum.NotasGerais,
      FieldAcervoEnum.ISBN,
      FieldAcervoEnum.Procedencia,
      FieldAcervoEnum.DataAcervo,
      FieldAcervoEnum.CopiaDigital,
      FieldAcervoEnum.Copia,
      FieldAcervoEnum.AutorizacaoUsoImagem,
      FieldAcervoEnum.EstadoConservacao,
      FieldAcervoEnum.Descricao,
      FieldAcervoEnum.Duracao,
      FieldAcervoEnum.Quantidade,
      FieldAcervoEnum.Dimensoes,
      FieldAcervoEnum.Tecnica,
      FieldAcervoEnum.Suporte,
      FieldAcervoEnum.FormatoImagem,
      FieldAcervoEnum.TamanhoArquivo,
      FieldAcervoEnum.Cromia,
      FieldAcervoEnum.Resolucao,
      FieldAcervoEnum.Acessibilidade,
      FieldAcervoEnum.Disponibilizacao,
    ];

    test('renderiza com sucesso todos os 41 campos mapeados quando dados estão presentes', () => {
      const fields: FieldAcervoDetalhesProps[] = todosCamposMapeados.map((fieldAcervo) => ({
        fieldAcervo,
        ellipsis: true,
      }));

      const { container } = render(
        <DetalhesAcervoAreaPublica fields={fields} dados={mockDadosCompleto} />,
      );

      todosCamposMapeados.forEach((fieldAcervo) => {
        const labelText = PropsByFieldAcervoEnum[fieldAcervo].label;
        const matchingLabels = screen.queryAllByText(labelText, { exact: false });
        expect(matchingLabels.length).toBeGreaterThan(0);
      });

      const colElements = container.querySelectorAll('.ant-col-xs-24');
      expect(colElements.length).toBe(todosCamposMapeados.length);

      colElements.forEach((col) => {
        expect(col).toHaveStyle({ marginBottom: '8px', paddingLeft: '32px' });
      });
    });

    test('renderiza corretamente links em Disponibilizacao', () => {
      render(
        <DetalhesAcervoAreaPublica
          fields={[{ fieldAcervo: FieldAcervoEnum.Disponibilizacao }]}
          dados={mockDadosCompleto}
        />,
      );

      const link1 = screen.getByRole('link', { name: 'https://exemplo.com/acervo1' });
      const link2 = screen.getByRole('link', { name: 'https://exemplo.com/acervo2' });

      expect(link1).toHaveAttribute('href', 'https://exemplo.com/acervo1');
      expect(link1).toHaveAttribute('target', '_blank');
      expect(link1).toHaveAttribute('rel', 'noopener noreferrer');

      expect(link2).toHaveAttribute('href', 'https://exemplo.com/acervo2');
      expect(link2).toHaveAttribute('target', '_blank');
      expect(link2).toHaveAttribute('rel', 'noopener noreferrer');
    });

    test('renderiza tag de disponibilidade e repassa item em Titulo', () => {
      render(
        <DetalhesAcervoAreaPublica
          fields={[{ fieldAcervo: FieldAcervoEnum.Titulo }]}
          dados={mockDadosCompleto}
        />,
      );

      expect(screen.getByText('O Alienista')).toBeInTheDocument();
      expect(screen.getByText('Disponível')).toBeInTheDocument();
    });

    test('renderiza HTML com tags escondidas em Descricao', () => {
      render(
        <DetalhesAcervoAreaPublica
          fields={[{ fieldAcervo: FieldAcervoEnum.Descricao }]}
          dados={mockDadosCompleto}
        />,
      );

      const pElement = screen.getByText('Uma narrativa satírica.');
      expect(pElement.tagName.toLowerCase()).toBe('p');
      expect(pElement).toHaveStyle({ marginBottom: '0px' });
    });
  });

  describe('Campos sem valor correspondente em dados ou não mapeados', () => {
    test('não renderiza coluna para campos cujo valor correspondente está vazio', () => {
      const dadosVazios = {
        ...mockDadosCompleto,
        titulo: '',
        subTitulo: '',
        codigo: '',
        creditosAutores: '',
        codigoNovo: '',
        material: '',
        idioma: '',
        editora: '',
        serieColecao: '',
        assuntos: '',
        ano: '',
        tipoAutoria: '',
        edicao: '',
        numeroPagina: '',
        volume: '',
        tipoAnexo: '',
        acessosDocumentos: '',
        localizacao: '',
        notasGerais: '',
        isbn: '',
        procedencia: '',
        dataAcervo: '',
        copiaDigital: '',
        copia: '',
        permiteUsoImagem: '',
        conservacao: '',
        descricao: '',
        duracao: '',
        quantidade: '',
        dimensoes: '',
        tecnica: '',
        suporte: '',
        formato: '',
        cromia: '',
        resolucao: '',
        acessibilidade: '',
        disponibilizacao: '',
      };

      const fields: FieldAcervoDetalhesProps[] = [
        { fieldAcervo: FieldAcervoEnum.Titulo },
        { fieldAcervo: FieldAcervoEnum.Subtitulo },
        { fieldAcervo: FieldAcervoEnum.Tombo },
        { fieldAcervo: FieldAcervoEnum.Credito },
        { fieldAcervo: FieldAcervoEnum.CodigoAntigo },
        { fieldAcervo: FieldAcervoEnum.CodigoNovo },
        { fieldAcervo: FieldAcervoEnum.Material },
        { fieldAcervo: FieldAcervoEnum.Idioma },
        { fieldAcervo: FieldAcervoEnum.Autor },
        { fieldAcervo: FieldAcervoEnum.Editora },
        { fieldAcervo: FieldAcervoEnum.SerieColecao },
        { fieldAcervo: FieldAcervoEnum.Assunto },
        { fieldAcervo: FieldAcervoEnum.Ano },
        { fieldAcervo: FieldAcervoEnum.TipoAutoria },
        { fieldAcervo: FieldAcervoEnum.Edicao },
        { fieldAcervo: FieldAcervoEnum.NumeroDePaginas },
        { fieldAcervo: FieldAcervoEnum.Volume },
        { fieldAcervo: FieldAcervoEnum.TipoDeAnexo },
        { fieldAcervo: FieldAcervoEnum.AcessoDocumento },
        { fieldAcervo: FieldAcervoEnum.Localizacao },
        { fieldAcervo: FieldAcervoEnum.LocalizacaoCDDPHA },
        { fieldAcervo: FieldAcervoEnum.NotasGerais },
        { fieldAcervo: FieldAcervoEnum.ISBN },
        { fieldAcervo: FieldAcervoEnum.Procedencia },
        { fieldAcervo: FieldAcervoEnum.DataAcervo },
        { fieldAcervo: FieldAcervoEnum.CopiaDigital },
        { fieldAcervo: FieldAcervoEnum.Copia },
        { fieldAcervo: FieldAcervoEnum.AutorizacaoUsoImagem },
        { fieldAcervo: FieldAcervoEnum.EstadoConservacao },
        { fieldAcervo: FieldAcervoEnum.Descricao },
        { fieldAcervo: FieldAcervoEnum.Duracao },
        { fieldAcervo: FieldAcervoEnum.Quantidade },
        { fieldAcervo: FieldAcervoEnum.Dimensoes },
        { fieldAcervo: FieldAcervoEnum.Tecnica },
        { fieldAcervo: FieldAcervoEnum.Suporte },
        { fieldAcervo: FieldAcervoEnum.FormatoImagem },
        { fieldAcervo: FieldAcervoEnum.Cromia },
        { fieldAcervo: FieldAcervoEnum.Resolucao },
        { fieldAcervo: FieldAcervoEnum.Acessibilidade },
        { fieldAcervo: FieldAcervoEnum.Disponibilizacao },
      ];

      const { container } = render(
        <DetalhesAcervoAreaPublica fields={fields} dados={dadosVazios} />,
      );

      const colElements = container.querySelectorAll('.ant-col-xs-24');
      expect(colElements.length).toBe(0);
    });

    test('lida com campo não mapeado acionando o branch default do switch', () => {
      const campoNaoMapeado: FieldAcervoDetalhesProps = {
        fieldAcervo: FieldAcervoEnum.SituacaoAcervo,
      };

      const { container } = render(
        <DetalhesAcervoAreaPublica fields={[campoNaoMapeado]} dados={mockDadosCompleto} />,
      );

      expect(container.querySelectorAll('.ant-col-xs-24').length).toBe(0);
    });
  });
});
