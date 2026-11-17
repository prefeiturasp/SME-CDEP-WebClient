import { FieldsArtesGraficas } from './artes-graficas';
import { FieldsAudiovisual } from './audiovisual';
import { FieldsBibliografico } from './bibliografico';
import { FieldsDocumentacaoTextual } from './documentacao-textual';
import { FieldsAcervoFotografico } from './fotografico';
import { FieldsTridimensional } from './tridimensional';
import { FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

describe('Form Fields Config por Tipologia', () => {
  test('FieldsArtesGraficas contém os campos esperados da tipologia', () => {
    expect(Array.isArray(FieldsArtesGraficas)).toBe(true);
    expect(FieldsArtesGraficas.length).toBeGreaterThan(0);

    const fieldEnums = FieldsArtesGraficas.map((f) => f.fieldAcervo);
    expect(fieldEnums).toContain(FieldAcervoEnum.Titulo);
    expect(fieldEnums).toContain(FieldAcervoEnum.Tombo);
    expect(fieldEnums).toContain(FieldAcervoEnum.Tecnica);
    expect(fieldEnums).toContain(FieldAcervoEnum.Suporte);
  });

  test('FieldsAudiovisual contém os campos esperados da tipologia', () => {
    expect(Array.isArray(FieldsAudiovisual)).toBe(true);
    expect(FieldsAudiovisual.length).toBeGreaterThan(0);

    const fieldEnums = FieldsAudiovisual.map((f) => f.fieldAcervo);
    expect(fieldEnums).toContain(FieldAcervoEnum.Titulo);
    expect(fieldEnums).toContain(FieldAcervoEnum.Duracao);
    expect(fieldEnums).toContain(FieldAcervoEnum.Suporte);
  });

  test('FieldsBibliografico contém os campos esperados da tipologia', () => {
    expect(Array.isArray(FieldsBibliografico)).toBe(true);
    expect(FieldsBibliografico.length).toBeGreaterThan(0);

    const fieldEnums = FieldsBibliografico.map((f) => f.fieldAcervo);
    expect(fieldEnums).toContain(FieldAcervoEnum.Titulo);
    expect(fieldEnums).toContain(FieldAcervoEnum.ISBN);
    expect(fieldEnums).toContain(FieldAcervoEnum.Editora);
    expect(fieldEnums).toContain(FieldAcervoEnum.Edicao);
    expect(fieldEnums).toContain(FieldAcervoEnum.NumeroDePaginas);
  });

  test('FieldsDocumentacaoTextual contém os campos esperados da tipologia', () => {
    expect(Array.isArray(FieldsDocumentacaoTextual)).toBe(true);
    expect(FieldsDocumentacaoTextual.length).toBeGreaterThan(0);

    const fieldEnums = FieldsDocumentacaoTextual.map((f) => f.fieldAcervo);
    expect(fieldEnums).toContain(FieldAcervoEnum.Titulo);
    expect(fieldEnums).toContain(FieldAcervoEnum.NumeroDePaginas);
    expect(fieldEnums).toContain(FieldAcervoEnum.CodigoAntigo);
    expect(fieldEnums).toContain(FieldAcervoEnum.CodigoNovo);
    expect(fieldEnums).toContain(FieldAcervoEnum.TipoDeAnexo);
  });

  test('FieldsAcervoFotografico contém os campos esperados da tipologia', () => {
    expect(Array.isArray(FieldsAcervoFotografico)).toBe(true);
    expect(FieldsAcervoFotografico.length).toBeGreaterThan(0);

    const fieldEnums = FieldsAcervoFotografico.map((f) => f.fieldAcervo);
    expect(fieldEnums).toContain(FieldAcervoEnum.Titulo);
    expect(fieldEnums).toContain(FieldAcervoEnum.CopiaDigital);
    expect(fieldEnums).toContain(FieldAcervoEnum.AutorizacaoUsoImagem);
    expect(fieldEnums).toContain(FieldAcervoEnum.EstadoConservacao);
  });

  test('FieldsTridimensional contém os campos esperados da tipologia', () => {
    expect(Array.isArray(FieldsTridimensional)).toBe(true);
    expect(FieldsTridimensional.length).toBeGreaterThan(0);

    const fieldEnums = FieldsTridimensional.map((f) => f.fieldAcervo);
    expect(fieldEnums).toContain(FieldAcervoEnum.Titulo);
    expect(fieldEnums).toContain(FieldAcervoEnum.Tombo);
    expect(fieldEnums).toContain(FieldAcervoEnum.DimensaoAltura);
    expect(fieldEnums).toContain(FieldAcervoEnum.DimensaoLargura);
    expect(fieldEnums).toContain(FieldAcervoEnum.DimensaoProfundidade);
    expect(fieldEnums).toContain(FieldAcervoEnum.DimensaoDiametro);
  });
});
