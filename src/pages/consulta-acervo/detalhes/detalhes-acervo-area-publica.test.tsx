import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  ConsultaAcervoDetalhesDTO,
  FieldAcervoDetalhesProps,
} from '~/core/dto/form-cadastro-detalhes';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import DetalhesAcervoAreaPublica from './detalhes-acervo-area-publica';

jest.mock('../components/text-content-card', () => ({
  TextItemCardContentConsultaAcervo: ({
    label,
    description,
    ellipsis,
    esconderTagsHTML,
  }: {
    label: string;
    description: React.ReactNode;
    ellipsis?: boolean;
    esconderTagsHTML?: boolean;
  }) => (
    <div
      data-testid='field-row'
      data-ellipsis={String(!!ellipsis)}
      data-html={String(!!esconderTagsHTML)}
    >
      <span>{label}</span>
      <div>{description}</div>
    </div>
  ),
}));

const ALL_FIELDS: FieldAcervoDetalhesProps[] = [
  { fieldAcervo: FieldAcervoEnum.Titulo, ellipsis: true },
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
  { fieldAcervo: FieldAcervoEnum.TamanhoArquivo },
  { fieldAcervo: FieldAcervoEnum.Cromia },
  { fieldAcervo: FieldAcervoEnum.Resolucao },
  { fieldAcervo: FieldAcervoEnum.Acessibilidade },
  { fieldAcervo: FieldAcervoEnum.Disponibilizacao },
];

const FULL_DADOS = {
  titulo: 'Livro Histórico',
  subTitulo: 'Edição Especial',
  codigo: 'TOMBO-001',
  creditosAutores: 'Autor X',
  codigoNovo: 'NOVO-001',
  material: 'Papel',
  idioma: 'Português',
  editora: 'SME',
  serieColecao: 'Série A',
  assuntos: 'Educação',
  ano: '1995',
  tipoAutoria: 'Individual',
  edicao: '2ª',
  numeroPagina: '120',
  volume: '1',
  tipoAnexo: 'PDF',
  acessosDocumentos: 'Público',
  localizacao: 'Estante B',
  notasGerais: 'Nota geral',
  isbn: '978-85-0000-000-0',
  procedencia: 'Doação',
  dataAcervo: '1995-05-10',
  copiaDigital: 'Sim',
  copia: 'Original',
  permiteUsoImagem: 'Autorizado',
  conservacao: 'Bom',
  descricao: '<p>Descrição detalhada</p>',
  duracao: '10 min',
  quantidade: '3',
  dimensoes: '20x30cm',
  tecnica: 'Impressão',
  suporte: 'Físico',
  formato: 'JPG',
  tamanhoArquivo: '2MB',
  cromia: 'Colorido',
  resolucao: '300dpi',
  acessibilidade: 'Libras',
  disponibilizacao: 'https://exemplo.com/doc1 https://exemplo.com/doc2',
} as unknown as ConsultaAcervoDetalhesDTO;

describe('DetalhesAcervoAreaPublica', () => {
  it('C18: retorna vazio quando fields está vazio ou dados é undefined', () => {
    const { container, rerender } = render(
      <DetalhesAcervoAreaPublica fields={[]} dados={FULL_DADOS} />,
    );
    expect(container.firstChild).toBeNull();

    rerender(<DetalhesAcervoAreaPublica fields={ALL_FIELDS} dados={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it('C19: renderiza todos os campos mapeados de FieldAcervoEnum, links e ignora caso default', () => {
    const fieldsComDefault: FieldAcervoDetalhesProps[] = [
      ...ALL_FIELDS,
      { fieldAcervo: 9999 as FieldAcervoEnum },
    ];

    render(<DetalhesAcervoAreaPublica fields={fieldsComDefault} dados={FULL_DADOS} />);

    expect(screen.getAllByTestId('field-row')).toHaveLength(ALL_FIELDS.length);
    expect(
      screen.getByText(`${PropsByFieldAcervoEnum[FieldAcervoEnum.Titulo].label}:`),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'https://exemplo.com/doc1' })).toHaveAttribute(
      'href',
      'https://exemplo.com/doc1',
    );
    expect(screen.getByRole('link', { name: 'https://exemplo.com/doc2' })).toHaveAttribute(
      'href',
      'https://exemplo.com/doc2',
    );
  });

  it('C20: omite campos com propriedades ausentes em dados (exceto TamanhoArquivo)', () => {
    render(
      <DetalhesAcervoAreaPublica
        fields={ALL_FIELDS}
        dados={{} as unknown as ConsultaAcervoDetalhesDTO}
      />,
    );

    expect(screen.getAllByTestId('field-row')).toHaveLength(1);
    expect(
      screen.getByText(`${PropsByFieldAcervoEnum[FieldAcervoEnum.TamanhoArquivo].label}:`),
    ).toBeInTheDocument();
  });
});
