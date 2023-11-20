import { Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { CDEP_INPUT_TAMANHO_ARQUIVO } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';

type InputTamanhoArquivoProps = {
  tipoAcervo?: TipoAcervo;
  extra?: React.ReactNode;
};

const InputTamanhoArquivo: React.FC<InputTamanhoArquivoProps> = ({ tipoAcervo, extra }) => {
  const [required, setRequired] = useState<boolean>(true);

  const validarCampoObrigatorio = () => {
    switch (tipoAcervo) {
      case TipoAcervo.Audiovisual:
      case TipoAcervo.DocumentacaoHistorica:
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
      name={AcervoFieldName[FieldAcervoEnum.TamanhoArquivo]}
      rules={[{ required, whitespace: true }]}
      extra={extra}
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
