import { fireEvent, render, screen } from '@testing-library/react';
import { CDEP_BUTTON_EDITAR, CDEP_BUTTON_EXCLUIR } from '~/core/constants/ids/button/intex';
import { AcervoLinhaErroDTO } from '~/core/dto/acervo-linha-erro-dto';
import ModalImportacaoAcervo from './index';

jest.mock('../../form', () => {
  const MockFormAcervo = ({
    setOpenFormModal,
  }: {
    setOpenFormModal: (opts: { open: boolean; updateData?: boolean }) => void;
  }) => (
    <div data-testid='mock-form-acervo'>
      <button type='button' onClick={() => setOpenFormModal({ open: false, updateData: true })}>
        SalvarModal
      </button>
      <button type='button' onClick={() => setOpenFormModal({ open: false, updateData: false })}>
        FecharModal
      </button>
    </div>
  );
  return MockFormAcervo;
});

describe('ModalImportacaoAcervo', () => {
  it('C06/C07/C08: aciona exclusão, abre FormAcervo ao editar e trata updateData true/false', () => {
    const atualizarLinhaParaSucesso = jest.fn();
    const removerLinhaDoArquivo = jest.fn();

    render(
      <ModalImportacaoAcervo
        acervoLinhaErro={{ numeroLinha: 10 } as unknown as AcervoLinhaErroDTO}
        obterDados={jest.fn()}
        atualizarLinhaParaSucesso={atualizarLinhaParaSucesso}
        removerLinhaDoArquivo={removerLinhaDoArquivo}
      />,
    );

    fireEvent.click(document.getElementById(CDEP_BUTTON_EXCLUIR) as HTMLElement);
    expect(removerLinhaDoArquivo).toHaveBeenCalledTimes(1);

    expect(screen.queryByTestId('mock-form-acervo')).not.toBeInTheDocument();

    fireEvent.click(document.getElementById(CDEP_BUTTON_EDITAR) as HTMLElement);
    expect(screen.getByTestId('mock-form-acervo')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'FecharModal' }));
    expect(screen.queryByTestId('mock-form-acervo')).not.toBeInTheDocument();
    expect(atualizarLinhaParaSucesso).not.toHaveBeenCalled();

    fireEvent.click(document.getElementById(CDEP_BUTTON_EDITAR) as HTMLElement);
    fireEvent.click(screen.getByRole('button', { name: 'SalvarModal' }));
    expect(screen.queryByTestId('mock-form-acervo')).not.toBeInTheDocument();
    expect(atualizarLinhaParaSucesso).toHaveBeenCalledTimes(1);
  });
});
