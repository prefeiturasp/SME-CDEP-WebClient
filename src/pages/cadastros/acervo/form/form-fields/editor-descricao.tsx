import { Form } from 'antd';
import React from 'react';
import JoditEditorSME from '~/components/lib/inputs/editor/index.tsx';
import { AcervoFieldName, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';

type EditorDescricaoProps = {
  extra?: React.ReactNode;
};
const EditorDescricao: React.FC<EditorDescricaoProps> = ({ extra }) => {
  const config = {
    placeholder: 'Descrição',
  };
  return (
    <Form.Item shouldUpdate>
      {(form) => {
        const temErro = !!form.getFieldError('descricao')?.length;

        return (
          <Form.Item
            name={AcervoFieldName[FieldAcervoEnum.Descricao]}
            label='Descrição'
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
