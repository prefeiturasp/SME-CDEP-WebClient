import { render, screen } from '@testing-library/react';
import { ImportacaoArquivoRetornoDTO } from '~/core/dto/importacao-arquivo-retorno-dto';
import TableImportacao from './index';

describe('TableImportacao', () => {
  it('C01: renderiza arquivo importado com data formatada e exibe "Sem dados" quando vazio', () => {
    const { rerender } = render(
      <TableImportacao
        dataSource={[
          {
            id: 1,
            nome: 'planilha-acervo.xlsx',
            dataImportacao: '2026-11-10T14:30:00',
          } as unknown as ImportacaoArquivoRetornoDTO,
        ]}
      />,
    );

    expect(screen.getByText('planilha-acervo.xlsx')).toBeInTheDocument();
    expect(screen.getByText('10/11/2026 - 14:30')).toBeInTheDocument();

    rerender(<TableImportacao dataSource={[]} />);
    expect(screen.getByText('Sem dados')).toBeInTheDocument();
  });
});
