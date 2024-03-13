import { AcervoDisponibilidadeEnum } from '~/core/enum/acervo-disponibilidade-enum';
import { Colors } from '~/core/styles/colors';

interface ConfigMapItem {
  bgColor?: string;
  labelColor?: string;
}

export const configTagAcervoDisponibilidadeMap: Record<number, ConfigMapItem> = {
  [AcervoDisponibilidadeEnum.ACERVO_DISPONIVEL]: {
    bgColor: Colors.Components.BACKGROUND_TAGS_DISPONIBILIDADE.ACERVO_DISPONIVEL,
    labelColor: Colors.Components.BACKGROUND_TAGS_DISPONIBILIDADE.LABEL_ACERVO_DISPONIVEL,
  },
  [AcervoDisponibilidadeEnum.ACERVO_RESERVADO]: {
    bgColor: Colors.Components.BACKGROUND_TAGS_DISPONIBILIDADE.ACERVO_RESERVADO,
    labelColor: Colors.Components.BACKGROUND_TAGS_DISPONIBILIDADE.LABEL_ACERVO_RESERVADO,
  },
  [AcervoDisponibilidadeEnum.ACERVO_EMPRESTADO]: {
    bgColor: Colors.Components.BACKGROUND_TAGS_DISPONIBILIDADE.ACERVO_EMPRESTADO,
    labelColor: Colors.Components.BACKGROUND_TAGS_DISPONIBILIDADE.LABEL_ACERVO_EMPRESTADO,
  },
};
