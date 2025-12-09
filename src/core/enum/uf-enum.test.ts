import { UF } from './uf-enum';

describe('UF Enum', () => {
  test('deve ter todas as 27 unidades federativas', () => {
    const todasUFs = Object.keys(UF);
    expect(todasUFs).toHaveLength(27);
  });

  test('deve ter UF de São Paulo', () => {
    expect(UF.SP).toBe('SP');
  });

  test('deve ter UF do Rio de Janeiro', () => {
    expect(UF.RJ).toBe('RJ');
  });

  test('deve ter UF de Minas Gerais', () => {
    expect(UF.MG).toBe('MG');
  });

  test('deve ter UF do Distrito Federal', () => {
    expect(UF.DF).toBe('DF');
  });

  test('deve ter UF do Acre', () => {
    expect(UF.AC).toBe('AC');
  });

  test('deve ter UF do Amazonas', () => {
    expect(UF.AM).toBe('AM');
  });

  test('deve ter UF da Bahia', () => {
    expect(UF.BA).toBe('BA');
  });

  test('deve ter UF do Rio Grande do Sul', () => {
    expect(UF.RS).toBe('RS');
  });

  test('todos os valores devem ser strings de 2 caracteres', () => {
    Object.values(UF).forEach((uf) => {
      expect(typeof uf).toBe('string');
      expect(uf.length).toBe(2);
    });
  });

  test('todos os valores devem ser maiúsculos', () => {
    Object.values(UF).forEach((uf) => {
      expect(uf).toBe(uf.toUpperCase());
    });
  });
});
