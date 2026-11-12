import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { notification } from '~/components/lib/notification';
import { DESEJA_CANCELAR_ALTERACOES, DESEJA_EXCLUIR_SUSPENSAO } from '~/core/constants/mensagens';
import { EventoDetalheDTO } from '~/core/dto/calendario-evento-dto';
import { ROUTES } from '~/core/enum/routes';
import { TipoEventoEnum, TipoEventoEnumDisplay } from '~/core/enum/tipo-evento-enum';
import { confirmacao } from '~/core/services/alerta-service';
import { deletarSuspensao, inserirSuspensao } from '~/core/services/calendario-eventos-service';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { DetalhesEventoDia } from './index';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('~/core/services/alerta-service', () => ({
  confirmacao: jest.fn(),
}));

jest.mock('~/core/services/calendario-eventos-service', () => ({
  deletarSuspensao: jest.fn(),
  inserirSuspensao: jest.fn(),
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('DetalhesEventoDia', () => {
  const mockCarregarDadosMesSelecionado = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (
    props: React.ComponentProps<typeof DetalhesEventoDia> = {},
    podeIncluir = true,
  ) => {
    return render(
      <PermissaoContext.Provider
        value={{
          desabilitarCampos: false,
          setDesabilitarCampos: jest.fn(),
          permissao: {
            customRoles: [],
            podeAlterar: true,
            podeConsultar: true,
            podeExcluir: true,
            podeIncluir,
          },
        }}
      >
        <DetalhesEventoDia {...props} />
      </PermissaoContext.Provider>,
    );
  };

  describe('Sem evento', () => {
    it('deve renderizar botão "Incluir suspensão" quando evento não existir e abrir o modal ao clicar', () => {
      renderComponent({
        carregarDadosMesSelecionado: mockCarregarDadosMesSelecionado,
        diaEscolhido: 15,
        mesEscolhido: 8,
      });

      const botaoIncluir = screen.getByRole('button', { name: /Incluir suspensão/i });
      expect(botaoIncluir).toBeInTheDocument();

      fireEvent.click(botaoIncluir);

      expect(screen.getByText('Cadastro de suspensão')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Justificativa')).toBeInTheDocument();
    });

    it('não deve renderizar "Incluir suspensão" quando evento for fornecido', () => {
      renderComponent({
        evento: { id: 1 } as any,
      });

      expect(screen.queryByRole('button', { name: /Incluir suspensão/i })).not.toBeInTheDocument();
    });
  });

  describe('Visita Técnica (tipoVisita)', () => {
    const eventoVisita = {
      id: 10,
      tipoId: 1,
      situacaoSolicitacaoItemId: 2,
      acervoSolicitacaoId: 123,
      tipo: 'Visita Técnica',
      solicitante: 'Maria Oliveira',
      titulo: 'Documento Histórico 1890',
      codigoTombo: 'TB-9988',
      situacaoSolicitacaoItemDescricao: 'Confirmada',
      horario: '10:00 - 11:00',
    } as EventoDetalheDTO;

    it('deve exibir os detalhes da visita e navegar para o atendimento ao clicar no botão do tipo', () => {
      renderComponent({
        evento: eventoVisita,
        tipoVisita: true,
      });

      expect(screen.getByText('Nome do solicitante:')).toBeInTheDocument();
      expect(screen.getByText('Maria Oliveira')).toBeInTheDocument();
      expect(screen.getByText('Título do acervo:')).toBeInTheDocument();
      expect(screen.getByText('Documento Histórico 1890')).toBeInTheDocument();
      expect(screen.getByText('Código/Tombo:')).toBeInTheDocument();
      expect(screen.getByText('TB-9988')).toBeInTheDocument();
      expect(screen.getByText('Situação:')).toBeInTheDocument();
      expect(screen.getByText('Confirmada')).toBeInTheDocument();
      expect(screen.getByText('Horário:')).toBeInTheDocument();
      expect(screen.getByText('10:00 - 11:00')).toBeInTheDocument();

      const botaoTipo = screen.getByRole('button', { name: 'Visita Técnica' });
      fireEvent.click(botaoTipo);

      expect(mockNavigate).toHaveBeenCalledWith(`${ROUTES.ATENDIMENTO_SOLICITACOES}/123`);
    });
  });

  describe('Feriado (tipoFeriado)', () => {
    it('deve exibir os dados do feriado', () => {
      const eventoFeriado = {
        id: 5,
        tipoId: 2,
        descricao: 'Proclamação da República',
      } as EventoDetalheDTO;

      renderComponent({
        evento: eventoFeriado,
        tipoFeriado: true,
      });

      expect(screen.getByText('Feriado:')).toBeInTheDocument();
      expect(screen.getByText('Proclamação da República')).toBeInTheDocument();
    });
  });

  describe('Suspensão (tipoSuspensao)', () => {
    const eventoSuspensao = {
      id: 42,
      tipoId: TipoEventoEnum.SUSPENSAO,
      justificativa: 'Dedetização anual do prédio',
    } as EventoDetalheDTO;

    it('deve renderizar justificativa e botão de excluir quando usuário tiver permissão podeIncluir', async () => {
      (deletarSuspensao as jest.Mock).mockResolvedValueOnce({});

      renderComponent(
        {
          evento: eventoSuspensao,
          tipoSuspensao: true,
          mesEscolhido: 8,
          carregarDadosMesSelecionado: mockCarregarDadosMesSelecionado,
        },
        true,
      );

      expect(screen.getByText('Justificativa:')).toBeInTheDocument();
      expect(screen.getByText('Dedetização anual do prédio')).toBeInTheDocument();

      const botaoExcluir = screen.getByRole('button', { name: /Excluir suspensão/i });
      expect(botaoExcluir).toBeInTheDocument();

      fireEvent.click(botaoExcluir);

      expect(confirmacao).toHaveBeenCalledWith(
        expect.objectContaining({
          content: DESEJA_EXCLUIR_SUSPENSAO,
        }),
      );

      const confirmCall = (confirmacao as jest.Mock).mock.calls[0][0];
      confirmCall.onOk();

      await waitFor(() => {
        expect(deletarSuspensao).toHaveBeenCalledWith(42);
        expect(notification.success).toHaveBeenCalledWith({
          message: 'Sucesso',
          description: 'A suspensão foi excluída com sucesso!',
        });
        expect(mockCarregarDadosMesSelecionado).toHaveBeenCalledWith(8);
      });
    });

    it('deve excluir suspensão com sucesso sem chamar carregarDadosMesSelecionado se ele for omitido', async () => {
      (deletarSuspensao as jest.Mock).mockResolvedValueOnce({});

      renderComponent(
        {
          evento: eventoSuspensao,
          tipoSuspensao: true,
          mesEscolhido: 8,
        },
        true,
      );

      fireEvent.click(screen.getByRole('button', { name: /Excluir suspensão/i }));

      const confirmCall = (confirmacao as jest.Mock).mock.calls[0][0];
      confirmCall.onOk();

      await waitFor(() => {
        expect(deletarSuspensao).toHaveBeenCalledWith(42);
        expect(notification.success).toHaveBeenCalledWith({
          message: 'Sucesso',
          description: 'A suspensão foi excluída com sucesso!',
        });
        expect(mockCarregarDadosMesSelecionado).not.toHaveBeenCalled();
      });
    });

    it('deve excluir suspensão com sucesso sem chamar carregarDadosMesSelecionado se mesEscolhido for omitido', async () => {
      (deletarSuspensao as jest.Mock).mockResolvedValueOnce({});

      renderComponent(
        {
          evento: eventoSuspensao,
          tipoSuspensao: true,
          carregarDadosMesSelecionado: mockCarregarDadosMesSelecionado,
        },
        true,
      );

      fireEvent.click(screen.getByRole('button', { name: /Excluir suspensão/i }));

      const confirmCall = (confirmacao as jest.Mock).mock.calls[0][0];
      confirmCall.onOk();

      await waitFor(() => {
        expect(deletarSuspensao).toHaveBeenCalledWith(42);
        expect(notification.success).toHaveBeenCalledWith({
          message: 'Sucesso',
          description: 'A suspensão foi excluída com sucesso!',
        });
        expect(mockCarregarDadosMesSelecionado).not.toHaveBeenCalled();
      });
    });

    it('não deve chamar deletarSuspensao se item não possuir id', () => {
      const eventoSemId = {
        justificativa: 'Sem identificador',
      } as unknown as EventoDetalheDTO;

      renderComponent(
        {
          evento: eventoSemId,
          tipoSuspensao: true,
        },
        true,
      );

      fireEvent.click(screen.getByRole('button', { name: /Excluir suspensão/i }));

      const confirmCall = (confirmacao as jest.Mock).mock.calls[0][0];
      confirmCall.onOk();

      expect(deletarSuspensao).not.toHaveBeenCalled();
    });

    it('não deve renderizar o botão "Excluir suspensão" quando podeIncluir for falso', () => {
      renderComponent(
        {
          evento: eventoSuspensao,
          tipoSuspensao: true,
        },
        false,
      );

      expect(screen.getByText('Justificativa:')).toBeInTheDocument();
      expect(screen.getByText('Dedetização anual do prédio')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Excluir suspensão/i })).not.toBeInTheDocument();
    });
  });

  describe('Modal de Cadastro de Suspensão', () => {
    it('deve fechar diretamente ao cancelar se os campos não foram modificados', () => {
      renderComponent();

      fireEvent.click(screen.getByRole('button', { name: /Incluir suspensão/i }));
      expect(screen.getByText('Cadastro de suspensão')).toBeInTheDocument();

      const botaoCancelar = screen.getByRole('button', { name: /Cancelar/i });
      fireEvent.click(botaoCancelar);

      expect(confirmacao).not.toHaveBeenCalled();
    });

    it('deve exibir confirmação ao cancelar se campos foram modificados e resetar campos ao confirmar', () => {
      renderComponent();

      fireEvent.click(screen.getByRole('button', { name: /Incluir suspensão/i }));

      const inputJustificativa = screen.getByPlaceholderText('Justificativa');
      fireEvent.change(inputJustificativa, { target: { value: 'Alteração em andamento' } });

      const botaoCancelar = screen.getByRole('button', { name: /Cancelar/i });
      fireEvent.click(botaoCancelar);

      expect(confirmacao).toHaveBeenCalledWith(
        expect.objectContaining({
          content: DESEJA_CANCELAR_ALTERACOES,
        }),
      );

      const confirmCall = (confirmacao as jest.Mock).mock.calls[0][0];
      confirmCall.onOk();
    });

    it('deve salvar nova suspensão com sucesso quando o formulário for válido', async () => {
      (inserirSuspensao as jest.Mock).mockResolvedValueOnce({});

      renderComponent({
        diaEscolhido: 20,
        mesEscolhido: 9,
        carregarDadosMesSelecionado: mockCarregarDadosMesSelecionado,
      });

      fireEvent.click(screen.getByRole('button', { name: /Incluir suspensão/i }));

      const inputJustificativa = screen.getByPlaceholderText('Justificativa');
      fireEvent.change(inputJustificativa, { target: { value: 'Reforma do telhado' } });

      const botaoSalvar = screen.getByRole('button', { name: /Salvar/i });
      fireEvent.click(botaoSalvar);

      await waitFor(() => {
        expect(inserirSuspensao).toHaveBeenCalledWith({
          justificativa: 'Reforma do telhado',
          dia: 20,
          mes: 9,
          tipo: TipoEventoEnum.SUSPENSAO,
          descricao: TipoEventoEnumDisplay[TipoEventoEnum.SUSPENSAO],
        });
        expect(notification.success).toHaveBeenCalledWith({
          message: 'Sucesso',
          description: 'A suspensão foi inserida com sucesso!',
        });
        expect(mockCarregarDadosMesSelecionado).toHaveBeenCalledWith(9);
      });
    });

    it('deve salvar nova suspensão sem chamar carregarDadosMesSelecionado se a função for omitida', async () => {
      (inserirSuspensao as jest.Mock).mockResolvedValueOnce({});

      renderComponent({
        diaEscolhido: 20,
        mesEscolhido: 9,
      });

      fireEvent.click(screen.getByRole('button', { name: /Incluir suspensão/i }));

      const inputJustificativa = screen.getByPlaceholderText('Justificativa');
      fireEvent.change(inputJustificativa, { target: { value: 'Reforma sem callback' } });

      const botaoSalvar = screen.getByRole('button', { name: /Salvar/i });
      fireEvent.click(botaoSalvar);

      await waitFor(() => {
        expect(inserirSuspensao).toHaveBeenCalledWith({
          justificativa: 'Reforma sem callback',
          dia: 20,
          mes: 9,
          tipo: TipoEventoEnum.SUSPENSAO,
          descricao: TipoEventoEnumDisplay[TipoEventoEnum.SUSPENSAO],
        });
        expect(notification.success).toHaveBeenCalledWith({
          message: 'Sucesso',
          description: 'A suspensão foi inserida com sucesso!',
        });
        expect(mockCarregarDadosMesSelecionado).not.toHaveBeenCalled();
      });
    });

    it('deve salvar nova suspensão sem chamar carregarDadosMesSelecionado se mesEscolhido for omitido', async () => {
      (inserirSuspensao as jest.Mock).mockResolvedValueOnce({});

      renderComponent({
        diaEscolhido: 20,
        carregarDadosMesSelecionado: mockCarregarDadosMesSelecionado,
      });

      fireEvent.click(screen.getByRole('button', { name: /Incluir suspensão/i }));

      const inputJustificativa = screen.getByPlaceholderText('Justificativa');
      fireEvent.change(inputJustificativa, { target: { value: 'Reforma sem mes' } });

      const botaoSalvar = screen.getByRole('button', { name: /Salvar/i });
      fireEvent.click(botaoSalvar);

      await waitFor(() => {
        expect(inserirSuspensao).toHaveBeenCalledWith({
          justificativa: 'Reforma sem mes',
          dia: 20,
          mes: undefined,
          tipo: TipoEventoEnum.SUSPENSAO,
          descricao: TipoEventoEnumDisplay[TipoEventoEnum.SUSPENSAO],
        });
        expect(notification.success).toHaveBeenCalledWith({
          message: 'Sucesso',
          description: 'A suspensão foi inserida com sucesso!',
        });
        expect(mockCarregarDadosMesSelecionado).not.toHaveBeenCalled();
      });
    });
  });
});
