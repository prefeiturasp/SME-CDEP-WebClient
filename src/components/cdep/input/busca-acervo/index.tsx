import { Input, InputProps, Typography } from 'antd';
import React from 'react';

interface InputTipoAcervoConsultaProps {
  inputProps?: InputProps;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputTipoAcervoConsulta: React.FC<InputTipoAcervoConsultaProps> = ({
  inputProps,
  onChange,
}) => {
  return (
    <>
      <Typography style={{ color: '#fff', fontWeight: 'bold' }}>Busca por texto livre</Typography>
      <Input
        placeholder='Busque por título, assunto, autor ou crédito'
        {...inputProps}
        onChange={onChange}
      />
    </>
  );
};

export default InputTipoAcervoConsulta;
