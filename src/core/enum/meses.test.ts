import { MesesEnum, MesesEnumEnumDisplay } from './meses';

describe('MesesEnum', () => {
  test('deve ter Janeiro com valor 1', () => {
    expect(MesesEnum.Janeiro).toBe(1);
  });

  test('deve ter Fevereiro com valor 2', () => {
    expect(MesesEnum.Fevereiro).toBe(2);
  });

  test('deve ter Março com valor 3', () => {
    expect(MesesEnum.Março).toBe(3);
  });

  test('deve ter Dezembro com valor 12', () => {
    expect(MesesEnum.Dezembro).toBe(12);
  });

  test('deve ter exatamente 12 meses', () => {
    const meses = Object.keys(MesesEnum).filter((key) => isNaN(Number(key)));
    expect(meses).toHaveLength(12);
  });

  test('MesesEnumEnumDisplay deve ter display para Janeiro', () => {
    expect(MesesEnumEnumDisplay[MesesEnum.Janeiro]).toBe('Janeiro');
  });

  test('MesesEnumEnumDisplay deve ter display para Fevereiro', () => {
    expect(MesesEnumEnumDisplay[MesesEnum.Fevereiro]).toBe('Fevereiro');
  });

  test('MesesEnumEnumDisplay deve ter display para Dezembro', () => {
    expect(MesesEnumEnumDisplay[MesesEnum.Dezembro]).toBe('Dezembro');
  });

  test('MesesEnumEnumDisplay deve ter display para todos os meses', () => {
    expect(Object.keys(MesesEnumEnumDisplay)).toHaveLength(12);
  });

  test('todos os meses devem ter valores sequenciais de 1 a 12', () => {
    expect(MesesEnum.Janeiro).toBe(1);
    expect(MesesEnum.Fevereiro).toBe(2);
    expect(MesesEnum.Março).toBe(3);
    expect(MesesEnum.Abril).toBe(4);
    expect(MesesEnum.Maio).toBe(5);
    expect(MesesEnum.Junho).toBe(6);
    expect(MesesEnum.Julho).toBe(7);
    expect(MesesEnum.Agosto).toBe(8);
    expect(MesesEnum.Setembro).toBe(9);
    expect(MesesEnum.Outubro).toBe(10);
    expect(MesesEnum.Novembro).toBe(11);
    expect(MesesEnum.Dezembro).toBe(12);
  });
});
