import { render, screen, waitFor } from '~/tests/test-utils';
import { Form } from 'antd';
import InputBairro from './';
import { fireEvent } from '@testing-library/react';

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  const [form] = Form.useForm();
  return <Form form={form}>{children}</Form>;
};

describe('InputBairro', () => {
  test('renderiza o campo Bairro', () => {
    render(
      <FormWrapper>
        <InputBairro inputProps={{}} />
      </FormWrapper>
    );
    expect(screen.getByText('Bairro')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Informe o bairro')).toBeInTheDocument();
  });

  test('possui id INPUT_BAIRRO', () => {
    render(
      <FormWrapper>
        <InputBairro inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o bairro');
    expect(input).toHaveAttribute('id', 'INPUT_BAIRRO');
  });

  test('limita o tamanho máximo a 200 caracteres', () => {
    render(
      <FormWrapper>
        <InputBairro inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o bairro');
    expect(input).toHaveAttribute('maxLength', '200');
  });

  test('campo possui atributo aria-required', () => {
    render(
      <FormWrapper>
        <InputBairro inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o bairro');
    expect(input).toHaveAttribute('aria-required', 'true');
  });

  test('aceita texto válido', async () => {
    const { container } = render(
      <FormWrapper>
        <InputBairro inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o bairro');

    fireEvent.change(input, { target: { value: 'Centro' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(container.querySelector('.ant-form-item-explain-error')).not.toBeInTheDocument();
    });
  });

  test('aceita propriedades customizadas via inputProps', () => {
    render(
      <FormWrapper>
        <InputBairro inputProps={{ disabled: true }} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o bairro');
    expect(input).toBeDisabled();
  });

  test('aceita propriedades customizadas via formItemProps', () => {
    render(
      <FormWrapper>
        <InputBairro inputProps={{}} formItemProps={{ help: 'Texto de ajuda' }} />
      </FormWrapper>
    );
    expect(screen.getByText('Texto de ajuda')).toBeInTheDocument();
  });

  test('permite texto longo até o limite máximo', () => {
    render(
      <FormWrapper>
        <InputBairro inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o bairro');
    const textoLongo = 'A'.repeat(200);

    fireEvent.change(input, { target: { value: textoLongo } });
    expect(input).toHaveValue(textoLongo);
  });
});
