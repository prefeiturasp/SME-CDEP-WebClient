import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { SemanaDTO } from '~/core/dto/calendario-evento-dto';
import { MesesEnum } from '~/core/enum/meses';
import { TipoEventoEnum } from '~/core/enum/tipo-evento-enum';
import { obterDetalheDia } from '~/core/services/calendario-eventos-service';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { Mes } from './index';

jest.mock('~/core/services/calendario-eventos-service', () => ({
  obterDetalheDia: jest.fn(),
}));

jest.mock('./detalhes-evento-dia', () => ({
  DetalhesEventoDia: (props: any) => (
    <div
      data-testid={`detalhes-evento-dia-${props.evento?.id ?? 'sem-evento'}`}
      data-tipo-visita={String(props.tipoVisita)}
      data-tipo-feriado={String(props.tipoFeriado)}
      data-tipo-suspensao={String(props.tipoSuspensao)}
      data-dia={props.diaEscolhido}
      data-mes={props.mesEscolhido}
    >
      DetalhesEventoDia Mock - Dia: {props.diaEscolhido}
    </div>
  ),
}));

describe('Mes', () => {
  const mockCarregarDadosMesSelecionado = jest.fn();
  const mockOnClickMes = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (obterDetalheDia as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: [],
    });
  });

  const semanasMock: SemanaDTO[] = [
    {
      numero: 1,
      dias: [
        {
          dia: 1,
          dayOfWeek: 0,
          desabilitado: false,
          eventosTag: [
            { tipoId: 1, tipo: 'Visita' },
            { tipoId: 2, tipo: 'Feriado' },
          ],
        },
        {
          dia: 2,
          dayOfWeek: 1,
          desabilitado: false,
          eventosTag: [{ tipoId: 3, tipo: 'Suspensão' }],
        },
        {
          dia: 3,
          dayOfWeek: 2,
          desabilitado: false,
          eventosTag: [],
        },
      ],
    },
    {
      numero: 2,
      dias: [
        {
          dia: 4,
          dayOfWeek: 3,
          desabilitado: true,
        },
      ],
    },
  ];

  const renderComponent = (props: React.ComponentProps<typeof Mes> = {}, podeIncluir = true) => {
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
        <Mes {...props} />
      </PermissaoContext.Provider>,
    );
  };

  it('deve renderizar o cabeçalho com os nomes dos dias da semana', () => {
    renderComponent({ semanas: semanasMock });

    expect(screen.getByText('Domingo')).toBeInTheDocument();
    expect(screen.getByText('Segunda')).toBeInTheDocument();
    expect(screen.getByText('Terça')).toBeInTheDocument();
    expect(screen.getByText('Quarta')).toBeInTheDocument();
    expect(screen.getByText('Quinta')).toBeInTheDocument();
    expect(screen.getByText('Sexta')).toBeInTheDocument();
    expect(screen.getByText('Sábado')).toBeInTheDocument();
  });

  it('deve renderizar sem quebrar quando semanas for undefined', () => {
    renderComponent({ semanas: undefined });

    expect(screen.getByText('Domingo')).toBeInTheDocument();
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });

  it('deve renderizar os dias das semanas e tags com Badge count quando houver múltiplos eventos', () => {
    renderComponent({ semanas: semanasMock, mesEscolhido: MesesEnum.Janeiro });

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();

    expect(screen.getByText('Visita')).toBeInTheDocument();
    expect(screen.getByText('Suspensão')).toBeInTheDocument();
    expect(screen.getAllByText('2')).toHaveLength(2);
  });

  it('deve expandir o dia e buscar detalhes quando clicado tendo permissão podeIncluir', async () => {
    (obterDetalheDia as jest.Mock).mockResolvedValueOnce({
      sucesso: true,
      dados: [
        { id: 101, tipoId: TipoEventoEnum.VISITA, solicitante: 'Carlos' },
        { id: 102, tipoId: TipoEventoEnum.FERIADO, descricao: 'Feriado Nacional' },
        { id: 103, tipoId: TipoEventoEnum.SUSPENSAO, justificativa: 'Obras' },
        { id: 104, tipoId: 99, descricao: 'Outro' },
      ],
    });

    renderComponent({
      semanas: semanasMock,
      mesEscolhido: MesesEnum.Janeiro,
      carregarDadosMesSelecionado: mockCarregarDadosMesSelecionado,
    });

    const dia1 = screen.getByText('1');
    fireEvent.click(dia1);

    await waitFor(() => {
      expect(obterDetalheDia).toHaveBeenCalledWith(1, MesesEnum.Janeiro);
    });

    expect(screen.getByTestId('detalhes-evento-dia-101')).toHaveAttribute(
      'data-tipo-visita',
      'true',
    );
    expect(screen.getByTestId('detalhes-evento-dia-101')).toHaveAttribute(
      'data-tipo-feriado',
      'false',
    );
    expect(screen.getByTestId('detalhes-evento-dia-101')).toHaveAttribute(
      'data-tipo-suspensao',
      'false',
    );

    expect(screen.getByTestId('detalhes-evento-dia-102')).toHaveAttribute(
      'data-tipo-visita',
      'false',
    );
    expect(screen.getByTestId('detalhes-evento-dia-102')).toHaveAttribute(
      'data-tipo-feriado',
      'true',
    );
    expect(screen.getByTestId('detalhes-evento-dia-102')).toHaveAttribute(
      'data-tipo-suspensao',
      'false',
    );

    expect(screen.getByTestId('detalhes-evento-dia-103')).toHaveAttribute(
      'data-tipo-visita',
      'false',
    );
    expect(screen.getByTestId('detalhes-evento-dia-103')).toHaveAttribute(
      'data-tipo-feriado',
      'false',
    );
    expect(screen.getByTestId('detalhes-evento-dia-103')).toHaveAttribute(
      'data-tipo-suspensao',
      'true',
    );

    expect(screen.getByTestId('detalhes-evento-dia-104')).toHaveAttribute(
      'data-tipo-visita',
      'false',
    );
    expect(screen.getByTestId('detalhes-evento-dia-104')).toHaveAttribute(
      'data-tipo-feriado',
      'false',
    );
    expect(screen.getByTestId('detalhes-evento-dia-104')).toHaveAttribute(
      'data-tipo-suspensao',
      'false',
    );
  });

  it('deve alternar a expansão do dia ao clicar novamente no mesmo dia (recolher)', async () => {
    (obterDetalheDia as jest.Mock).mockResolvedValueOnce({
      sucesso: true,
      dados: [{ id: 201, tipoId: TipoEventoEnum.VISITA }],
    });

    renderComponent({
      semanas: semanasMock,
      mesEscolhido: MesesEnum.Janeiro,
    });

    const dia1 = screen.getByText('1');
    fireEvent.click(dia1);

    await waitFor(() => {
      expect(screen.getByTestId('detalhes-evento-dia-201')).toBeInTheDocument();
    });

    fireEvent.click(dia1);

    expect(screen.queryByTestId('detalhes-evento-dia-201')).not.toBeInTheDocument();
  });

  it('deve exibir DetalhesEventoDia sem evento quando dados for vazio', async () => {
    (obterDetalheDia as jest.Mock).mockResolvedValueOnce({
      sucesso: true,
      dados: [],
    });

    renderComponent({
      semanas: semanasMock,
      mesEscolhido: MesesEnum.Janeiro,
      carregarDadosMesSelecionado: mockCarregarDadosMesSelecionado,
    });

    const dia3 = screen.getByText('3');
    fireEvent.click(dia3);

    await waitFor(() => {
      expect(screen.getByTestId('detalhes-evento-dia-sem-evento')).toBeInTheDocument();
    });
  });

  it('não deve atualizar dados quando obterDetalheDia retornar sucesso false', async () => {
    (obterDetalheDia as jest.Mock).mockResolvedValueOnce({
      sucesso: false,
    });

    renderComponent({
      semanas: semanasMock,
      mesEscolhido: MesesEnum.Janeiro,
    });

    fireEvent.click(screen.getByText('3'));

    await waitFor(() => {
      expect(obterDetalheDia).toHaveBeenCalledWith(3, MesesEnum.Janeiro);
    });

    expect(screen.getByTestId('detalhes-evento-dia-sem-evento')).toBeInTheDocument();
  });

  it('não deve chamar obterDetalheDia quando mesEscolhido não for fornecido', () => {
    renderComponent({
      semanas: semanasMock,
      mesEscolhido: undefined,
    });

    fireEvent.click(screen.getByText('3'));

    expect(obterDetalheDia).not.toHaveBeenCalled();
    expect(screen.getByTestId('detalhes-evento-dia-sem-evento')).toBeInTheDocument();
  });

  it('não deve disparar onClickDia quando permissao.podeIncluir for falso e o dia não possuir eventoTipoId', () => {
    renderComponent(
      {
        semanas: semanasMock,
        mesEscolhido: MesesEnum.Janeiro,
      },
      false,
    );

    const dia3 = screen.getByText('3');
    fireEvent.click(dia3);

    expect(obterDetalheDia).not.toHaveBeenCalled();
    expect(screen.queryByTestId('detalhes-evento-dia-sem-evento')).not.toBeInTheDocument();
  });

  it('deve disparar onClickDia quando permissao.podeIncluir for falso mas o dia possuir eventoTipoId', async () => {
    (obterDetalheDia as jest.Mock).mockResolvedValueOnce({
      sucesso: true,
      dados: [{ id: 301, tipoId: TipoEventoEnum.VISITA }],
    });

    renderComponent(
      {
        semanas: semanasMock,
        mesEscolhido: MesesEnum.Janeiro,
      },
      false,
    );

    const dia1 = screen.getByText('1');
    fireEvent.click(dia1);

    await waitFor(() => {
      expect(obterDetalheDia).toHaveBeenCalledWith(1, MesesEnum.Janeiro);
      expect(screen.getByTestId('detalhes-evento-dia-301')).toBeInTheDocument();
    });
  });

  it('deve resetar o dia expandido quando onClickMes for alterado', () => {
    const { rerender } = renderComponent({
      semanas: semanasMock,
      mesEscolhido: MesesEnum.Janeiro,
      onClickMes: undefined,
    });

    rerender(
      <PermissaoContext.Provider
        value={{
          desabilitarCampos: false,
          setDesabilitarCampos: jest.fn(),
          permissao: {
            customRoles: [],
            podeAlterar: true,
            podeConsultar: true,
            podeExcluir: true,
            podeIncluir: true,
          },
        }}
      >
        <Mes semanas={semanasMock} mesEscolhido={MesesEnum.Janeiro} onClickMes={mockOnClickMes} />
      </PermissaoContext.Provider>,
    );

    expect(screen.queryByTestId('detalhes-evento-dia-sem-evento')).not.toBeInTheDocument();
  });
});
