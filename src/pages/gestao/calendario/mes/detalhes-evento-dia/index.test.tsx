import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { DESEJA_CANCELAR_ALTERACOES, DESEJA_EXCLUIR_SUSPENSAO } from '~/core/constants/mensagens';
import { EventoDetalheDTO } from '~/core/dto/calendario-evento-dto';
import { ROUTES } from '~/core/enum/routes';
import { TipoEventoEnum, TipoEventoEnumDisplay } from '~/core/enum/tipo-evento-enum';
import { confirmacao } from '~/core/services/alerta-service';
import { deletarSuspensao, inserirSuspensao } from '~/core/services/calendario-eventos-service';
import { notification } from '~/components/lib/notification';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { DetalhesEventoDia } from './index';

type PermissaoValue = React.ComponentProps<typeof PermissaoContext.Provider>['value'];

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
  },
}));

const renderWithPermissao = (ui: React.ReactElement, podeIncluir = true) =>
  render(
    <PermissaoContext.Provider
      value={
        {
          permissao: { podeIncluir },
        } as unknown as PermissaoValue
      }
    >
      {ui}
    </PermissaoContext.Provider>,
  );

describe('DetalhesEventoDia', () => {
  jest.setTimeout(30000);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('C01: sem eventos abre modal, valida justificativa e insere suspensão com sucesso', async () => {
    (inserirSuspensao as jest.Mock).mockResolvedValue({ sucesso: true });
    const carregarDadosMesSelecionado = jest.fn();

    renderWithPermissao(
      <DetalhesEventoDia
        mesEscolhido={5}
        diaEscolhido={12}
        carregarDadosMesSelecionado={carregarDadosMesSelecionado}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Incluir suspensão' }));
    expect(screen.getByText('Cadastro de suspensão')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Justificativa'), {
      target: { value: 'Manutenção predial' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() => {
      expect(inserirSuspensao).toHaveBeenCalledWith({
        justificativa: 'Manutenção predial',
        dia: 12,
        mes: 5,
        tipo: TipoEventoEnum.SUSPENSAO,
        descricao: TipoEventoEnumDisplay[TipoEventoEnum.SUSPENSAO],
      });
    });

    expect(notification.success).toHaveBeenCalledWith({
      message: 'Sucesso',
      description: 'A suspensão foi inserida com sucesso!',
    });
    expect(carregarDadosMesSelecionado).toHaveBeenCalledWith(5);
    await waitFor(() => {
      expect(screen.queryByText('Cadastro de suspensão')).not.toBeInTheDocument();
    });
  });

  it('C02: cancela modal diretamente sem edição e solicita confirmação quando alterado', () => {
    renderWithPermissao(<DetalhesEventoDia mesEscolhido={5} diaEscolhido={12} />);

    fireEvent.click(screen.getByRole('button', { name: 'Incluir suspensão' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(confirmacao).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Incluir suspensão' }));
    fireEvent.change(screen.getByPlaceholderText('Justificativa'), {
      target: { value: 'Texto alterado' },
    });
    (confirmacao as jest.Mock).mockImplementation(({ onOk }) => onOk());

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(confirmacao).toHaveBeenCalledWith(
      expect.objectContaining({ content: DESEJA_CANCELAR_ALTERACOES }),
    );
  });

  it('C03: exibe detalhes de visita e navega para atendimento da solicitação', () => {
    const evento = {
      id: 1,
      tipoId: TipoEventoEnum.VISITA,
      tipo: 'Visita Presencial',
      acervoSolicitacaoId: 77,
      solicitante: 'Maria Silva',
      titulo: 'Acervo Escolar',
      codigoTombo: 'T-123',
      situacaoSolicitacaoItemId: 2,
      situacaoSolicitacaoItemDescricao: 'Confirmada',
      horario: '14:00',
    } as unknown as EventoDetalheDTO;

    renderWithPermissao(<DetalhesEventoDia evento={evento} tipoVisita />);

    expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    expect(screen.getByText('Acervo Escolar')).toBeInTheDocument();
    expect(screen.getByText('T-123')).toBeInTheDocument();
    expect(screen.getByText('Confirmada')).toBeInTheDocument();
    expect(screen.getByText('14:00')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Visita Presencial' }));
    expect(mockNavigate).toHaveBeenCalledWith(`${ROUTES.ATENDIMENTO_SOLICITACOES}/77`);
  });

  it('C04: exibe detalhes de feriado', () => {
    const evento = {
      id: 2,
      tipoId: TipoEventoEnum.FERIADO,
      descricao: 'Dia da Independência',
    } as unknown as EventoDetalheDTO;

    renderWithPermissao(<DetalhesEventoDia evento={evento} tipoFeriado />);

    expect(screen.getByText('Feriado:')).toBeInTheDocument();
    expect(screen.getByText('Dia da Independência')).toBeInTheDocument();
  });

  it('C05/C06/C07: exibe suspensão, exclui com permissão e oculta botão sem permissão', async () => {
    (deletarSuspensao as jest.Mock).mockResolvedValue({ sucesso: true });
    (confirmacao as jest.Mock).mockImplementation(({ onOk }) => onOk());
    const carregarDadosMesSelecionado = jest.fn();

    const evento = {
      id: 99,
      tipoId: TipoEventoEnum.SUSPENSAO,
      justificativa: 'Dedetização',
    } as unknown as EventoDetalheDTO;

    const { rerender } = renderWithPermissao(
      <DetalhesEventoDia
        evento={evento}
        tipoSuspensao
        mesEscolhido={8}
        carregarDadosMesSelecionado={carregarDadosMesSelecionado}
      />,
      true,
    );

    expect(screen.getByText('Dedetização')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Excluir suspensão' }));

    expect(confirmacao).toHaveBeenCalledWith(
      expect.objectContaining({ content: DESEJA_EXCLUIR_SUSPENSAO }),
    );

    await waitFor(() => {
      expect(deletarSuspensao).toHaveBeenCalledWith(99);
    });
    expect(notification.success).toHaveBeenCalledWith({
      message: 'Sucesso',
      description: 'A suspensão foi excluída com sucesso!',
    });
    expect(carregarDadosMesSelecionado).toHaveBeenCalledWith(8);

    rerender(
      <PermissaoContext.Provider
        value={{ permissao: { podeIncluir: false } } as unknown as PermissaoValue}
      >
        <DetalhesEventoDia evento={evento} tipoSuspensao />
      </PermissaoContext.Provider>,
    );

    expect(screen.queryByRole('button', { name: 'Excluir suspensão' })).not.toBeInTheDocument();
    expect(screen.getByText('Dedetização')).toBeInTheDocument();
  });
});
