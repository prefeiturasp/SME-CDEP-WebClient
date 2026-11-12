import { AnyAction, configureStore, Reducer } from '@reduxjs/toolkit';
import { createEvent, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AxiosError, AxiosResponse, HttpStatusCode } from 'axios';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { CDEP_BUTTON_CADASTRAR, CDEP_BUTTON_CANCELAR } from '~/core/constants/ids/button/intex';
import {
  CDEP_INPUT_BAIRRO,
  CDEP_INPUT_CEP,
  CDEP_INPUT_CIDADE,
  CDEP_INPUT_COMPLEMENTO,
  CDEP_INPUT_CONFIRMAR_EMAIL,
  CDEP_INPUT_CONFIRMAR_SENHA,
  CDEP_INPUT_CPF,
  CDEP_INPUT_EMAIL,
  CDEP_INPUT_ENDERECO,
  CDEP_INPUT_INSTITUICAO_EMPRESA,
  CDEP_INPUT_NOME_COMPLETO,
  CDEP_INPUT_NUMERO,
  CDEP_INPUT_SENHA,
  CDEP_INPUT_TELEFONE,
} from '~/core/constants/ids/input';
import { CDEP_SELECT_TIPO_USUARIO, CDEP_SELECT_UF } from '~/core/constants/ids/select';
import { ERRO_CADASTRO_USUARIO } from '~/core/constants/mensagens';
import { RetornoBaseDTO } from '~/core/dto/retorno-base-dto';
import { RetornoCEPDTO } from '~/core/dto/retorno-cep-dto';
import { ROUTES } from '~/core/enum/routes';
import { TipoUsuario } from '~/core/enum/tipo-usuario-enum';
import spinReducer from '~/core/redux/modules/spin/reducers';
import enderecoService from '~/core/services/endereco-service';
import usuarioService from '~/core/services/usuario-service';
import CriarConta from './index';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

jest.mock('~/core/services/usuario-service', () => ({
  __esModule: true,
  default: {
    validaCPFExistente: jest.fn(),
    cadastrarUsuarioExterno: jest.fn(),
  },
}));

jest.mock('~/core/services/endereco-service', () => ({
  __esModule: true,
  default: {
    obterDadosCEP: jest.fn(),
  },
}));

const mockedValidaCPF = usuarioService.validaCPFExistente as jest.MockedFunction<
  typeof usuarioService.validaCPFExistente
>;
const mockedCadastrarUsuario = usuarioService.cadastrarUsuarioExterno as jest.MockedFunction<
  typeof usuarioService.cadastrarUsuarioExterno
>;
const mockedObterDadosCEP = enderecoService.obterDadosCEP as jest.MockedFunction<
  typeof enderecoService.obterDadosCEP
>;

const renderCriarConta = () => {
  const store = configureStore({
    reducer: {
      spin: spinReducer as unknown as Reducer<{ spinning: boolean }, AnyAction>,
    },
    preloadedState: {
      spin: { spinning: false },
    },
  });

  const utils = render(
    <Provider store={store}>
      <MemoryRouter>
        <CriarConta />
      </MemoryRouter>
    </Provider>,
  );

  return { store, ...utils };
};

const preencherFormularioValido = async (container: HTMLElement) => {
  mockedValidaCPF.mockResolvedValueOnce({ data: false } as AxiosResponse<boolean>);
  mockedObterDadosCEP.mockResolvedValueOnce({
    status: HttpStatusCode.Ok,
    data: {
      uf: 'SP',
      bairro: 'Centro',
      localidade: 'São Paulo',
      logradouro: 'Praça da Sé',
      complemento: 'Lado ímpar',
    },
  } as AxiosResponse<RetornoCEPDTO>);

  fireEvent.change(container.querySelector(`#${CDEP_INPUT_CPF}`)!, {
    target: { value: '12345678901' },
  });

  await waitFor(() => {
    expect(mockedValidaCPF).toHaveBeenCalledWith('12345678901');
  });

  fireEvent.change(container.querySelector(`#${CDEP_INPUT_NOME_COMPLETO}`)!, {
    target: { value: 'Maria da Silva' },
  });
  fireEvent.change(container.querySelector(`#${CDEP_INPUT_TELEFONE}`)!, {
    target: { value: '11987654321' },
  });
  fireEvent.change(container.querySelector(`#${CDEP_INPUT_EMAIL}`)!, {
    target: { value: 'maria@teste.com' },
  });
  fireEvent.change(container.querySelector(`#${CDEP_INPUT_CONFIRMAR_EMAIL}`)!, {
    target: { value: 'maria@teste.com' },
  });
  fireEvent.change(container.querySelector(`#${CDEP_INPUT_CEP}`)!, {
    target: { value: '01001000' },
  });

  await waitFor(() => {
    expect(container.querySelector(`#${CDEP_INPUT_ENDERECO}`)).toHaveValue('Praça da Sé');
  });

  fireEvent.change(container.querySelector(`#${CDEP_INPUT_NUMERO}`)!, {
    target: { value: '100' },
  });

  const selectTipoTrigger = container
    .querySelector(`#${CDEP_SELECT_TIPO_USUARIO}`)!
    .closest('.ant-select')!
    .querySelector('.ant-select-selector')!;
  fireEvent.mouseDown(selectTipoTrigger);

  const optionPopulacao = await screen.findByTitle('População em geral');
  fireEvent.click(optionPopulacao);

  fireEvent.change(container.querySelector(`#${CDEP_INPUT_INSTITUICAO_EMPRESA}`)!, {
    target: { value: 'Prefeitura' },
  });
  fireEvent.change(container.querySelector(`#${CDEP_INPUT_SENHA}`)!, {
    target: { value: 'Senha@123' },
  });
  fireEvent.change(container.querySelector(`#${CDEP_INPUT_CONFIRMAR_SENHA}`)!, {
    target: { value: 'Senha@123' },
  });
};

describe('Página Criar Conta (src/pages/criar-conta/index.tsx)', () => {
  jest.setTimeout(45000);

  beforeEach(() => {
    mockNavigate.mockReset();
    mockedValidaCPF.mockReset();
    mockedCadastrarUsuario.mockReset();
    mockedObterDadosCEP.mockReset();
  });

  it('C12: renderiza todos os campos do formulário de criação de conta e foca o campo CPF na montagem', () => {
    const { container } = renderCriarConta();

    const inputCPF = container.querySelector(`#${CDEP_INPUT_CPF}`) as HTMLInputElement;
    expect(inputCPF).toBeInTheDocument();
    expect(document.activeElement).toBe(inputCPF);

    expect(container.querySelector(`#${CDEP_INPUT_NOME_COMPLETO}`)).toBeInTheDocument();
    expect(container.querySelector(`#${CDEP_INPUT_TELEFONE}`)).toBeInTheDocument();
    expect(container.querySelector(`#${CDEP_INPUT_EMAIL}`)).toBeInTheDocument();
    expect(container.querySelector(`#${CDEP_INPUT_CONFIRMAR_EMAIL}`)).toBeInTheDocument();
    expect(container.querySelector(`#${CDEP_INPUT_CEP}`)).toBeInTheDocument();
    expect(container.querySelector(`#${CDEP_INPUT_ENDERECO}`)).toBeInTheDocument();
    expect(container.querySelector(`#${CDEP_INPUT_NUMERO}`)).toBeInTheDocument();
    expect(container.querySelector(`#${CDEP_INPUT_COMPLEMENTO}`)).toBeInTheDocument();
    expect(container.querySelector(`#${CDEP_INPUT_BAIRRO}`)).toBeInTheDocument();
    expect(container.querySelector(`#${CDEP_INPUT_CIDADE}`)).toBeInTheDocument();
    expect(container.querySelector(`#${CDEP_SELECT_UF}`)).toBeInTheDocument();
    expect(container.querySelector(`#${CDEP_SELECT_TIPO_USUARIO}`)).toBeInTheDocument();
    expect(container.querySelector(`#${CDEP_INPUT_INSTITUICAO_EMPRESA}`)).toBeInTheDocument();
    expect(container.querySelector(`#${CDEP_INPUT_SENHA}`)).toBeInTheDocument();
    expect(container.querySelector(`#${CDEP_INPUT_CONFIRMAR_SENHA}`)).toBeInTheDocument();
    expect(container.querySelector(`#${CDEP_BUTTON_CADASTRAR}`)).toBeInTheDocument();
    expect(container.querySelector(`#${CDEP_BUTTON_CANCELAR}`)).toBeInTheDocument();
  });

  it('C13: não consulta CPF com menos de 11 dígitos e, ao atingir 11 dígitos, valida CPF movendo foco para nome quando disponível', async () => {
    let resolveCPF!: (value: AxiosResponse<boolean>) => void;
    mockedValidaCPF.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveCPF = resolve;
        }),
    );

    const { container } = renderCriarConta();

    fireEvent.change(container.querySelector(`#${CDEP_INPUT_CPF}`)!, {
      target: { value: '123456' },
    });
    expect(mockedValidaCPF).not.toHaveBeenCalled();

    fireEvent.change(container.querySelector(`#${CDEP_INPUT_CPF}`)!, {
      target: { value: '12345678901' },
    });
    expect(mockedValidaCPF).toHaveBeenCalledWith('12345678901');

    resolveCPF({ data: false } as AxiosResponse<boolean>);

    await waitFor(() => {
      expect(document.activeElement).toBe(container.querySelector(`#${CDEP_INPUT_NOME_COMPLETO}`));
    });

    // Quando resposta.data === true, não move o foco para nome
    const currentInputCPF = container.querySelector(`#${CDEP_INPUT_CPF}`) as HTMLInputElement;
    currentInputCPF.focus();
    mockedValidaCPF.mockResolvedValueOnce({ data: true } as AxiosResponse<boolean>);
    fireEvent.change(currentInputCPF, { target: { value: '10987654321' } });

    await waitFor(() => {
      expect(mockedValidaCPF).toHaveBeenCalledWith('10987654321');
    });
    expect(document.activeElement).not.toBe(
      container.querySelector(`#${CDEP_INPUT_NOME_COMPLETO}`),
    );
  });

  it('C14: exibe mensagem de erro e refoca o campo CPF quando validaCPFExistente rejeita com mensagens (e ignora quando sem mensagens)', async () => {
    const { container } = renderCriarConta();
    const inputNome = container.querySelector(`#${CDEP_INPUT_NOME_COMPLETO}`) as HTMLInputElement;

    inputNome.focus();
    expect(document.activeElement).toBe(inputNome);

    mockedValidaCPF.mockRejectedValueOnce({
      response: {
        data: {
          mensagens: ['CPF já cadastrado no sistema'],
        },
      },
    } as AxiosError<RetornoBaseDTO>);

    fireEvent.change(container.querySelector(`#${CDEP_INPUT_CPF}`)!, {
      target: { value: '11122233344' },
    });

    await waitFor(
      () => {
        expect(screen.getByText('CPF já cadastrado no sistema')).toBeInTheDocument();
      },
      { timeout: 10000 },
    );
    expect(document.activeElement).toBe(container.querySelector(`#${CDEP_INPUT_CPF}`));

    // Quando rejeita sem mensagens, limpa CPFExistente anterior e não adiciona novos erros
    mockedValidaCPF.mockRejectedValueOnce({
      response: {
        data: {
          mensagens: [],
        },
      },
    } as unknown as AxiosError<RetornoBaseDTO>);

    fireEvent.change(container.querySelector(`#${CDEP_INPUT_CPF}`)!, {
      target: { value: '55566677788' },
    });

    await waitFor(() => {
      expect(mockedValidaCPF).toHaveBeenCalledWith('55566677788');
    });
    await waitFor(() => {
      expect(screen.queryByText('CPF já cadastrado no sistema')).not.toBeInTheDocument();
    });
  });

  it('C15: consulta CEP ao digitar 8 dígitos, preenche endereço/bairro/cidade/UF e foca numero (200 OK) ou endereco (204 NoContent)', async () => {
    let resolveCEP!: (value: AxiosResponse<RetornoCEPDTO>) => void;
    mockedObterDadosCEP.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveCEP = resolve;
        }),
    );

    const { container } = renderCriarConta();

    fireEvent.change(container.querySelector(`#${CDEP_INPUT_CEP}`)!, {
      target: { value: '01001' },
    });
    expect(mockedObterDadosCEP).not.toHaveBeenCalled();

    fireEvent.change(container.querySelector(`#${CDEP_INPUT_CEP}`)!, {
      target: { value: '01001000' },
    });
    expect(mockedObterDadosCEP).toHaveBeenCalledWith('01001000');

    resolveCEP({
      status: HttpStatusCode.Ok,
      data: {
        uf: 'SP',
        bairro: 'Sé',
        localidade: 'São Paulo',
        logradouro: 'Praça da Sé',
        complemento: 'Lado par',
      },
    } as AxiosResponse<RetornoCEPDTO>);

    await waitFor(() => {
      expect(container.querySelector(`#${CDEP_INPUT_ENDERECO}`)).toHaveValue('Praça da Sé');
    });
    expect(container.querySelector(`#${CDEP_INPUT_BAIRRO}`)).toHaveValue('Sé');
    expect(container.querySelector(`#${CDEP_INPUT_CIDADE}`)).toHaveValue('São Paulo');
    expect(container.querySelector(`#${CDEP_INPUT_COMPLEMENTO}`)).toHaveValue('Lado par');
    expect(document.activeElement).toBe(container.querySelector(`#${CDEP_INPUT_NUMERO}`));

    // Resposta 204 NoContent deve focar o campo endereco
    mockedObterDadosCEP.mockResolvedValueOnce({
      status: HttpStatusCode.NoContent,
      data: {
        uf: '',
        bairro: '',
        localidade: '',
        logradouro: '',
        complemento: '',
      },
    } as AxiosResponse<RetornoCEPDTO>);

    fireEvent.change(container.querySelector(`#${CDEP_INPUT_CEP}`)!, {
      target: { value: '99999999' },
    });

    await waitFor(() => {
      expect(mockedObterDadosCEP).toHaveBeenCalledWith('99999999');
      expect(document.activeElement).toBe(container.querySelector(`#${CDEP_INPUT_ENDERECO}`));
    });
  });

  it('C16: trata erro na consulta de CEP com mensagens e sem mensagens', async () => {
    const { container } = renderCriarConta();

    mockedObterDadosCEP.mockRejectedValueOnce({
      response: {
        data: {
          mensagens: ['CEP não encontrado'],
        },
      },
    } as AxiosError<RetornoBaseDTO>);

    fireEvent.change(container.querySelector(`#${CDEP_INPUT_CEP}`)!, {
      target: { value: '00000000' },
    });

    await waitFor(
      () => {
        expect(screen.getByText('CEP não encontrado')).toBeInTheDocument();
      },
      { timeout: 10000 },
    );

    mockedObterDadosCEP.mockRejectedValueOnce({
      response: {
        data: {},
      },
    } as AxiosError<RetornoBaseDTO>);

    fireEvent.change(container.querySelector(`#${CDEP_INPUT_CEP}`)!, {
      target: { value: '11111111' },
    });

    await waitFor(() => {
      expect(mockedObterDadosCEP).toHaveBeenCalledWith('11111111');
    });
  });

  it('C17: bloqueia colagem (onPaste) no campo de confirmação de e-mail', () => {
    const { container } = renderCriarConta();
    const inputConfirmarEmail = container.querySelector(`#${CDEP_INPUT_CONFIRMAR_EMAIL}`)!;

    const pasteEvent = createEvent.paste(inputConfirmarEmail);
    fireEvent(inputConfirmarEmail, pasteEvent);

    expect(pasteEvent.defaultPrevented).toBe(true);
  });

  it('C18: submete o formulário válido chamando cadastrarUsuarioExterno e redireciona para ROUTES.LOGIN quando resposta.data é truthy', async () => {
    mockedCadastrarUsuario.mockResolvedValueOnce({
      data: true,
    } as AxiosResponse<boolean>);

    const { container, store } = renderCriarConta();

    await preencherFormularioValido(container);

    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_CADASTRAR}`)!);

    await waitFor(() => {
      expect(mockedCadastrarUsuario).toHaveBeenCalledTimes(1);
    });

    expect(mockedCadastrarUsuario).toHaveBeenCalledWith(
      expect.objectContaining({
        cpf: '123.456.789-01',
        nome: 'Maria da Silva',
        telefone: '(11) 98765-4321',
        email: 'maria@teste.com',
        confirmarEmail: 'maria@teste.com',
        cep: '01001-000',
        endereco: 'Praça da Sé',
        numero: '100',
        complemento: 'Lado ímpar',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        tipo: TipoUsuario.POPULACAO_GERAL,
        instituicao: 'Prefeitura',
        senha: 'Senha@123',
        confirmarSenha: 'Senha@123',
      }),
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.LOGIN);
    });
    expect(store.getState().spin.spinning).toBe(false);

    // Quando resposta.data é false, não redireciona
    mockNavigate.mockClear();
    mockedCadastrarUsuario.mockResolvedValueOnce({
      data: false,
    } as AxiosResponse<boolean>);

    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_CADASTRAR}`)!);

    await waitFor(() => {
      expect(mockedCadastrarUsuario).toHaveBeenCalledTimes(2);
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('C19: exibe erros de cadastro via validarExibirErros (string, array de mensagens e fallback ERRO_CADASTRO_USUARIO)', async () => {
    const { container } = renderCriarConta();
    await preencherFormularioValido(container);

    // 1) Erro em formato string
    mockedCadastrarUsuario.mockRejectedValueOnce({
      response: {
        status: 400,
        data: 'E-mail já utilizado por outro usuário',
      },
    } as unknown as AxiosError<RetornoBaseDTO>);

    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_CADASTRAR}`)!);

    await waitFor(() => {
      expect(screen.getByText('E-mail já utilizado por outro usuário')).toBeInTheDocument();
    });

    // 2) Erro em formato mensagens[]
    mockedCadastrarUsuario.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          mensagens: ['Erro de validação 1', 'Erro de validação 2'],
        },
      },
    } as AxiosError<RetornoBaseDTO>);

    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_CADASTRAR}`)!);

    await waitFor(() => {
      expect(screen.getByText('Erro de validação 1')).toBeInTheDocument();
      expect(screen.getByText('Erro de validação 2')).toBeInTheDocument();
    });

    // 3) Fallback ERRO_CADASTRO_USUARIO
    mockedCadastrarUsuario.mockRejectedValueOnce({
      response: {
        status: 500,
        data: {},
      },
    } as AxiosError<RetornoBaseDTO>);

    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_CADASTRAR}`)!);

    await waitFor(() => {
      expect(screen.getByText(ERRO_CADASTRO_USUARIO)).toBeInTheDocument();
    });
  });

  it('C20: navega para ROUTES.LOGIN ao clicar no botão Cancelar', () => {
    const { container } = renderCriarConta();

    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_CANCELAR}`)!);

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.LOGIN);
  });
});
