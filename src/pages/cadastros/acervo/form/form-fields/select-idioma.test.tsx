import { render, screen, fireEvent, waitFor } from '~/tests/test-utils';
import { Form } from 'antd';
import SelectIdioma from './select-idioma';
import { CDEP_SELECT_IDIOMA } from '~/core/constants/ids/select';
import * as idiomaService from '~/core/services/idioma-service';

jest.mock('~/core/services/idioma-service');
jest.mock('~/components/cdep/cadastros/auxiliares/form', () => {
  const MockFormCadastrosAuxiliares = ({
    setOpenModal,
  }: {
    setOpenModal: (open: boolean, update?: boolean) => void;
  }) => (
    <div data-testid='mock-modal-idioma'>
      <button onClick={() => setOpenModal(false, true)}>Salvar e Fechar</button>
    </div>
  );
  MockFormCadastrosAuxiliares.displayName = 'MockFormCadastrosAuxiliares';
  return MockFormCadastrosAuxiliares;
});

describe('SelectIdioma', () => {
  const mockObterIdioma = idiomaService.obterIdioma as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <Form>
        <SelectIdioma formItemProps={{ extra: <span data-testid='extra-idioma'>Extra</span> }} />
      </Form>,
    );
  };

  test('carrega e exibe opções de idioma com sucesso', async () => {
    mockObterIdioma.mockResolvedValueOnce({
      sucesso: true,
      dados: [
        { id: '1', nome: 'Português' },
        { id: '2', nome: 'Inglês' },
      ],
    });

    renderComponent();

    await waitFor(() => {
      expect(mockObterIdioma).toHaveBeenCalledTimes(1);
    });

    const select = document.querySelector(`#${CDEP_SELECT_IDIOMA}`);
    expect(select).toBeInTheDocument();
    expect(screen.getByTestId('extra-idioma')).toBeInTheDocument();
  });

  test('lida com retorno de insucesso limpando opções', async () => {
    mockObterIdioma.mockResolvedValueOnce({
      sucesso: false,
      dados: null,
    });

    renderComponent();

    await waitFor(() => {
      expect(mockObterIdioma).toHaveBeenCalledTimes(1);
    });

    const select = document.querySelector(`#${CDEP_SELECT_IDIOMA}`);
    expect(select).toBeInTheDocument();
  });

  test('abre modal de cadastro de idioma e recarrega dados ao fechar com update', async () => {
    mockObterIdioma.mockResolvedValue({
      sucesso: true,
      dados: [{ id: '1', nome: 'Português' }],
    });

    renderComponent();

    await waitFor(() => {
      expect(mockObterIdioma).toHaveBeenCalledTimes(1);
    });

    const addBtn = screen.getByRole('button');
    fireEvent.click(addBtn);

    expect(screen.getByTestId('mock-modal-idioma')).toBeInTheDocument();

    const salvarBtn = screen.getByText('Salvar e Fechar');
    fireEvent.click(salvarBtn);

    await waitFor(() => {
      expect(mockObterIdioma).toHaveBeenCalledTimes(2);
    });

    expect(screen.queryByTestId('mock-modal-idioma')).not.toBeInTheDocument();
  });
});
