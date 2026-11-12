import { fireEvent, render, screen } from '@testing-library/react';
import {
  CDEP_BUTTON_CANCELAR,
  CDEP_BUTTON_NOVA_SOLICITACAO,
  CDEP_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { CDEP_INPUT_NUMERO_SOLICITACAO } from '~/core/constants/ids/input';
import { ROUTES } from '~/core/enum/routes';
import { TipoPerfil } from '~/core/enum/tipo-perfil-enum';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { ListAtendimentoSolicitacoes } from './index';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

let mockPerfilState: any = {
  perfilSelecionado: {
    perfil: TipoPerfil.ADMIN_GERAL,
  },
};

jest.mock('~/core/hooks/use-redux', () => ({
  useAppSelector: (selector: any) =>
    selector({
      perfil: mockPerfilState,
    }),
}));

let lastDataTableProps: any = null;

jest.mock('~/components/lib/data-table', () => {
  return function MockDataTable(props: any) {
    lastDataTableProps = props;
    const { columns, onRow } = props;

    const mockData = [
      {
        acervoSolicitacaoId: 101,
        tipoAcervo: 'Bibliográfico',
        titulo: 'Título Curto',
        dataCriacao: '10/05/2026',
        solicitante: 'Maria Silva',
        responsavel: 'Carlos Atendente',
        dataVisita: '12/05/2026 14:00',
        situacao: 'Em atendimento',
        situacaoEmprestimo: 'Emprestado',
      },
      {
        acervoSolicitacaoId: 102,
        tipoAcervo: 'Audiovisual',
        titulo: 'A'.repeat(120),
        dataCriacao: '11/05/2026',
        solicitante: 'José Santos',
        responsavel: 'Carlos Atendente',
        dataVisita: '',
        situacao: 'Finalizado',
        situacaoEmprestimo: '',
      },
      {
        acervoSolicitacaoId: 103,
        tipoAcervo: 'Não Bibliográfico',
        titulo: '',
        dataCriacao: '12/05/2026',
        solicitante: 'Ana Oliveira',
        responsavel: 'Carlos Atendente',
        dataVisita: null,
        situacao: 'Pendente',
        situacaoEmprestimo: null,
      },
    ];

    return (
      <table data-testid='data-table'>
        <thead>
          <tr>
            {columns?.map((col: any, index: number) => (
              <th key={col.title ?? col.dataIndex ?? index}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mockData.map((linha: any, index: number) => {
            const rowProps = onRow ? onRow(linha, index) : {};
            return (
              <tr
                key={linha.acervoSolicitacaoId ?? index}
                data-testid={`linha-${linha.acervoSolicitacaoId}`}
                {...rowProps}
              >
                {columns?.map((col: any, colIdx: number) => {
                  const val = col.dataIndex ? linha[col.dataIndex] : undefined;
                  return (
                    <td key={col.title ?? col.dataIndex ?? colIdx}>
                      {col.render ? col.render(val, linha, index) : val}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };
});

jest.mock('~/components/cdep/input/tipo-acervo', () => ({
  __esModule: true,
  default: ({ selectProps, formItemProps }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Form } = require('antd');
    const MockChild = ({ value = '', onChange }: any) => (
      <input
        data-testid='mock-select-tipo-acervo'
        value={value}
        onChange={(e) => {
          onChange?.(e.target.value);
          selectProps?.onChange?.(e.target.value);
        }}
      />
    );
    return (
      <Form.Item name='tipoAcervo' {...formItemProps}>
        <MockChild />
      </Form.Item>
    );
  },
}));

jest.mock('~/components/cdep/range-picker', () => ({
  __esModule: true,
  RangePicker: ({ rangerPickerProps, formItemProps }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Form } = require('antd');
    const MockChild = ({ onChange }: any) => (
      <button
        type='button'
        data-testid={`mock-range-picker-${formItemProps?.name}`}
        onClick={() => {
          onChange?.(['2026-05-01', '2026-05-31']);
          rangerPickerProps?.onChange?.();
        }}
      >
        {formItemProps?.label}
      </button>
    );

    return (
      <Form.Item {...formItemProps}>
        <MockChild />
      </Form.Item>
    );
  },
}));

jest.mock('~/components/cdep/input/responsaveis', () => ({
  __esModule: true,
  default: ({ selectProps, formItemProps }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Form } = require('antd');
    const MockChild = ({ value = '', onChange }: any) => (
      <input
        data-testid='mock-select-responsaveis'
        value={value}
        onChange={(e) => {
          onChange?.(e.target.value);
          selectProps?.onChange?.(e.target.value);
        }}
      />
    );
    return (
      <Form.Item name='responsavel' {...formItemProps}>
        <MockChild />
      </Form.Item>
    );
  },
}));

jest.mock('~/components/cdep/input/situacao-atendimento', () => ({
  __esModule: true,
  SelectSituacaoAtendimento: ({ selectProps, formItemProps }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Form } = require('antd');
    const MockChild = ({ value = '', onChange }: any) => (
      <input
        data-testid='mock-select-situacao-atendimento'
        value={value}
        onChange={(e) => {
          onChange?.(e.target.value);
          selectProps?.onChange?.(e.target.value);
        }}
      />
    );
    return (
      <Form.Item name='situacaoItem' {...formItemProps}>
        <MockChild />
      </Form.Item>
    );
  },
}));

jest.mock('~/components/cdep/input/situacao-emprestimo', () => ({
  __esModule: true,
  SelectSituacaoEmprestimo: ({ selectProps, formItemProps }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Form } = require('antd');
    const MockChild = ({ value = '', onChange }: any) => (
      <input
        data-testid='mock-select-situacao-emprestimo'
        value={value}
        onChange={(e) => {
          onChange?.(e.target.value);
          selectProps?.onChange?.(e.target.value);
        }}
      />
    );
    return (
      <Form.Item name='situacaoEmprestimo' {...formItemProps}>
        <MockChild />
      </Form.Item>
    );
  },
}));

jest.mock('./components/rf-cpf-solicitante', () => ({
  __esModule: true,
  InputRfCpfSolicitante: ({ obterFiltros, formItemProps }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Form } = require('antd');
    const MockChild = ({ value = '', onChange }: any) => (
      <input
        data-testid='mock-input-rf-cpf-solicitante'
        value={value}
        onChange={(e) => {
          onChange?.(e.target.value);
          obterFiltros?.();
        }}
      />
    );
    return (
      <Form.Item name='solicitanteRf' {...formItemProps}>
        <MockChild />
      </Form.Item>
    );
  },
}));

describe('ListAtendimentoSolicitacoes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    lastDataTableProps = null;
    mockPerfilState = {
      perfilSelecionado: {
        perfil: TipoPerfil.ADMIN_GERAL,
      },
    };
  });

  const renderComponent = (permissaoValue: any = { podeIncluir: true }, isUndefined = false) => {
    return render(
      <PermissaoContext.Provider
        value={{
          permissao: isUndefined ? undefined : permissaoValue,
          desabilitarCampos: false,
          setDesabilitarCampos: jest.fn(),
        }}
      >
        <ListAtendimentoSolicitacoes />
      </PermissaoContext.Provider>,
    );
  };

  it('deve renderizar o cabeçalho, formulário de filtros e tabela com sucesso', () => {
    renderComponent();

    expect(screen.getByText('Atendimento de Solicitações')).toBeInTheDocument();
    expect(document.getElementById(CDEP_BUTTON_VOLTAR)).toBeInTheDocument();
    expect(document.getElementById(CDEP_BUTTON_CANCELAR)).toBeInTheDocument();
    expect(document.getElementById(CDEP_BUTTON_NOVA_SOLICITACAO)).toBeInTheDocument();

    // Inputs e Mocks
    expect(screen.getByPlaceholderText('N° da solicitação')).toBeInTheDocument();
    expect(screen.getByTestId('mock-select-tipo-acervo')).toBeInTheDocument();
    expect(screen.getByTestId('mock-range-picker-dataSolicitacao')).toBeInTheDocument();
    expect(screen.getByTestId('mock-range-picker-dataVisita')).toBeInTheDocument();
    expect(screen.getByTestId('mock-select-responsaveis')).toBeInTheDocument();
    expect(screen.getByTestId('mock-select-situacao-atendimento')).toBeInTheDocument();
    expect(screen.getByTestId('mock-input-rf-cpf-solicitante')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nome do solicitante')).toBeDisabled();
    expect(screen.getByTestId('mock-select-situacao-emprestimo')).toBeInTheDocument();

    // Tabela
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
    expect(screen.getByText('Título Curto')).toBeInTheDocument();
    expect(screen.getByText(`${'A'.repeat(100)}...`)).toBeInTheDocument();
    expect(screen.getByText('12/05/2026 14:00')).toBeInTheDocument();
  });

  describe('Navegação Voltar (onClickVoltar)', () => {
    it('deve navegar para ROUTES.INDICADORES quando perfil for ADMIN_GERAL', () => {
      mockPerfilState = { perfilSelecionado: { perfil: TipoPerfil.ADMIN_GERAL } };
      renderComponent();

      fireEvent.click(document.getElementById(CDEP_BUTTON_VOLTAR)!);

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.INDICADORES);
    });

    it('deve navegar para ROUTES.INDICADORES quando perfil for ADMIN_BIBLIOTECA', () => {
      mockPerfilState = { perfilSelecionado: { perfil: TipoPerfil.ADMIN_BIBLIOTECA } };
      renderComponent();

      fireEvent.click(document.getElementById(CDEP_BUTTON_VOLTAR)!);

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.INDICADORES);
    });

    it('deve navegar para ROUTES.INDICADORES quando perfil for ADMIN_MEMORIA', () => {
      mockPerfilState = { perfilSelecionado: { perfil: TipoPerfil.ADMIN_MEMORIA } };
      renderComponent();

      fireEvent.click(document.getElementById(CDEP_BUTTON_VOLTAR)!);

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.INDICADORES);
    });

    it('deve navegar para ROUTES.INDICADORES quando perfil for ADMIN_MEMORIAL', () => {
      mockPerfilState = { perfilSelecionado: { perfil: TipoPerfil.ADMIN_MEMORIAL } };
      renderComponent();

      fireEvent.click(document.getElementById(CDEP_BUTTON_VOLTAR)!);

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.INDICADORES);
    });

    it('deve navegar para ROUTES.PRINCIPAL quando perfil não for admin', () => {
      mockPerfilState = { perfilSelecionado: { perfil: TipoPerfil.ATENDIMENTO } };
      renderComponent();

      fireEvent.click(document.getElementById(CDEP_BUTTON_VOLTAR)!);

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PRINCIPAL);
    });

    it('deve navegar para ROUTES.PRINCIPAL quando perfil for indefinido', () => {
      mockPerfilState = undefined;
      renderComponent();

      fireEvent.click(document.getElementById(CDEP_BUTTON_VOLTAR)!);

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PRINCIPAL);
    });
  });

  describe('Botão Nova Solicitação', () => {
    it('deve navegar para ROUTES.ATENDIMENTO_SOLICITACAO_MANUAL ao clicar quando habilitado', () => {
      renderComponent({ podeIncluir: true });

      const btnNovaSolicitacao = document.getElementById(CDEP_BUTTON_NOVA_SOLICITACAO)!;
      expect(btnNovaSolicitacao).not.toBeDisabled();

      fireEvent.click(btnNovaSolicitacao);

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ATENDIMENTO_SOLICITACAO_MANUAL);
    });

    it('deve desabilitar botão quando podeIncluir for falso', () => {
      renderComponent({ podeIncluir: false });

      const btnNovaSolicitacao = document.getElementById(CDEP_BUTTON_NOVA_SOLICITACAO)!;
      expect(btnNovaSolicitacao).toBeDisabled();
    });

    it('deve desabilitar botão quando permissao for indefinido', () => {
      renderComponent(undefined, true);

      const btnNovaSolicitacao = document.getElementById(CDEP_BUTTON_NOVA_SOLICITACAO)!;
      expect(btnNovaSolicitacao).toBeDisabled();
    });
  });

  describe('Botão Cancelar (onClickCancelar)', () => {
    it('deve resetar o formulário e voltar os filtros para DEFAULT_VALUES quando campos foram modificados', () => {
      renderComponent();

      const inputNumero = document.getElementById(CDEP_INPUT_NUMERO_SOLICITACAO)!;
      fireEvent.change(inputNumero, { target: { value: '987' } });

      const btnCancelar = document.getElementById(CDEP_BUTTON_CANCELAR)!;
      expect(btnCancelar).not.toBeDisabled();

      fireEvent.click(btnCancelar);

      expect(lastDataTableProps.filters).toEqual({
        acervoSolicitacaoId: null,
        tipoAcervo: null,
        dataSolicitacaoInicio: null,
        dataSolicitacaoFim: null,
        dataVisitaInicio: null,
        dataVisitaFim: null,
        situacaoItem: null,
        responsavel: null,
        solicitanteRf: null,
        situacaoEmprestimo: null,
      });
    });

    it('não deve resetar filtros quando campos não foram modificados', () => {
      renderComponent();

      const btnCancelar = document.getElementById(CDEP_BUTTON_CANCELAR)!;
      btnCancelar.removeAttribute('disabled');
      fireEvent.click(btnCancelar);

      expect(lastDataTableProps.filters).toEqual({
        acervoSolicitacaoId: null,
        tipoAcervo: null,
        dataSolicitacaoInicio: null,
        dataSolicitacaoFim: null,
        dataVisitaInicio: null,
        dataVisitaFim: null,
        situacaoItem: null,
        responsavel: null,
        solicitanteRf: null,
        situacaoEmprestimo: null,
      });
    });
  });

  describe('Atualização de Filtros (obterFiltros)', () => {
    it('deve atualizar os filtros quando cada componente disparar onChange', () => {
      renderComponent();

      // InputNumero
      const inputNumero = document.getElementById(CDEP_INPUT_NUMERO_SOLICITACAO)!;
      fireEvent.change(inputNumero, { target: { value: '555' } });
      expect(lastDataTableProps.filters.acervoSolicitacaoId).toBe('555');

      // TipoAcervo
      fireEvent.change(screen.getByTestId('mock-select-tipo-acervo'), {
        target: { value: '1' },
      });
      expect(lastDataTableProps.filters.tipoAcervo).toBe('1');

      // DataSolicitacao
      fireEvent.click(screen.getByTestId('mock-range-picker-dataSolicitacao'));
      expect(lastDataTableProps.filters.dataSolicitacaoInicio).toBe('2026-05-01');
      expect(lastDataTableProps.filters.dataSolicitacaoFim).toBe('2026-05-31');

      // DataVisita
      fireEvent.click(screen.getByTestId('mock-range-picker-dataVisita'));
      expect(lastDataTableProps.filters.dataVisitaInicio).toBe('2026-05-01');
      expect(lastDataTableProps.filters.dataVisitaFim).toBe('2026-05-31');

      // Responsaveis
      fireEvent.change(screen.getByTestId('mock-select-responsaveis'), {
        target: { value: 'resp-123' },
      });
      expect(lastDataTableProps.filters.responsavel).toBe('resp-123');

      // SituacaoAtendimento
      fireEvent.change(screen.getByTestId('mock-select-situacao-atendimento'), {
        target: { value: '2' },
      });
      expect(lastDataTableProps.filters.situacaoItem).toBe('2');

      // SituacaoEmprestimo
      fireEvent.change(screen.getByTestId('mock-select-situacao-emprestimo'), {
        target: { value: '3' },
      });
      expect(lastDataTableProps.filters.situacaoEmprestimo).toBe('3');

      // RfCpfSolicitante
      fireEvent.change(screen.getByTestId('mock-input-rf-cpf-solicitante'), {
        target: { value: '12345678901' },
      });
      expect(lastDataTableProps.filters.solicitanteRf).toBe('12345678901');
    });
  });

  describe('Ação da Tabela (onClickDetalheSolicitacao)', () => {
    it('deve navegar para a página de detalhes ao clicar em uma linha', () => {
      renderComponent();

      const linha1 = screen.getByTestId('linha-101');
      fireEvent.click(linha1);

      expect(mockNavigate).toHaveBeenCalledWith(`${ROUTES.ATENDIMENTO_SOLICITACOES}/101`, {
        replace: true,
      });
    });
  });
});
