import { render, screen, waitFor } from '~/tests/test-utils';
import { Form } from 'antd';
import InputCEP from './';
import { fireEvent } from '@testing-library/react';

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  const [form] = Form.useForm();
  return <Form form={form}>{children}</Form>;
};

describe('InputCEP', () => {
  test('renderiza o campo CEP', () => {
    render(
      <FormWrapper>
        <InputCEP inputProps={{}} />
      </FormWrapper>
    );
    expect(screen.getByLabelText('CEP')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Informe o CEP')).toBeInTheDocument();
  });

  test('aplica máscara de CEP ao digitar', async () => {
    render(
      <FormWrapper>
        <InputCEP inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o CEP');
    fireEvent.change(input, { target: { value: '12345678' } });

    await waitFor(() => {
      expect(input).toHaveValue('12345-678');
    });
  });

  test('remove caracteres não numéricos', async () => {
    render(
      <FormWrapper>
        <InputCEP inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o CEP');
    fireEvent.change(input, { target: { value: 'abc123def456' } });

    await waitFor(() => {
      expect(input).toHaveValue('123456');
    });
  });

  test('limita o tamanho máximo do campo', () => {
    render(
      <FormWrapper>
        <InputCEP inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o CEP');
    expect(input).toHaveAttribute('maxLength', '9');
  });

  test('valida CEP com 8 dígitos', async () => {
    const { container } = render(
      <FormWrapper>
        <InputCEP inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o CEP');

    fireEvent.change(input, { target: { value: '12345' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(container.querySelector('.ant-form-item-explain-error')).toBeInTheDocument();
    });
  });

  test('aceita propriedades customizadas via inputProps', () => {
    render(
      <FormWrapper>
        <InputCEP inputProps={{ disabled: true }} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o CEP');
    expect(input).toBeDisabled();
  });

  test('aceita propriedades customizadas via formItemProps', () => {
    render(
      <FormWrapper>
        <InputCEP inputProps={{}} formItemProps={{ help: 'Texto de ajuda' }} />
      </FormWrapper>
    );
    expect(screen.getByText('Texto de ajuda')).toBeInTheDocument();
  });
});
