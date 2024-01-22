import React from 'react';
import ButtonPrimary from '~/components/lib/button/primary';
import { CDEP_BUTTON_NOVO } from '~/core/constants/ids/button/intex';

const BtnEnviarSolicitacoes: React.FC = () => {
  const onClickEnviar = () => {
    // TODO Enviar - Chamar modal termo de compromisso
  };

  return (
    <ButtonPrimary id={CDEP_BUTTON_NOVO} onClick={() => onClickEnviar()}>
      Enviar solicitação
    </ButtonPrimary>
  );
};

export default BtnEnviarSolicitacoes;
