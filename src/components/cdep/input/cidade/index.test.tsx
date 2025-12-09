import { render, screen, waitFor } from '~/tests/test-utils';
import { Form } from 'antd';
import InputCidade from './';
import { fireEvent } from '@testing-library/react';

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  const [form] = Form.useForm();
  return <Form form={form}>{children}</Form>;
};

describe('InputCidade', () => {
  test('renderiza o campo Cidade', () => {
    render(
      <FormWrapper>
        <InputCidade inputProps={{}} />
      </FormWrapper>
    );
    expect(screen.getByText('Cidade')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Informe a cidade')).toBeInTheDocument();
  });

  test('possui id INPUT_CIDADE', () => {
    render(
      <FormWrapper>
        <InputCidade inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe a cidade');
    expect(input).toHaveAttribute('id', 'INPUT_CIDADE');
  });

  test('limita o tamanho máximo a 50 caracteres', () => {
    render(
      <FormWrapper>
        <InputCidade inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe a cidade');
    expect(input).toHaveAttribute('maxLength', '50');
  });

  test('campo possui atributo aria-required', () => {
    render(
      <FormWrapper>
        <InputCidade inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe a cidade');
    expect(input).toHaveAttribute('aria-required', 'true');
  });

  test('aceita texto válido', async () => {
    const { container } = render(
      <FormWrapper>
        <InputCidade inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe a cidade');

    fireEvent.change(input, { target: { value: 'São Paulo' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(container.querySelector('.ant-form-item-explain-error')).not.toBeInTheDocument();
    });
  });

  test('aceita propriedades customizadas via inputProps', () => {
    render(
      <FormWrapper>
        <InputCidade inputProps={{ disabled: true }} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe a cidade');
    expect(input).toBeDisabled();
  });

  test('aceita propriedades customizadas via formItemProps', () => {
    render(
      <FormWrapper>
        <InputCidade inputProps={{}} formItemProps={{ help: 'Texto de ajuda' }} />
      </FormWrapper>
    );
    expect(screen.getByText('Texto de ajuda')).toBeInTheDocument();
  });

  test('permite texto até o limite máximo', () => {
    render(
      <FormWrapper>
        <InputCidade inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe a cidade');
    const textoLimite = 'A'.repeat(50);

    fireEvent.change(input, { target: { value: textoLimite } });
    expect(input).toHaveValue(textoLimite);
  });
});
