import { render, screen } from '~/tests/test-utils';
import Modal from './';
import { fireEvent } from '@testing-library/react';

describe('Modal', () => {
  test('renderiza o modal quando open é true', () => {
    render(
      <Modal open={true} title="Título do Modal">
        Conteúdo do modal
      </Modal>,
    );
    expect(screen.getByText('Título do Modal')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo do modal')).toBeInTheDocument();
  });

  test('não renderiza o modal quando open é false', () => {
    render(
      <Modal open={false} title="Título do Modal">
        Conteúdo do modal
      </Modal>,
    );
    expect(screen.queryByText('Título do Modal')).not.toBeInTheDocument();
  });

  test('renderiza botões OK e Cancel por padrão', () => {
    render(
      <Modal open={true} title="Modal">
        Conteúdo
      </Modal>,
    );
    expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  test('botão OK tem tipo default', () => {
    render(
      <Modal open={true} title="Modal">
        Conteúdo
      </Modal>,
    );
    const okButton = screen.getByRole('button', { name: /ok/i });
    expect(okButton).toHaveClass('ant-btn-default');
  });

  test('botão Cancel tem tipo text', () => {
    render(
      <Modal open={true} title="Modal">
        Conteúdo
      </Modal>,
    );
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    expect(cancelButton).toHaveClass('ant-btn-text');
  });

  test('chama onOk quando botão OK é clicado', () => {
    const handleOk = jest.fn();
    render(
      <Modal open={true} title="Modal" onOk={handleOk}>
        Conteúdo
      </Modal>,
    );
    const okButton = screen.getByRole('button', { name: /ok/i });
    fireEvent.click(okButton);
    expect(handleOk).toHaveBeenCalledTimes(1);
  });

  test('chama onCancel quando botão Cancel é clicado', () => {
    const handleCancel = jest.fn();
    render(
      <Modal open={true} title="Modal" onCancel={handleCancel}>
        Conteúdo
      </Modal>,
    );
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  test('aceita propriedades customizadas para okButtonProps', () => {
    render(
      <Modal
        open={true}
        title="Modal"
        okButtonProps={{ disabled: true }}
      >
        Conteúdo
      </Modal>,
    );
    const okButton = screen.getByRole('button', { name: /ok/i });
    expect(okButton).toBeDisabled();
  });

  test('aceita propriedades customizadas para cancelButtonProps', () => {
    render(
      <Modal
        open={true}
        title="Modal"
        cancelButtonProps={{ disabled: true }}
      >
        Conteúdo
      </Modal>,
    );
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    expect(cancelButton).toBeDisabled();
  });

  test('renderiza footer customizado', () => {
    render(
      <Modal
        open={true}
        title="Modal"
        footer={<button>Custom Footer</button>}
      >
        Conteúdo
      </Modal>,
    );
    expect(screen.getByRole('button', { name: /custom footer/i })).toBeInTheDocument();
  });
});
