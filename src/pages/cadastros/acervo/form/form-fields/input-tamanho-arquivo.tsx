import { Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { CDEP_INPUT_TAMANHO_ARQUIVO } from '~/core/constants/ids/input';
import { TipoAcervo } from '~/core/enum/tipo-acervo';

type InputTamanhoArquivoProps = {
  tipoAcervo?: TipoAcervo;
};

const InputTamanhoArquivo: React.FC<InputTamanhoArquivoProps> = ({ tipoAcervo }) => {
  const [required, setRequired] = useState<boolean>(true);

  const validarCampoObrigatorio = () => {
    switch (tipoAcervo) {
      case TipoAcervo.Audiovisual:
        setRequired(false);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    validarCampoObrigatorio();
  }, []);

  return (
    <Form.Item
      label='Tamanho do arquivo'
      name='tamanhoArquivo'
      rules={[{ required, whitespace: true }]}
    >
      <Input
        type='text'
        placeholder='Tamanho do arquivo'
        maxLength={15}
        id={CDEP_INPUT_TAMANHO_ARQUIVO}
      />
    </Form.Item>
  );
};

export default InputTamanhoArquivo;
