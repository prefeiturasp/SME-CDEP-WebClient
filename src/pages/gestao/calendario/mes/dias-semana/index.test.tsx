import { DiasSemanaEnum, DiasSemanaEnumEnumDisplay } from '~/core/enum/dias-semana';
import { diasSemana } from './index';

describe('diasSemana', () => {
  it('deve conter exatamente 7 dias da semana', () => {
    expect(diasSemana).toBeDefined();
    expect(diasSemana).toHaveLength(7);
  });

  it('deve conter todos os dias da semana na ordem correta de Domingo a Sábado', () => {
    const diasEsperados = [
      {
        key: DiasSemanaEnum.Domingo,
        label: DiasSemanaEnumEnumDisplay[DiasSemanaEnum.Domingo],
      },
      {
        key: DiasSemanaEnum.Segunda,
        label: DiasSemanaEnumEnumDisplay[DiasSemanaEnum.Segunda],
      },
      {
        key: DiasSemanaEnum.Terça,
        label: DiasSemanaEnumEnumDisplay[DiasSemanaEnum.Terça],
      },
      {
        key: DiasSemanaEnum.Quarta,
        label: DiasSemanaEnumEnumDisplay[DiasSemanaEnum.Quarta],
      },
      {
        key: DiasSemanaEnum.Quinta,
        label: DiasSemanaEnumEnumDisplay[DiasSemanaEnum.Quinta],
      },
      {
        key: DiasSemanaEnum.Sexta,
        label: DiasSemanaEnumEnumDisplay[DiasSemanaEnum.Sexta],
      },
      {
        key: DiasSemanaEnum.Sabado,
        label: DiasSemanaEnumEnumDisplay[DiasSemanaEnum.Sabado],
      },
    ];

    expect(diasSemana).toEqual(diasEsperados);
  });

  it('cada item deve possuir propriedades key e label válidas', () => {
    diasSemana.forEach((dia) => {
      expect(dia).toHaveProperty('key');
      expect(dia).toHaveProperty('label');
      expect(typeof dia.key).toBe('number');
      expect(typeof dia.label).toBe('string');
      expect(dia.label.length).toBeGreaterThan(0);
    });
  });
});
