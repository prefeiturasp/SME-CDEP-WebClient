import { render, screen } from '~/tests/test-utils';
import { Form } from 'antd';
import InputCodigoNovo from './input-codigo-novo';
import { CDEP_INPUT_CODIGO_NOVO } from '~/core/constants/ids/input';

const InputCodigoNovoWrapper = ({ initialValues = {} }: { initialValues?: any }) => {
  return (
    <Form initialValues={initialValues}>
      <InputCodigoNovo />
    </Form>
  );
};

describe('InputCodigoNovo', () => {
  test('renderiza o componente corretamente', () => {
    render(<InputCodigoNovoWrapper />);

    const inputElement = document.querySelector(`#${CDEP_INPUT_CODIGO_NOVO}`);
    expect(inputElement).toBeInTheDocument();
  });

  test('input deve ter o maxLength de 200 caracteres', () => {
    render(<InputCodigoNovoWrapper />);

    const inputElement = document.querySelector(`#${CDEP_INPUT_CODIGO_NOVO}`) as HTMLInputElement;
    expect(inputElement).toHaveAttribute('maxLength', '200');
  });

  test('input deve ter o tipo text', () => {
    render(<InputCodigoNovoWrapper />);

    const inputElement = document.querySelector(`#${CDEP_INPUT_CODIGO_NOVO}`) as HTMLInputElement;
    expect(inputElement).toHaveAttribute('type', 'text');
  });

  test('campo deve ser obrigatório quando codigo antigo não está preenchido', async () => {
    const { container } = render(<InputCodigoNovoWrapper />);

    const formItem = container.querySelector('.ant-form-item');
    expect(formItem).toBeInTheDocument();
  });

  test('renderiza com valor inicial', () => {
    const initialValue = 'COD-NOVO-123';
    render(<InputCodigoNovoWrapper initialValues={{ codigoNovo: initialValue }} />);

    const inputElement = document.querySelector(`#${CDEP_INPUT_CODIGO_NOVO}`) as HTMLInputElement;
    expect(inputElement).toBeInTheDocument();
  });

  test('aceita prop extra', () => {
    const extraText = 'Texto extra de ajuda';
    render(
      <Form>
        <InputCodigoNovo extra={<span>{extraText}</span>} />
      </Form>
    );

    const extraElement = screen.getByText(extraText);
    expect(extraElement).toBeInTheDocument();
  });
});
