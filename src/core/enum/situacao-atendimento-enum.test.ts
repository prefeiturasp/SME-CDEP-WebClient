import { SituacaoSolicitacaoEnum, SituacaoSolicitacaoEnumDisplay } from './situacao-atendimento-enum';

describe('SituacaoSolicitacaoEnum', () => {
  test('deve ter valor AGUARDANDO_ATENDIMENTO igual a 1', () => {
    expect(SituacaoSolicitacaoEnum.AGUARDANDO_ATENDIMENTO).toBe(1);
  });

  test('deve ter valor FINALIZADO_ATENDIMENTO igual a 2', () => {
    expect(SituacaoSolicitacaoEnum.FINALIZADO_ATENDIMENTO).toBe(2);
  });

  test('deve ter valor AGUARDANDO_VISITA igual a 3', () => {
    expect(SituacaoSolicitacaoEnum.AGUARDANDO_VISITA).toBe(3);
  });

  test('deve ter valor CANCELADO igual a 4', () => {
    expect(SituacaoSolicitacaoEnum.CANCELADO).toBe(4);
  });

  test('deve ter valor ATENDIDO_PARCIALMENTE igual a 5', () => {
    expect(SituacaoSolicitacaoEnum.ATENDIDO_PARCIALMENTE).toBe(5);
  });

  test('SituacaoSolicitacaoEnumDisplay deve ter label para AGUARDANDO_ATENDIMENTO', () => {
    expect(SituacaoSolicitacaoEnumDisplay[SituacaoSolicitacaoEnum.AGUARDANDO_ATENDIMENTO]).toBe(
      'Aguardando atendimento',
    );
  });

  test('SituacaoSolicitacaoEnumDisplay deve ter label para FINALIZADO_ATENDIMENTO', () => {
    expect(SituacaoSolicitacaoEnumDisplay[SituacaoSolicitacaoEnum.FINALIZADO_ATENDIMENTO]).toBe(
      'Finalizado atendimento',
    );
  });

  test('SituacaoSolicitacaoEnumDisplay deve ter label para AGUARDANDO_VISITA', () => {
    expect(SituacaoSolicitacaoEnumDisplay[SituacaoSolicitacaoEnum.AGUARDANDO_VISITA]).toBe(
      'Aguardando visita',
    );
  });

  test('SituacaoSolicitacaoEnumDisplay deve ter label para CANCELADO', () => {
    expect(SituacaoSolicitacaoEnumDisplay[SituacaoSolicitacaoEnum.CANCELADO]).toBe('Cancelado');
  });

  test('SituacaoSolicitacaoEnumDisplay deve ter label para ATENDIDO_PARCIALMENTE', () => {
    expect(SituacaoSolicitacaoEnumDisplay[SituacaoSolicitacaoEnum.ATENDIDO_PARCIALMENTE]).toBe(
      'Atendido parcialmente',
    );
  });
});
