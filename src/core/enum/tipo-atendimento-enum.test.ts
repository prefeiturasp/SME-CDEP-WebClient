import { TipoAtendimentoEnum, TipoAtendimentoEnumDisplay } from './tipo-atendimento-enum';

describe('TipoAtendimentoEnum', () => {
  test('deve ter valor Email igual a 1', () => {
    expect(TipoAtendimentoEnum.Email).toBe(1);
  });

  test('deve ter valor Presencial igual a 2', () => {
    expect(TipoAtendimentoEnum.Presencial).toBe(2);
  });

  test('TipoAtendimentoEnumDisplay deve ter label para Email', () => {
    expect(TipoAtendimentoEnumDisplay[TipoAtendimentoEnum.Email]).toBe('Email');
  });

  test('TipoAtendimentoEnumDisplay deve ter label para Presencial', () => {
    expect(TipoAtendimentoEnumDisplay[TipoAtendimentoEnum.Presencial]).toBe('Presencial');
  });

  test('deve conter apenas 2 tipos de atendimento', () => {
    const valores = Object.values(TipoAtendimentoEnum).filter(
      (value) => typeof value === 'number',
    );
    expect(valores.length).toBe(2);
  });

  test('TipoAtendimentoEnumDisplay deve conter labels para todos os valores', () => {
    const valores = Object.values(TipoAtendimentoEnum).filter(
      (value) => typeof value === 'number',
    ) as TipoAtendimentoEnum[];

    valores.forEach((valor) => {
      expect(TipoAtendimentoEnumDisplay[valor]).toBeDefined();
    });
  });
});
