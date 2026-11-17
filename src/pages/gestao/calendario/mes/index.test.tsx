import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { SemanaDTO } from '~/core/dto/calendario-evento-dto';
import { DiasSemanaEnum } from '~/core/enum/dias-semana';
import { MesesEnum } from '~/core/enum/meses';
import { TipoEventoEnum } from '~/core/enum/tipo-evento-enum';
import { obterDetalheDia } from '~/core/services/calendario-eventos-service';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { Mes } from './index';

type PermissaoValue = React.ComponentProps<typeof PermissaoContext.Provider>['value'];

jest.mock('~/core/services/calendario-eventos-service', () => ({
  obterDetalheDia: jest.fn(),
}));

jest.mock('./detalhes-evento-dia', () => ({
  DetalhesEventoDia: ({
    evento,
    tipoVisita,
    tipoFeriado,
    tipoSuspensao,
    diaEscolhido,
  }: {
    evento?: { id: number };
    tipoVisita?: boolean;
    tipoFeriado?: boolean;
    tipoSuspensao?: boolean;
    diaEscolhido?: number;
  }) => (
    <div
      data-testid='detalhes-evento-dia'
      data-evento-id={evento?.id ?? 'sem-evento'}
      data-visita={String(!!tipoVisita)}
      data-feriado={String(!!tipoFeriado)}
      data-suspensao={String(!!tipoSuspensao)}
      data-dia={diaEscolhido}
    />
  ),
}));

const SEMANAS_MOCK = [
  {
    numero: 1,
    dias: [
      {
        dia: 10,
        dayOfWeek: DiasSemanaEnum.Segunda,
        desabilitado: false,
        eventosTag: [
          { tipoId: TipoEventoEnum.VISITA, tipo: 'Visita' },
          { tipoId: TipoEventoEnum.FERIADO, tipo: 'Feriado' },
        ],
      },
      {
        dia: 11,
        dayOfWeek: DiasSemanaEnum.Terça,
        desabilitado: false,
        eventosTag: [{ tipoId: TipoEventoEnum.SUSPENSAO, tipo: 'Suspensão' }],
      },
      {
        dia: 12,
        dayOfWeek: DiasSemanaEnum.Quarta,
        desabilitado: true,
        eventosTag: [],
      },
    ],
  },
] as unknown as SemanaDTO[];

describe('Mes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('C08/C09: renderiza dias da semana, tags e bloqueia clique sem permissão nem evento', () => {
    render(
      <PermissaoContext.Provider
        value={{ permissao: { podeIncluir: false } } as unknown as PermissaoValue}
      >
        <Mes mesEscolhido={MesesEnum.Janeiro} semanas={SEMANAS_MOCK} />
      </PermissaoContext.Provider>,
    );

    expect(screen.getByText('Domingo')).toBeInTheDocument();
    expect(screen.getByText('Visita')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Suspensão')).toBeInTheDocument();

    fireEvent.click(screen.getByText('12'));
    expect(obterDetalheDia).not.toHaveBeenCalled();
  });

  it('C10/C12: carrega eventos do dia ao clicar e recolhe ao clicar novamente', async () => {
    (obterDetalheDia as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: [
        { id: 1, tipoId: TipoEventoEnum.VISITA },
        { id: 2, tipoId: TipoEventoEnum.FERIADO },
        { id: 3, tipoId: TipoEventoEnum.SUSPENSAO },
      ],
    });

    render(
      <PermissaoContext.Provider
        value={{ permissao: { podeIncluir: true } } as unknown as PermissaoValue}
      >
        <Mes mesEscolhido={MesesEnum.Janeiro} semanas={SEMANAS_MOCK} onClickMes={jest.fn()} />
      </PermissaoContext.Provider>,
    );

    fireEvent.click(screen.getByText('10'));

    await waitFor(() => {
      expect(obterDetalheDia).toHaveBeenCalledWith(10, MesesEnum.Janeiro);
    });

    const detalhes = await screen.findAllByTestId('detalhes-evento-dia');
    expect(detalhes).toHaveLength(3);
    expect(detalhes[0]).toHaveAttribute('data-visita', 'true');
    expect(detalhes[1]).toHaveAttribute('data-feriado', 'true');
    expect(detalhes[2]).toHaveAttribute('data-suspensao', 'true');

    fireEvent.click(screen.getByText('10'));
    await waitFor(() => {
      expect(screen.queryByTestId('detalhes-evento-dia')).not.toBeInTheDocument();
    });
  });

  it('C11/C13: renderiza DetalhesEventoDia sem evento quando lista vazia ou sucesso=false', async () => {
    (obterDetalheDia as jest.Mock).mockResolvedValueOnce({
      sucesso: false,
    });

    const { rerender } = render(
      <PermissaoContext.Provider
        value={{ permissao: { podeIncluir: true } } as unknown as PermissaoValue}
      >
        <Mes mesEscolhido={MesesEnum.Fevereiro} semanas={SEMANAS_MOCK} />
      </PermissaoContext.Provider>,
    );

    fireEvent.click(screen.getByText('12'));

    await waitFor(() => {
      expect(obterDetalheDia).toHaveBeenCalledWith(12, MesesEnum.Fevereiro);
    });

    expect(screen.getByTestId('detalhes-evento-dia')).toHaveAttribute(
      'data-evento-id',
      'sem-evento',
    );

    rerender(
      <PermissaoContext.Provider
        value={{ permissao: { podeIncluir: true } } as unknown as PermissaoValue}
      >
        <Mes semanas={SEMANAS_MOCK} />
      </PermissaoContext.Provider>,
    );

    fireEvent.click(screen.getByText('11'));
    expect(obterDetalheDia).toHaveBeenCalledTimes(1);
  });
});
