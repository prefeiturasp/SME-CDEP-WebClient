import { Form, FormItemProps, Input, InputProps } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { CDEP_INPUT_ANO } from '~/core/constants/ids/input';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { removerTudoQueNaoEhDigito } from '~/core/utils/functions';

type InputAnoProps = {
  tipoAcervo?: TipoAcervo;
  formItemProps?: FormItemProps;
  inputItemProps?: InputProps;
};

const InputAno: React.FC<InputAnoProps> = ({ formItemProps, inputItemProps }) => {
  const anoAtual = dayjs().year();

  return (
    <Form.Item
      label='Ano'
      name={AcervoFieldName[FieldAcervoEnum.Ano]}
      rules={[
        { required: true, whitespace: true },
        ({ getFieldValue }) => ({
          validator() {
            const ano: number = getFieldValue('ano');

            if (ano && ano > anoAtual)
              return Promise.reject(
                'O campo ano não admite anos futuros. Apenas anos atuais e anteriores são permitidos.',
              );

            return Promise.resolve();
          },
        }),
      ]}
      getValueFromEvent={(e: React.ChangeEvent<HTMLInputElement>) =>
        removerTudoQueNaoEhDigito(`${e?.target?.value}`)
      }
      {...formItemProps}
    >
      <Input type='text' placeholder='Ano' maxLength={4} id={CDEP_INPUT_ANO} {...inputItemProps} />
    </Form.Item>
  );
};

export default InputAno;
