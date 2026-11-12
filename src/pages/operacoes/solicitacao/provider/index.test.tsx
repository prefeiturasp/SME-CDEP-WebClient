import { fireEvent, render, screen } from '@testing-library/react';
import React, { useContext } from 'react';
import { AcervoSolicitacaoItemRetornoCadastroDTO } from '~/core/dto/acervo-solicitacao-item-retorno-cadastro-dto';
import AcervoSolicitacaoContextProvider, { AcervoSolicitacaoContext } from './index';

const ConsumerComponent: React.FC = () => {
  const { dataSource, setDataSource, podeCancelarSolicitacao, setPodeCancelarSolicitacao } =
    useContext(AcervoSolicitacaoContext);

  return (
    <div>
      <span data-testid='count'>{dataSource.length}</span>
      <span data-testid='can-cancel'>{String(podeCancelarSolicitacao)}</span>
      <button
        type='button'
        onClick={() =>
          setDataSource([
            { id: 1, acervoId: 10, titulo: 'Item 1' } as AcervoSolicitacaoItemRetornoCadastroDTO,
          ])
        }
      >
        Atualizar DataSource
      </button>
      <button type='button' onClick={() => setPodeCancelarSolicitacao(true)}>
        Habilitar Cancelamento
      </button>
    </div>
  );
};

describe('AcervoSolicitacaoContextProvider', () => {
  it('C04: deve fornecer DEFAULT_VALUES seguros quando consumido fora do provider', () => {
    render(<ConsumerComponent />);

    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('can-cancel')).toHaveTextContent('false');

    fireEvent.click(screen.getByRole('button', { name: 'Atualizar DataSource' }));
    fireEvent.click(screen.getByRole('button', { name: 'Habilitar Cancelamento' }));

    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('can-cancel')).toHaveTextContent('false');
  });

  it('C05: deve gerenciar e atualizar dataSource e podeCancelarSolicitacao dentro do provider', () => {
    render(
      <AcervoSolicitacaoContextProvider>
        <ConsumerComponent />
      </AcervoSolicitacaoContextProvider>,
    );

    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('can-cancel')).toHaveTextContent('false');

    fireEvent.click(screen.getByRole('button', { name: 'Atualizar DataSource' }));
    expect(screen.getByTestId('count')).toHaveTextContent('1');

    fireEvent.click(screen.getByRole('button', { name: 'Habilitar Cancelamento' }));
    expect(screen.getByTestId('can-cancel')).toHaveTextContent('true');
  });
});
