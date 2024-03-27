import { AcervoDisponibilidadeSituacaoEnum } from '~/core/enum/acervo-disponibilidade-enum';
import { Colors } from '~/core/styles/colors';

interface ConfigMapItem {
  bgColor?: string;
  labelColor?: string;
}

export const configTagAcervoDisponibilidadeMap: Record<number, ConfigMapItem> = {
  [AcervoDisponibilidadeSituacaoEnum.DISPONIVEL]: {
    bgColor: Colors.Components.BACKGROUND_TAGS_DISPONIBILIDADE.ACERVO_DISPONIVEL,
    labelColor: Colors.Components.BACKGROUND_TAGS_DISPONIBILIDADE.LABEL_ACERVO_DISPONIVEL,
  },
  [AcervoDisponibilidadeSituacaoEnum.RESERVADO]: {
    bgColor: Colors.Components.BACKGROUND_TAGS_DISPONIBILIDADE.ACERVO_RESERVADO,
    labelColor: Colors.Components.BACKGROUND_TAGS_DISPONIBILIDADE.LABEL_ACERVO_RESERVADO,
  },
  [AcervoDisponibilidadeSituacaoEnum.EMPRESTADO]: {
    bgColor: Colors.Components.BACKGROUND_TAGS_DISPONIBILIDADE.ACERVO_EMPRESTADO,
    labelColor: Colors.Components.BACKGROUND_TAGS_DISPONIBILIDADE.LABEL_ACERVO_EMPRESTADO,
  },
};
