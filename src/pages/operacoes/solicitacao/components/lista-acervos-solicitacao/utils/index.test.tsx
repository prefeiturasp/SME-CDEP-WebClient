import { AcervoDisponibilidadeSituacaoEnum } from '~/core/enum/acervo-disponibilidade-enum';
import { Colors } from '~/core/styles/colors';
import { configTagAcervoDisponibilidadeMap } from './index';

describe('configTagAcervoDisponibilidadeMap', () => {
  it('deve possuir as 4 configurações mapeadas para os status de disponibilidade', () => {
    expect(Object.keys(configTagAcervoDisponibilidadeMap)).toHaveLength(4);
  });

  it('deve retornar as cores corretas para DISPONIVEL', () => {
    const config = configTagAcervoDisponibilidadeMap[AcervoDisponibilidadeSituacaoEnum.DISPONIVEL];

    expect(config).toBeDefined();
    expect(config.bgColor).toBe(
      Colors.Components.BACKGROUND_TAGS_DISPONIBILIDADE.ACERVO_DISPONIVEL,
    );
    expect(config.labelColor).toBe(
      Colors.Components.BACKGROUND_TAGS_DISPONIBILIDADE.LABEL_ACERVO_DISPONIVEL,
    );
  });

  it('deve retornar as cores corretas para RESERVADO', () => {
    const config = configTagAcervoDisponibilidadeMap[AcervoDisponibilidadeSituacaoEnum.RESERVADO];

    expect(config).toBeDefined();
    expect(config.bgColor).toBe(Colors.Components.BACKGROUND_TAGS_DISPONIBILIDADE.ACERVO_RESERVADO);
    expect(config.labelColor).toBe(
      Colors.Components.BACKGROUND_TAGS_DISPONIBILIDADE.LABEL_ACERVO_RESERVADO,
    );
  });

  it('deve retornar as cores corretas para EMPRESTADO', () => {
    const config = configTagAcervoDisponibilidadeMap[AcervoDisponibilidadeSituacaoEnum.EMPRESTADO];

    expect(config).toBeDefined();
    expect(config.bgColor).toBe(
      Colors.Components.BACKGROUND_TAGS_DISPONIBILIDADE.ACERVO_EMPRESTADO,
    );
    expect(config.labelColor).toBe(
      Colors.Components.BACKGROUND_TAGS_DISPONIBILIDADE.LABEL_ACERVO_EMPRESTADO,
    );
  });

  it('deve retornar as cores corretas para INDISPONIVEL_PARA_RESERVA_EMPRESTIMO', () => {
    const config =
      configTagAcervoDisponibilidadeMap[
        AcervoDisponibilidadeSituacaoEnum.INDISPONIVEL_PARA_RESERVA_EMPRESTIMO
      ];

    expect(config).toBeDefined();
    expect(config.bgColor).toBe(
      Colors.Components.BACKGROUND_TAGS_DISPONIBILIDADE.ACERVO_INDISPONIVEL,
    );
    expect(config.labelColor).toBe(Colors.Suporte.Primary.ERROR);
  });

  it('deve retornar undefined para uma situação inexistente', () => {
    const config = configTagAcervoDisponibilidadeMap[9999];

    expect(config).toBeUndefined();
  });
});
