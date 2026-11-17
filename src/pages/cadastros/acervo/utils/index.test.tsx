import { FormDefaultCadastroAcervoDTO } from '~/core/dto/form-cadastro-acervo';
import { mapearDtoCadastrosAcervo } from './index';

describe('mapearDtoCadastrosAcervo', () => {
  it('C01: mapeia arquivos, ano, dimensões e coAutores quando preenchidos', () => {
    const dto = {
      arquivos: [{ codigo: 'COD-1', nome: 'doc.pdf', id: 10 }],
      ano: 2020,
      altura: 1250,
      largura: 800,
      creditosAutoresIds: [1],
      assuntosIds: [2],
      acessoDocumentosIds: [3],
      coAutores: [{ creditoAutorId: 5, creditoAutorNome: 'Autor Coautor' }],
    } as unknown as FormDefaultCadastroAcervoDTO;

    const resultado = mapearDtoCadastrosAcervo(dto);

    expect(resultado.arquivos).toEqual([{ xhr: 'COD-1', name: 'doc.pdf', id: 10, status: 'done' }]);
    expect(resultado.ano).toBe('2020');
    expect(resultado.altura).toBe('12,50');
    expect(resultado.largura).toBe('8,00');
    expect(resultado.creditosAutoresIds).toEqual([1]);
    expect(resultado.assuntosIds).toEqual([2]);
    expect(resultado.acessoDocumentosIds).toEqual([3]);
    expect(resultado.coAutores).toEqual([
      { creditoAutorId: 5, creditoAutorNome: 'Autor Coautor', value: 5, label: 'Autor Coautor' },
    ]);
    expect(resultado.listaTipoAutoria).toEqual([
      { creditoAutorId: 5, creditoAutorNome: 'Autor Coautor', value: 5, label: 'Autor Coautor' },
    ]);
  });

  it('C02/C03: inicializa listas vazias quando ausentes ou quando coAutores não tem creditoAutorId', () => {
    const dto = {
      coAutores: [{ creditoAutorNome: 'Sem ID' }],
    } as unknown as FormDefaultCadastroAcervoDTO;

    const resultado = mapearDtoCadastrosAcervo(dto);

    expect(resultado.creditosAutoresIds).toEqual([]);
    expect(resultado.assuntosIds).toEqual([]);
    expect(resultado.acessoDocumentosIds).toEqual([]);
    expect(resultado.coAutores).toEqual([]);
    expect(resultado.listaTipoAutoria).toEqual([]);
  });
});
