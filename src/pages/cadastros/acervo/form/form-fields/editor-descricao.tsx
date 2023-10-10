import { Form } from 'antd';
import JoditEditorSME from '~/components/lib/inputs/editor/index.tsx';

const EditorDescricao: React.FC = () => {
  const config = {
    placeholder: 'Descrição',
  };
  return (
    <Form.Item shouldUpdate>
      {(form) => {
        const temErro = !!form.getFieldError('descricao')?.length;

        return (
          <Form.Item name='descricao' label='Descrição' rules={[{ required: true }]}>
            <JoditEditorSME hasError={temErro} config={config} />
          </Form.Item>
        );
      }}
    </Form.Item>
  );
};

export default EditorDescricao;
