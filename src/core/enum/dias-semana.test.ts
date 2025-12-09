import { DiasSemanaEnum, DiasSemanaEnumEnumDisplay } from './dias-semana';

describe('DiasSemanaEnum', () => {
  test('deve ter Domingo com valor 0', () => {
    expect(DiasSemanaEnum.Domingo).toBe(0);
  });

  test('deve ter Segunda com valor 1', () => {
    expect(DiasSemanaEnum.Segunda).toBe(1);
  });

  test('deve ter Terça com valor 2', () => {
    expect(DiasSemanaEnum.Terça).toBe(2);
  });

  test('deve ter Quarta com valor 3', () => {
    expect(DiasSemanaEnum.Quarta).toBe(3);
  });

  test('deve ter Quinta com valor 4', () => {
    expect(DiasSemanaEnum.Quinta).toBe(4);
  });

  test('deve ter Sexta com valor 5', () => {
    expect(DiasSemanaEnum.Sexta).toBe(5);
  });

  test('deve ter Sábado com valor 6', () => {
    expect(DiasSemanaEnum.Sabado).toBe(6);
  });

  test('deve ter exatamente 7 dias da semana', () => {
    const dias = Object.keys(DiasSemanaEnum).filter((key) => isNaN(Number(key)));
    expect(dias).toHaveLength(7);
  });

  test('DiasSemanaEnumEnumDisplay deve ter display para Domingo', () => {
    expect(DiasSemanaEnumEnumDisplay[DiasSemanaEnum.Domingo]).toBe('Domingo');
  });

  test('DiasSemanaEnumEnumDisplay deve ter display para Sábado com acento', () => {
    expect(DiasSemanaEnumEnumDisplay[DiasSemanaEnum.Sabado]).toBe('Sábado');
  });
});
