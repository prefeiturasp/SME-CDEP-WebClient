type SuporteType = {
  INFO: string;
  ERROR: string;
  SUCCESS: string;
  WARNING: string;
};

type SystemSMEType = {
  PRIMARY: string;
  PRIMARY_DARK: string;
};
type ColorsType = {
  BACKGROUND_CONTENT: string;
  Secondary: {
    INFO: string;
  };
  SystemSME: {
    CDEP: SystemSMEType;
  };
  Components: {
    BACKGROUND_ALERT: string;
    TOOLTIP: string;
    LABEL_FILTRO_AREA_PUBLICA: string;
    BORDER_CARD_MESES_CALENDAR: string;
    BACKGROUND_CALENDARIO_DOMINGOS: string;
    BACKGROUND_CALENDARIO_DIA_EXPANDIDO: string;
    BACKGROUND_TAGS_CALENDARIO: {
      VISITA: string;
      FERIADO: string;
      SUSPENSAO: string;
    };
    BACKGROUND_TAGS_DISPONIBILIDADE: {
      ACERVO_RESERVADO: string;
      ACERVO_DISPONIVEL: string;
      ACERVO_EMPRESTADO: string;
      ACERVO_INDISPONIVEL: string;
      LABEL_ACERVO_RESERVADO: string;
      LABEL_ACERVO_DISPONIVEL: string;
      LABEL_ACERVO_EMPRESTADO: string;
    };
  };
  Suporte: {
    Primary: SuporteType;
    Secondary: SuporteType;
  };
  Neutral: {
    DARK: string;
    MEDIUM: string;
    LIGHT: string;
    LIGHTEST: string;
    WHITE: string;
  };
};

const Colors: ColorsType = {
  BACKGROUND_CONTENT: '#F5F5F5',
  Secondary: {
    INFO: '#086397',
  },
  SystemSME: {
    CDEP: {
      PRIMARY: '#89162d',
      PRIMARY_DARK: '#6d1325',
    },
  },
  Components: {
    BACKGROUND_ALERT: '#333638',
    TOOLTIP: '#086397',
    LABEL_FILTRO_AREA_PUBLICA: '#292929',
    BORDER_CARD_MESES_CALENDAR: '#CED4DA',
    BACKGROUND_CALENDARIO_DOMINGOS: '#DC8E8E40',
    BACKGROUND_CALENDARIO_DIA_EXPANDIDO: '#FFF7E1',
    BACKGROUND_TAGS_CALENDARIO: {
      VISITA: '#00585E',
      FERIADO: '#7F298C',
      SUSPENSAO: '#89162d',
    },
    BACKGROUND_TAGS_DISPONIBILIDADE: {
      ACERVO_RESERVADO: '#FFF3CD',
      ACERVO_DISPONIVEL: '#D4EBD8',
      ACERVO_EMPRESTADO: '#D1ECF1',
      ACERVO_INDISPONIVEL: '#F9D1CE',
      LABEL_ACERVO_RESERVADO: '#856404',
      LABEL_ACERVO_DISPONIVEL: '#05812F',
      LABEL_ACERVO_EMPRESTADO: '#0C5460',
    },
  },
  Suporte: {
    Primary: {
      INFO: '#086397',
      ERROR: '#B40C02',
      SUCCESS: '#297805',
      WARNING: '#C0640E',
    },
    Secondary: {
      INFO: '#5BBCF2',
      ERROR: '#FD756D',
      SUCCESS: '#8DC773',
      WARNING: '#EAAA5E',
    },
  },
  Neutral: {
    DARK: '#42474A',
    MEDIUM: '#6F777C',
    LIGHT: '#BFBFBF',
    LIGHTEST: '#F5F6F8',
    WHITE: '#FFFFFF',
  },
};

const BoxShadow = {
  DEFAULT: '0 .125rem .25rem rgba(0,0,0,.075)',
  CARD_CONTENT: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
  AFIX_HEADER: 'rgba(0, 0, 0, 0.15) 0px 1.5rem 1rem -18px',
};

export { BoxShadow, Colors };
