import { render, screen, waitFor } from '@testing-library/react';
import { AxiosResponse } from 'axios';
import { DadosSolicitanteDTO } from '~/core/dto/dados-solicitante-dto';
import { TipoUsuario } from '~/core/enum/tipo-usuario-enum';
import usuarioService from '~/core/services/usuario-service';
import CardDadosSolicitante from './index';

jest.mock('~/core/services/usuario-service', () => ({
  __esModule: true,
  default: {
    obterDadosSolicitante: jest.fn(),
  },
}));

const mockedObterDadosSolicitante = usuarioService.obterDadosSolicitante as jest.MockedFunction<
  typeof usuarioService.obterDadosSolicitante
>;

const createAxiosSuccess = (dados: DadosSolicitanteDTO): AxiosResponse<DadosSolicitanteDTO> =>
  ({
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as never,
    data: dados,
  } as AxiosResponse<DadosSolicitanteDTO>);

describe('CardDadosSolicitante', () => {
  beforeEach(() => {
    mockedObterDadosSolicitante.mockReset();
  });

  it('C08: deve exibir CPF, Telefone, E-mail, Tipo do Usuário e Endereço quando solicitante for externo (tipoId > CORESSO)', async () => {
    mockedObterDadosSolicitante.mockResolvedValueOnce(
      createAxiosSuccess({
        id: 1,
        nome: 'Maria Pesquisadora Externa',
        login: '123.456.789-00',
        telefone: '(11) 98888-7777',
        email: 'maria.externa@teste.com',
        tipoId: TipoUsuario.ESTUDANTE,
        tipo: 'Estudante',
        endereco: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
      }),
    );

    render(<CardDadosSolicitante />);

    await waitFor(() => {
      expect(screen.getByText('Maria Pesquisadora Externa')).toBeInTheDocument();
    });

    expect(screen.getByText('Dados do solicitante')).toBeInTheDocument();
    expect(screen.getByText('CPF:')).toBeInTheDocument();
    expect(screen.getByText('123.456.789-00')).toBeInTheDocument();
    expect(screen.getByText('Telefone:')).toBeInTheDocument();
    expect(screen.getByText('(11) 98888-7777')).toBeInTheDocument();
    expect(screen.getByText('E-mail:')).toBeInTheDocument();
    expect(screen.getByText('maria.externa@teste.com')).toBeInTheDocument();
    expect(screen.getByText('Tipo do Usuário:')).toBeInTheDocument();
    expect(screen.getByText('Estudante')).toBeInTheDocument();
    expect(screen.getByText('Endereço:')).toBeInTheDocument();
    expect(screen.getByText('Av. Paulista, 1000 - Bela Vista, São Paulo - SP')).toBeInTheDocument();
  });

  it('C09: deve exibir apenas Nome, E-mail e Tipo do Usuário quando solicitante for interno (tipoId <= CORESSO)', async () => {
    mockedObterDadosSolicitante.mockResolvedValueOnce(
      createAxiosSuccess({
        id: 2,
        nome: 'João Servidor SME',
        login: '7654321',
        telefone: '',
        email: 'joao.sme@sme.prefeitura.sp.gov.br',
        tipoId: TipoUsuario.CORESSO,
        tipo: 'Funcionário SME',
        endereco: '',
      }),
    );

    render(<CardDadosSolicitante />);

    await waitFor(() => {
      expect(screen.getByText('João Servidor SME')).toBeInTheDocument();
    });

    expect(screen.getByText('joao.sme@sme.prefeitura.sp.gov.br')).toBeInTheDocument();
    expect(screen.getByText('Funcionário SME')).toBeInTheDocument();
    expect(screen.queryByText('CPF:')).not.toBeInTheDocument();
    expect(screen.queryByText('Telefone:')).not.toBeInTheDocument();
    expect(screen.queryByText('Endereço:')).not.toBeInTheDocument();
  });

  it('C10: deve tratar resposta sem sucesso de obterDadosSolicitante sem preencher dados ou lançar erro', async () => {
    mockedObterDadosSolicitante.mockRejectedValueOnce(new Error('Erro ao carregar solicitante'));

    render(<CardDadosSolicitante />);

    await waitFor(() => {
      expect(mockedObterDadosSolicitante).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText('Dados do solicitante')).toBeInTheDocument();
    expect(screen.queryByText('CPF:')).not.toBeInTheDocument();
    expect(screen.queryByText('Endereço:')).not.toBeInTheDocument();
  });
});
