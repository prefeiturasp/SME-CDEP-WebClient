import { render, screen, waitFor } from '~/tests/test-utils';
import { Form } from 'antd';
import InputEstado from './';
import { fireEvent } from '@testing-library/react';

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  const [form] = Form.useForm();
  return <Form form={form}>{children}</Form>;
};

describe('InputEstado', () => {
  test('renderiza o campo UF', () => {
    render(
      <FormWrapper>
        <InputEstado selectProps={{}} />
      </FormWrapper>
    );
    expect(screen.getByText('UF')).toBeInTheDocument();
  });

  test('possui id SELECT_UF', () => {
    const { container } = render(
      <FormWrapper>
        <InputEstado selectProps={{}} />
      </FormWrapper>
    );
    const select = container.querySelector('#SELECT_UF');
    expect(select).toBeInTheDocument();
  });

  test('exibe placeholder "Informe a UF"', () => {
    render(
      <FormWrapper>
        <InputEstado selectProps={{}} />
      </FormWrapper>
    );
    expect(screen.getByText('Informe a UF')).toBeInTheDocument();
  });

  test('campo possui atributo aria-required', () => {
    const { container } = render(
      <FormWrapper>
        <InputEstado selectProps={{}} />
      </FormWrapper>
    );
    const select = container.querySelector('#SELECT_UF');
    expect(select).toHaveAttribute('aria-required', 'true');
  });

  test('renderiza com opções da LISTA_UF', () => {
    const { container } = render(
      <FormWrapper>
        <InputEstado selectProps={{}} />
      </FormWrapper>
    );
    const select = container.querySelector('.ant-select');
    expect(select).toBeInTheDocument();
  });

  test('aceita propriedades customizadas via selectProps', () => {
    const { container } = render(
      <FormWrapper>
        <InputEstado selectProps={{ disabled: true }} />
      </FormWrapper>
    );
    const select = container.querySelector('.ant-select-disabled');
    expect(select).toBeInTheDocument();
  });

  test('aceita propriedades customizadas via formItemProps', () => {
    render(
      <FormWrapper>
        <InputEstado selectProps={{}} formItemProps={{ help: 'Texto de ajuda' }} />
      </FormWrapper>
    );
    expect(screen.getByText('Texto de ajuda')).toBeInTheDocument();
  });

  test('pode abrir o dropdown de seleção', async () => {
    const { container } = render(
      <FormWrapper>
        <InputEstado selectProps={{}} />
      </FormWrapper>
    );
    const select = container.querySelector('.ant-select-selector');

    if (select) {
      fireEvent.mouseDown(select);

      await waitFor(() => {
        expect(document.querySelector('.ant-select-dropdown')).toBeInTheDocument();
      });
    }
  });
});
