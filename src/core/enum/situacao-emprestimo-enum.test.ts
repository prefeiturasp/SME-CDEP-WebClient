import { SituacaoEmprestimoEnum, SituacaoEmprestimoEnumDisplay } from './situacao-emprestimo-enum';

describe('SituacaoEmprestimoEnum', () => {
  test('deve ter valor EMPRESTADO igual a 1', () => {
    expect(SituacaoEmprestimoEnum.EMPRESTADO).toBe(1);
  });

  test('deve ter valor DEVOLUCAO_EM_ATRASO igual a 2', () => {
    expect(SituacaoEmprestimoEnum.DEVOLUCAO_EM_ATRASO).toBe(2);
  });

  test('deve ter valor EMPRESTADO_PRORROGACAO igual a 3', () => {
    expect(SituacaoEmprestimoEnum.EMPRESTADO_PRORROGACAO).toBe(3);
  });

  test('deve ter valor DEVOLVIDO igual a 4', () => {
    expect(SituacaoEmprestimoEnum.DEVOLVIDO).toBe(4);
  });

  test('deve ter valor CANCELADO igual a 5', () => {
    expect(SituacaoEmprestimoEnum.CANCELADO).toBe(5);
  });

  test('SituacaoEmprestimoEnumDisplay deve ter label para EMPRESTADO', () => {
    expect(SituacaoEmprestimoEnumDisplay[SituacaoEmprestimoEnum.EMPRESTADO]).toBe('Emprestado');
  });

  test('SituacaoEmprestimoEnumDisplay deve ter label para DEVOLUCAO_EM_ATRASO', () => {
    expect(SituacaoEmprestimoEnumDisplay[SituacaoEmprestimoEnum.DEVOLUCAO_EM_ATRASO]).toBe(
      'Devolução em atraso',
    );
  });

  test('SituacaoEmprestimoEnumDisplay deve ter label para EMPRESTADO_PRORROGACAO', () => {
    expect(SituacaoEmprestimoEnumDisplay[SituacaoEmprestimoEnum.EMPRESTADO_PRORROGACAO]).toBe(
      'Emprestado - Prorrogação',
    );
  });

  test('SituacaoEmprestimoEnumDisplay deve ter label para DEVOLVIDO', () => {
    expect(SituacaoEmprestimoEnumDisplay[SituacaoEmprestimoEnum.DEVOLVIDO]).toBe('Devolvido');
  });

  test('SituacaoEmprestimoEnumDisplay deve ter label para CANCELADO', () => {
    expect(SituacaoEmprestimoEnumDisplay[SituacaoEmprestimoEnum.CANCELADO]).toBe('Cancelado');
  });

  test('deve conter 5 situacoes de emprestimo', () => {
    const valores = Object.values(SituacaoEmprestimoEnum).filter(
      (value) => typeof value === 'number',
    );
    expect(valores.length).toBe(5);
  });

  test('SituacaoEmprestimoEnumDisplay deve conter labels para todos os valores', () => {
    const valores = Object.values(SituacaoEmprestimoEnum).filter(
      (value) => typeof value === 'number',
    ) as SituacaoEmprestimoEnum[];

    valores.forEach((valor) => {
      expect(SituacaoEmprestimoEnumDisplay[valor]).toBeDefined();
    });
  });
});
