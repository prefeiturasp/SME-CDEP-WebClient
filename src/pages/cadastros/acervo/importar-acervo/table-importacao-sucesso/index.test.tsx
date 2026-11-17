import { render, screen } from '@testing-library/react';
import { ImportacaoArquivoRetornoDTO } from '~/core/dto/importacao-arquivo-retorno-dto';
import TableImportacaoSucesso from './index';

describe('TableImportacaoSucesso', () => {
  it('C02: renderiza linhas importadas com sucesso e exibe "Sem dados" quando vazio', () => {
    const { rerender } = render(
      <TableImportacaoSucesso
        dataSource={[
          {
            id: 1,
            sucesso: [{ numeroLinha: 2, titulo: 'Livro X', tombo: 'T-01' }],
          } as unknown as ImportacaoArquivoRetornoDTO,
        ]}
      />,
    );

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Livro X')).toBeInTheDocument();
    expect(screen.getByText('T-01')).toBeInTheDocument();

    rerender(<TableImportacaoSucesso dataSource={[]} />);
    expect(screen.getByText('Sem dados')).toBeInTheDocument();
  });
});
