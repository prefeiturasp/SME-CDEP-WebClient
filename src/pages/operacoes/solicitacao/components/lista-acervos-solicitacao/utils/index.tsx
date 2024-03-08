import {
  AcervoDisponibilidadeEnum,
  AcervoDisponibilidadeEnumDisplay,
} from '~/core/enum/acervo-disponibilidade-enum';
import { Colors } from '~/core/styles/colors';

interface ConfigMapItem {
  valor: string;
  bgColor: string;
  labelColor: string;
}

export const configTagAcervoDisponibilidadeMap: Record<number, ConfigMapItem> = {
  [AcervoDisponibilidadeEnum.ACERVO_DISPONIVEL]: {
    bgColor: Colors.Components.BACKGROUND_TAGS_SOLICITACAO.ACERVO_DISPONIVEL,
    valor: AcervoDisponibilidadeEnumDisplay[AcervoDisponibilidadeEnum.ACERVO_DISPONIVEL],
    labelColor: Colors.Components.BACKGROUND_TAGS_SOLICITACAO.LABEL_ACERVO_DISPONIVEL,
  },
  [AcervoDisponibilidadeEnum.ACERVO_RESERVADO]: {
    bgColor: Colors.Components.BACKGROUND_TAGS_SOLICITACAO.ACERVO_RESERVADO,
    valor: AcervoDisponibilidadeEnumDisplay[AcervoDisponibilidadeEnum.ACERVO_RESERVADO],
    labelColor: Colors.Components.BACKGROUND_TAGS_SOLICITACAO.LABEL_ACERVO_RESERVADO,
  },
  [AcervoDisponibilidadeEnum.ACERVO_EMPRESTADO]: {
    bgColor: Colors.Components.BACKGROUND_TAGS_SOLICITACAO.ACERVO_EMPRESTADO,
    valor: AcervoDisponibilidadeEnumDisplay[AcervoDisponibilidadeEnum.ACERVO_EMPRESTADO],
    labelColor: Colors.Components.BACKGROUND_TAGS_SOLICITACAO.LABEL_ACERVO_EMPRESTADO,
  },
};
