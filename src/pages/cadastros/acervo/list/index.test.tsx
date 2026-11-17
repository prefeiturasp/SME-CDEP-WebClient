import { fireEvent, render, screen } from '@testing-library/react';
import { ColumnsType } from 'antd/es/table';
import React from 'react';
import {
  CDEP_BUTTON_IMPORTAR,
  CDEP_BUTTON_NOVO,
  CDEP_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { AcervoTableRow } from '~/core/dto/acervo-table-row';
import { ROUTES } from '~/core/enum/routes';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { TipoPerfil } from '~/core/enum/tipo-perfil-enum';
import { useAppSelector } from '~/core/hooks/use-redux';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import ListAcervo from './index';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('~/core/hooks/use-redux', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('~/components/cdep/input/credito-autoria', () => {
  const MockCredito = () => <div data-testid='select-credito-autoria' />;
  return MockCredito;
});

jest.mock('~/components/cdep/input/editora', () => {
  const MockEditora = () => <div data-testid='select-editora' />;
  return MockEditora;
});

jest.mock('~/components/cdep/input/tipo-acervo', () => {
  const { Form } = jest.requireActual('antd');
  const MockTipoAcervo = () => {
    const form = Form.useFormInstance();
    return (
      <Form.Item name='tipoAcervo'>
        <input
          aria-label='select-tipo-acervo'
          onChange={(e) => form.setFieldValue('tipoAcervo', Number(e.target.value))}
        />
      </Form.Item>
    );
  };
  return MockTipoAcervo;
});

jest.mock('~/components/lib/data-table', () => {
  const MockDataTable = ({
    columns,
    onRow,
  }: {
    columns: ColumnsType<AcervoTableRow>;
    onRow: (row: AcervoTableRow) => { onClick: () => void };
  }) => {
    const sampleRows = [
      {
        acervoId: 101,
        tipoAcervoId: 2,
        tipoAcervo: 'Documentação textual',
        titulo: 'Livro Histórico',
        capaDocumento: 'https://exemplo.com/capa.png',
      },
      {
        acervoId: 102,
        tipoAcervoId: 1,
        tipoAcervo: 'Bibliográfico',
        titulo: 'Sem Capa',
      },
    ] as AcervoTableRow[];

    return (
      <div data-testid='mock-data-table' data-columns={columns.map((c) => c.title).join(',')}>
        {sampleRows.map((row) => (
          <div key={row.acervoId}>
            <button type='button' onClick={onRow(row).onClick}>
              Editar {row.acervoId}
            </button>
            {columns.map((col, idx) =>
              col.render
                ? (col.render(
                    (row as unknown as Record<string, unknown>)[
                      String((col as { dataIndex?: string }).dataIndex)
                    ],
                    row,
                    idx,
                  ) as React.ReactNode)
                : null,
            )}
          </div>
        ))}
      </div>
    );
  };
  return MockDataTable;
});

type PermissaoValue = React.ComponentProps<typeof PermissaoContext.Provider>['value'];

const renderList = (options?: { podeIncluir?: boolean; perfil?: TipoPerfil | string }) => {
  (useAppSelector as jest.Mock).mockImplementation((selector) =>
    selector({
      perfil: {
        perfilSelecionado: {
          perfil: options?.perfil ?? TipoPerfil.ADMIN_GERAL,
        },
      },
    }),
  );

  return render(
    <PermissaoContext.Provider
      value={
        { permissao: { podeIncluir: options?.podeIncluir ?? true } } as unknown as PermissaoValue
      }
    >
      <ListAcervo />
    </PermissaoContext.Provider>,
  );
};

describe('ListAcervo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('C09/C10: exibe colunas base inicialmente e adiciona coluna "Capa" para DocumentacaoTextual', () => {
    renderList();

    const table = screen.getByTestId('mock-data-table');
    expect(table).toHaveAttribute(
      'data-columns',
      'Tipo de acervo,Editora,Título,Crédito/Autoria,Tombo/Código',
    );

    const tipoInput = screen.getByLabelText('select-tipo-acervo');
    fireEvent.change(tipoInput, { target: { value: String(TipoAcervo.DocumentacaoTextual) } });

    expect(table).toHaveAttribute(
      'data-columns',
      'Capa,Tipo de acervo,Editora,Título,Crédito/Autoria,Tombo/Código',
    );
    expect(screen.getByAltText('Capa de Livro Histórico')).toHaveAttribute(
      'src',
      'https://exemplo.com/capa.png',
    );
  });

  it('C11/C12: navega em Novo, Importar, Editar linha e Voltar (admin vs não-admin)', () => {
    const { unmount } = renderList({ podeIncluir: true, perfil: TipoPerfil.ADMIN_GERAL });

    fireEvent.click(document.getElementById(CDEP_BUTTON_NOVO) as HTMLElement);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ACERVO_NOVO);

    fireEvent.click(document.getElementById(CDEP_BUTTON_IMPORTAR) as HTMLElement);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ACERVO_IMPORTAR);

    fireEvent.click(screen.getByRole('button', { name: 'Editar 101' }));
    expect(mockNavigate).toHaveBeenCalledWith(`${ROUTES.ACERVO}/editar/101`, {
      state: { tipoAcervoId: TipoAcervo.DocumentacaoTextual },
      replace: true,
    });

    fireEvent.click(document.getElementById(CDEP_BUTTON_VOLTAR) as HTMLElement);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.INDICADORES);

    unmount();
    jest.clearAllMocks();

    renderList({ podeIncluir: false, perfil: 'SOLICITANTE' });
    expect(document.getElementById(CDEP_BUTTON_NOVO)).toBeDisabled();
    expect(document.getElementById(CDEP_BUTTON_IMPORTAR)).toBeDisabled();

    fireEvent.click(document.getElementById(CDEP_BUTTON_VOLTAR) as HTMLElement);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PRINCIPAL);
  });
});
