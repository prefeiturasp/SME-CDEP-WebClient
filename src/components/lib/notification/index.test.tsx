import { render, screen, waitFor, act } from '~/tests/test-utils';
import NotificationProvider, { notification, openNotificationErrors } from './';
import { App } from 'antd';

describe('Notification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza o NotificationProvider sem erros', () => {
    const { container } = render(
      <App>
        <NotificationProvider />
      </App>,
    );
    expect(container).toBeInTheDocument();
  });

  test('NotificationProvider não renderiza conteúdo visível', () => {
    render(
      <App>
        <NotificationProvider />
      </App>,
    );
    // O componente retorna null mas o App wrapper existe
    expect(screen.queryByText('NotificationProvider')).not.toBeInTheDocument();
  });

  test('openNotificationErrors não faz nada quando recebe array vazio', () => {
    render(
      <App>
        <NotificationProvider />
      </App>,
    );

    const spy = jest.spyOn(notification, 'error');
    openNotificationErrors([]);
    expect(spy).not.toHaveBeenCalled();
  });

  test('openNotificationErrors abre uma notificação de erro', async () => {
    render(
      <App>
        <NotificationProvider />
      </App>,
    );

    await act(async () => {
      openNotificationErrors(['Erro ao processar solicitação']);
    });

    await waitFor(() => {
      expect(screen.getByText('Erro')).toBeInTheDocument();
      expect(screen.getByText('Erro ao processar solicitação')).toBeInTheDocument();
    });
  });

  test('openNotificationErrors abre múltiplas notificações de erro', async () => {
    render(
      <App>
        <NotificationProvider />
      </App>,
    );

    await act(async () => {
      openNotificationErrors(['Erro 1', 'Erro 2', 'Erro 3']);
    });

    await waitFor(() => {
      expect(screen.getByText('Erro 1')).toBeInTheDocument();
      expect(screen.getByText('Erro 2')).toBeInTheDocument();
      expect(screen.getByText('Erro 3')).toBeInTheDocument();
    });
  });

  test('openNotificationErrors exibe título "Erro" em todas as notificações', async () => {
    render(
      <App>
        <NotificationProvider />
      </App>,
    );

    await act(async () => {
      openNotificationErrors(['Mensagem de erro']);
    });

    await waitFor(() => {
      expect(screen.getByText('Erro')).toBeInTheDocument();
    });
  });

  test('notification.error pode ser chamado diretamente', async () => {
    render(
      <App>
        <NotificationProvider />
      </App>,
    );

    await act(async () => {
      notification.error({
        message: 'Erro customizado',
        description: 'Descrição do erro',
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Erro customizado')).toBeInTheDocument();
      expect(screen.getByText('Descrição do erro')).toBeInTheDocument();
    });
  });

  test('notification.success pode ser chamado', async () => {
    render(
      <App>
        <NotificationProvider />
      </App>,
    );

    await act(async () => {
      notification.success({
        message: 'Sucesso',
        description: 'Operação realizada com sucesso',
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Sucesso')).toBeInTheDocument();
      expect(screen.getByText('Operação realizada com sucesso')).toBeInTheDocument();
    });
  });

  test('notification.info pode ser chamado', async () => {
    render(
      <App>
        <NotificationProvider />
      </App>,
    );

    await act(async () => {
      notification.info({
        message: 'Informação',
        description: 'Mensagem informativa',
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Informação')).toBeInTheDocument();
      expect(screen.getByText('Mensagem informativa')).toBeInTheDocument();
    });
  });

  test('notification.warning pode ser chamado', async () => {
    render(
      <App>
        <NotificationProvider />
      </App>,
    );

    await act(async () => {
      notification.warning({
        message: 'Atenção',
        description: 'Mensagem de aviso',
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Atenção')).toBeInTheDocument();
      expect(screen.getByText('Mensagem de aviso')).toBeInTheDocument();
    });
  });
});
