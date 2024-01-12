import { Form } from 'antd';
import React from 'react';
import JoditEditorSME from '~/components/lib/inputs/editor/index.tsx';
import { PropsByFieldAcervoEnum, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.Descricao];

type EditorDescricaoProps = {
  extra?: React.ReactNode;
  disabled: boolean;
};
const EditorDescricao: React.FC<EditorDescricaoProps> = ({ extra, disabled = false }) => {
  const config = {
    placeholder: fieldProps.label,
    disabled,
  };
  return (
    <Form.Item shouldUpdate>
      {(form) => {
        const temErro = !!form.getFieldError('descricao')?.length;

        return (
          <Form.Item
            name={fieldProps.name}
            label={fieldProps.label}
            rules={[{ required: true }]}
            extra={extra}
          >
            <JoditEditorSME hasError={temErro} config={config} />
          </Form.Item>
        );
      }}
    </Form.Item>
  );
};

export default EditorDescricao;
