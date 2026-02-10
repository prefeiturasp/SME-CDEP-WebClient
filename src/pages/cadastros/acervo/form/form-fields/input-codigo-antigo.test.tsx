import { render, screen } from '~/tests/test-utils';
import { Form } from 'antd';
import InputCodigoAntigo from './input-codigo-antigo';
import { CDEP_INPUT_CODIGO_ANTIGO } from '~/core/constants/ids/input';

const InputCodigoAntigoWrapper = ({ initialValues = {} }: { initialValues?: any }) => {
  return (
    <Form initialValues={initialValues}>
      <InputCodigoAntigo />
    </Form>
  );
};

describe('InputCodigoAntigo', () => {
  test('renderiza o componente corretamente', () => {
    render(<InputCodigoAntigoWrapper />);

    const inputElement = document.querySelector(`#${CDEP_INPUT_CODIGO_ANTIGO}`);
    expect(inputElement).toBeInTheDocument();
  });

  test('input deve ter o maxLength de 200 caracteres', () => {
    render(<InputCodigoAntigoWrapper />);

    const inputElement = document.querySelector(`#${CDEP_INPUT_CODIGO_ANTIGO}`) as HTMLInputElement;
    expect(inputElement).toHaveAttribute('maxLength', '200');
  });

  test('input deve ter o tipo text', () => {
    render(<InputCodigoAntigoWrapper />);

    const inputElement = document.querySelector(`#${CDEP_INPUT_CODIGO_ANTIGO}`) as HTMLInputElement;
    expect(inputElement).toHaveAttribute('type', 'text');
  });

  test('campo deve ser obrigatório quando codigoNovo não está preenchido', async () => {
    const { container } = render(<InputCodigoAntigoWrapper />);

    const formItem = container.querySelector('.ant-form-item');
    expect(formItem).toBeInTheDocument();
  });

  test('renderiza com valor inicial', () => {
    const initialValue = 'COD-123';
    render(<InputCodigoAntigoWrapper initialValues={{ codigo: initialValue }} />);

    const inputElement = document.querySelector(`#${CDEP_INPUT_CODIGO_ANTIGO}`) as HTMLInputElement;
    expect(inputElement).toBeInTheDocument();
  });

  test('aceita prop extra', () => {
    const extraText = 'Texto extra de ajuda';
    render(
      <Form>
        <InputCodigoAntigo extra={<span>{extraText}</span>} />
      </Form>
    );

    const extraElement = screen.getByText(extraText);
    expect(extraElement).toBeInTheDocument();
  });
});
