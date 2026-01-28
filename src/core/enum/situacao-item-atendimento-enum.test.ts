import {
  SituacaoSolicitacaoItemEnum,
  SituacaoSolicitacaoItemEnumDisplay,
} from './situacao-item-atendimento-enum';

describe('SituacaoSolicitacaoItemEnum', () => {
  test('deve ter valor AGUARDANDO_ATENDIMENTO igual a 1', () => {
    expect(SituacaoSolicitacaoItemEnum.AGUARDANDO_ATENDIMENTO).toBe(1);
  });

  test('deve ter valor AGUARDANDO_VISITA igual a 2', () => {
    expect(SituacaoSolicitacaoItemEnum.AGUARDANDO_VISITA).toBe(2);
  });

  test('deve ter valor FINALIZADO_AUTOMATICAMENTE igual a 3', () => {
    expect(SituacaoSolicitacaoItemEnum.FINALIZADO_AUTOMATICAMENTE).toBe(3);
  });

  test('deve ter valor CANCELADO igual a 4', () => {
    expect(SituacaoSolicitacaoItemEnum.CANCELADO).toBe(4);
  });

  test('deve ter valor FINALIZADO_MANUALMENTE igual a 5', () => {
    expect(SituacaoSolicitacaoItemEnum.FINALIZADO_MANUALMENTE).toBe(5);
  });

  test('SituacaoSolicitacaoItemEnumDisplay deve ter label para AGUARDANDO_ATENDIMENTO', () => {
    expect(
      SituacaoSolicitacaoItemEnumDisplay[SituacaoSolicitacaoItemEnum.AGUARDANDO_ATENDIMENTO],
    ).toBe('Aguardando atendimento');
  });

  test('SituacaoSolicitacaoItemEnumDisplay deve ter label para AGUARDANDO_VISITA', () => {
    expect(SituacaoSolicitacaoItemEnumDisplay[SituacaoSolicitacaoItemEnum.AGUARDANDO_VISITA]).toBe(
      'Aguardando visita',
    );
  });

  test('SituacaoSolicitacaoItemEnumDisplay deve ter label para FINALIZADO_AUTOMATICAMENTE', () => {
    expect(
      SituacaoSolicitacaoItemEnumDisplay[SituacaoSolicitacaoItemEnum.FINALIZADO_AUTOMATICAMENTE],
    ).toBe('Finalizado automaticamente');
  });

  test('SituacaoSolicitacaoItemEnumDisplay deve ter label para CANCELADO', () => {
    expect(SituacaoSolicitacaoItemEnumDisplay[SituacaoSolicitacaoItemEnum.CANCELADO]).toBe(
      'Cancelado',
    );
  });

  test('SituacaoSolicitacaoItemEnumDisplay deve ter label para FINALIZADO_MANUALMENTE', () => {
    expect(
      SituacaoSolicitacaoItemEnumDisplay[SituacaoSolicitacaoItemEnum.FINALIZADO_MANUALMENTE],
    ).toBe('Finalizado manualmente');
  });
});
