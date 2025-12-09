import { LISTA_UF } from './lista-uf';
import { UF } from '../enum/uf-enum';

describe('LISTA_UF', () => {
  test('deve conter todos os 27 estados brasileiros', () => {
    expect(LISTA_UF).toHaveLength(27);
  });

  test('deve conter São Paulo (SP)', () => {
    const sp = LISTA_UF.find((uf) => uf.value === UF.SP);
    expect(sp).toBeDefined();
    expect(sp?.label).toBe('SP');
  });

  test('deve conter Rio de Janeiro (RJ)', () => {
    const rj = LISTA_UF.find((uf) => uf.value === UF.RJ);
    expect(rj).toBeDefined();
    expect(rj?.label).toBe('RJ');
  });

  test('deve conter Distrito Federal (DF)', () => {
    const df = LISTA_UF.find((uf) => uf.value === UF.DF);
    expect(df).toBeDefined();
    expect(df?.label).toBe('DF');
  });

  test('cada item deve ter propriedades value e label', () => {
    LISTA_UF.forEach((uf) => {
      expect(uf).toHaveProperty('value');
      expect(uf).toHaveProperty('label');
    });
  });

  test('value e label devem ser iguais', () => {
    LISTA_UF.forEach((uf) => {
      expect(uf.value).toBe(uf.label);
    });
  });

  test('todas as siglas devem ter exatamente 2 caracteres', () => {
    LISTA_UF.forEach((uf) => {
      expect(uf.value.length).toBe(2);
      expect(uf.label.length).toBe(2);
    });
  });

  test('todas as siglas devem ser maiúsculas', () => {
    LISTA_UF.forEach((uf) => {
      expect(uf.value).toBe(uf.value.toUpperCase());
      expect(uf.label).toBe(uf.label.toUpperCase());
    });
  });

  test('todos os values devem ser únicos', () => {
    const values = LISTA_UF.map((uf) => uf.value);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });

  test('deve conter estados de todas as regiões', () => {
    const norte = ['AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO'];
    const nordeste = ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'];
    const centroOeste = ['DF', 'GO', 'MT', 'MS'];
    const sudeste = ['ES', 'MG', 'RJ', 'SP'];
    const sul = ['PR', 'RS', 'SC'];

    const todasRegioes = [...norte, ...nordeste, ...centroOeste, ...sudeste, ...sul];

    todasRegioes.forEach((sigla) => {
      expect(LISTA_UF.some((uf) => uf.value === sigla)).toBe(true);
    });
  });

  test('deve ser um array válido', () => {
    expect(Array.isArray(LISTA_UF)).toBe(true);
  });
});
