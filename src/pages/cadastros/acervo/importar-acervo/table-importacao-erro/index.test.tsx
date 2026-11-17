import { fireEvent, render, screen } from '@testing-library/react';
import { AcervoLinhaErroDTO } from '~/core/dto/acervo-linha-erro-dto';
import { ImportacaoArquivoRetornoDTO } from '~/core/dto/importacao-arquivo-retorno-dto';
import TableImportacaoErro from './index';

jest.mock('../modal', () => {
  const MockModalImportacao = ({
    acervoLinhaErro,
    atualizarLinhaParaSucesso,
    removerLinhaDoArquivo,
  }: {
    acervoLinhaErro: AcervoLinhaErroDTO;
    atualizarLinhaParaSucesso: () => void;
    removerLinhaDoArquivo: () => void;
  }) => (
    <div data-testid={`modal-${acervoLinhaErro.numeroLinha}`}>
      <button type='button' onClick={atualizarLinhaParaSucesso}>
        Atualizar {acervoLinhaErro.numeroLinha}
      </button>
      <button type='button' onClick={removerLinhaDoArquivo}>
        Remover {acervoLinhaErro.numeroLinha}
      </button>
    </div>
  );
  return MockModalImportacao;
});

describe('TableImportacaoErro', () => {
  it('C03/C04: renderiza erros por mensagem, errosCampos ou vazio e aciona callbacks de linha', () => {
    const atualizarLinhaParaSucesso = jest.fn();
    const removerLinhaDoArquivo = jest.fn();

    const { rerender } = render(
      <TableImportacaoErro
        obterDados={jest.fn()}
        atualizarLinhaParaSucesso={atualizarLinhaParaSucesso}
        removerLinhaDoArquivo={removerLinhaDoArquivo}
        dataSource={[
          {
            id: 1,
            erros: [
              {
                numeroLinha: 3,
                titulo: 'Item A',
                tombo: 'T-3',
                retornoErro: { mensagem: 'Erro geral da linha' },
              },
              {
                numeroLinha: 4,
                titulo: 'Item B',
                tombo: 'T-4',
                retornoErro: { errosCampos: ['Título inválido', 'Ano obrigatório'] },
              },
              {
                numeroLinha: 5,
                titulo: 'Item C',
                tombo: 'T-5',
                retornoErro: {},
              },
            ],
          } as unknown as ImportacaoArquivoRetornoDTO,
        ]}
      />,
    );

    expect(screen.getByText('Erro geral da linha')).toBeInTheDocument();
    expect(screen.getByText('Título inválido')).toBeInTheDocument();
    expect(screen.getByText('Ano obrigatório')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Atualizar 3' }));
    expect(atualizarLinhaParaSucesso).toHaveBeenCalledWith(3);

    fireEvent.click(screen.getByRole('button', { name: 'Remover 4' }));
    expect(removerLinhaDoArquivo).toHaveBeenCalledWith(4);

    rerender(
      <TableImportacaoErro
        obterDados={jest.fn()}
        atualizarLinhaParaSucesso={atualizarLinhaParaSucesso}
        removerLinhaDoArquivo={removerLinhaDoArquivo}
        dataSource={[]}
      />,
    );
    expect(screen.getByText('Sem dados')).toBeInTheDocument();
  });
});
