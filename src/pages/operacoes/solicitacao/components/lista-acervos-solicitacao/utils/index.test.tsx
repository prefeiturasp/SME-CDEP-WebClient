import { AcervoDisponibilidadeSituacaoEnum } from '~/core/enum/acervo-disponibilidade-enum';
import { Colors } from '~/core/styles/colors';
import { configTagAcervoDisponibilidadeMap } from './index';

describe('configTagAcervoDisponibilidadeMap', () => {
  it('C06: deve mapear corretamente bgColor e labelColor para todas as situações de disponibilidade', () => {
    expect(configTagAcervoDisponibilidadeMap[AcervoDisponibilidadeSituacaoEnum.DISPONIVEL]).toEqual(
      {
        bgColor: Colors.Components.BACKGROUND_TAGS_DISPONIBILIDADE.ACERVO_DISPONIVEL,
        labelColor: Colors.Components.BACKGROUND_TAGS_DISPONIBILIDADE.LABEL_ACERVO_DISPONIVEL,
      },
    );

    expect(configTagAcervoDisponibilidadeMap[AcervoDisponibilidadeSituacaoEnum.RESERVADO]).toEqual({
      bgColor: Colors.Components.BACKGROUND_TAGS_DISPONIBILIDADE.ACERVO_RESERVADO,
      labelColor: Colors.Components.BACKGROUND_TAGS_DISPONIBILIDADE.LABEL_ACERVO_RESERVADO,
    });

    expect(configTagAcervoDisponibilidadeMap[AcervoDisponibilidadeSituacaoEnum.EMPRESTADO]).toEqual(
      {
        bgColor: Colors.Components.BACKGROUND_TAGS_DISPONIBILIDADE.ACERVO_EMPRESTADO,
        labelColor: Colors.Components.BACKGROUND_TAGS_DISPONIBILIDADE.LABEL_ACERVO_EMPRESTADO,
      },
    );

    expect(
      configTagAcervoDisponibilidadeMap[
        AcervoDisponibilidadeSituacaoEnum.INDISPONIVEL_PARA_RESERVA_EMPRESTIMO
      ],
    ).toEqual({
      bgColor: Colors.Components.BACKGROUND_TAGS_DISPONIBILIDADE.ACERVO_INDISPONIVEL,
      labelColor: Colors.Suporte.Primary.ERROR,
    });
  });
});
