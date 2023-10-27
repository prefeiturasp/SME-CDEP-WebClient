import { Button, ButtonProps } from 'antd';
import React from 'react';

type LimparBuscaButtonProps = {
  buttonProps: ButtonProps;
};

const LimparBuscaButton: React.FC<LimparBuscaButtonProps> = ({ buttonProps }) => (
  <Button {...buttonProps}>Limpar busca</Button>
);

export default LimparBuscaButton;
