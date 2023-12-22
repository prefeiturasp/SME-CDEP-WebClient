import { ButtonProps } from 'antd';
import React from 'react';
import ButtonPrimary from '~/components/lib/button/primary';

export const ButtonEnviarParaMinhaSelecao: React.FC<ButtonProps> = ({ ...rest }) => (
  <ButtonPrimary
    style={{
      fontSize: 18,
      height: 40,
      borderRadius: 40,
      display: 'flex',
      alignItems: 'center',
    }}
    {...rest}
  >
    Enviar para a minha seleção
  </ButtonPrimary>
);
