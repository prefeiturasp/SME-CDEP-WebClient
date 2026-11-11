import { AxiosError, HttpStatusCode } from 'axios';
import { render, screen, fireEvent, waitFor } from '~/tests/test-utils';
import CriarConta from './index';
import { ROUTES } from '~/core/enum/routes';
import usuarioService from '~/core/services/usuario-service';
import enderecoService from '~/core/services/endereco-service';
import { setSpinning } from '~/core/redux/modules/spin/actions';
import { ERRO_CADASTRO_USUARIO } from '~/core/constants/mensagens';
import { TipoUsuario } from '~/core/enum/tipo-usuario-enum';
import { CDEP_BUTTON_CANCELAR } from '~/core/constants/ids/button/intex';
import {
  CDEP_INPUT_CEP,
  CDEP_INPUT_CONFIRMAR_EMAIL,
  CDEP_INPUT_CPF,
} from '~/core/constants/ids/input';
import { RetornoBaseDTO } from '~/core/dto/retorno-base-dto';

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

let capturedForm: any = null;
jest.mock('antd/es/form/Form', () => {
  const actual = jest.requireActual('antd/es/form/Form');
  return {
    ...actual,
    useForm: (...args: any[]) => {
      const [form] = actual.useForm(...args);
      capturedForm = form;
      return [form];
    },
  };
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('~/core/hooks/use-redux', () => ({
  useAppDispatch: () => mockDispatch,
}));

jest.mock('~/core/services/usuario-service', () => ({
  __esModule: true,
  default: {
    cadastrarUsuarioExterno: jest.fn(),
    validaCPFExistente: jest.fn(),
  },
}));

jest.mock('~/core/services/endereco-service', () => ({
  __esModule: true,
  default: {
    obterDadosCEP: jest.fn(),
  },
}));

describe('CriarConta', () => {
  const validFormData = {
    cpf: '123.456.789-01',
    nome: 'Maria da Silva',
    telefone: '(11) 98888-8888',
    email: 'maria@exemplo.com',
    confirmarEmail: 'maria@exemplo.com',
    cep: '01001-000',
    endereco: 'Praça da Sé',
    numero: '100',
    complemento: 'Sala 1',
    bairro: 'Sé',
    cidade: 'São Paulo',
    estado: 'SP',
    tipo: TipoUsuario.SERVIDOR_PUBLICO,
    instituicao: 'Prefeitura',
    senha: 'Senha@123',
    confirmarSenha: 'Senha@123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização dos elementos', () => {
    test('renderiza os botões e campos do formulário', () => {
      render(<CriarConta />);

      expect(screen.getByRole('button', { name: /cadastre-se/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
      expect(document.getElementById(CDEP_INPUT_CPF)).toBeInTheDocument();
      expect(document.getElementById(CDEP_INPUT_CEP)).toBeInTheDocument();
    });
  });

  describe('Botão Cancelar', () => {
    test('navega para a rota de LOGIN ao clicar em Cancelar', () => {
      render(<CriarConta />);

      const btnCancelar = document.getElementById(CDEP_BUTTON_CANCELAR)!;
      fireEvent.click(btnCancelar);

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.LOGIN);
    });
  });

  describe('Prevenção de Paste no campo Confirmar E-mail', () => {
    test('chama preventDefault e impede colar no campo confirmarEmail', () => {
      render(<CriarConta />);

      const inputConfirmarEmail = document.getElementById(CDEP_INPUT_CONFIRMAR_EMAIL)!;
      const isPrevented = !fireEvent.paste(inputConfirmarEmail);

      expect(isPrevented).toBe(true);
    });
  });

  describe('Validação de CPF Existente', () => {
    test('dispara validaCPFExistente quando CPF tem 11 dígitos e foca no nome se CPF não existir', async () => {
      (usuarioService.validaCPFExistente as jest.Mock).mockResolvedValue({
        data: false,
      });

      render(<CriarConta />);

      const inputCPF = document.getElementById(CDEP_INPUT_CPF)!;
      fireEvent.change(inputCPF, { target: { value: '123.456.789-01' } });

      await waitFor(() => {
        expect(usuarioService.validaCPFExistente).toHaveBeenCalledWith('12345678901');
      });
    });

    test('limpa erro de CPF quando o valor digitado tem menos de 11 dígitos', () => {
      render(<CriarConta />);

      const inputCPF = document.getElementById(CDEP_INPUT_CPF)!;
      fireEvent.change(inputCPF, { target: { value: '123' } });

      expect(usuarioService.validaCPFExistente).not.toHaveBeenCalled();
    });

    test('exibe mensagem de erro quando validaCPFExistente falha com mensagens da API', async () => {
      const axiosError = {
        response: {
          data: {
            mensagens: ['CPF já cadastrado no sistema'],
          },
        },
      } as AxiosError<RetornoBaseDTO>;

      (usuarioService.validaCPFExistente as jest.Mock).mockRejectedValue(axiosError);

      render(<CriarConta />);

      const inputCPF = document.getElementById(CDEP_INPUT_CPF)!;
      fireEvent.change(inputCPF, { target: { value: '123.456.789-01' } });

      await waitFor(() => {
        expect(screen.getByText('CPF já cadastrado no sistema')).toBeInTheDocument();
      });
    });

    test('lida com erro na validação de CPF quando erro não possui mensagens da API', async () => {
      (usuarioService.validaCPFExistente as jest.Mock).mockRejectedValue(
        new Error('Network Error'),
      );

      render(<CriarConta />);

      const inputCPF = document.getElementById(CDEP_INPUT_CPF)!;
      fireEvent.change(inputCPF, { target: { value: '12345678901' } });

      await waitFor(() => {
        expect(usuarioService.validaCPFExistente).toHaveBeenCalled();
      });
    });
  });

  describe('Busca de dados de CEP (getCEP)', () => {
    test('não busca CEP quando o valor tiver menos de 8 dígitos', () => {
      render(<CriarConta />);

      const inputCEP = document.getElementById(CDEP_INPUT_CEP)!;
      fireEvent.change(inputCEP, { target: { value: '123' } });

      expect(enderecoService.obterDadosCEP).not.toHaveBeenCalled();
    });

    test('busca CEP com sucesso e preenche campos do endereço', async () => {
      const mockDadosEndereco = {
        bairro: 'Centro Histórico',
        uf: 'SP',
        complemento: 'Bloco A',
        localidade: 'São Paulo',
        logradouro: 'Praça da Sé',
      };

      (enderecoService.obterDadosCEP as jest.Mock).mockResolvedValue({
        status: HttpStatusCode.Ok,
        data: mockDadosEndereco,
      });

      render(<CriarConta />);

      const inputCEP = document.getElementById(CDEP_INPUT_CEP)!;
      fireEvent.change(inputCEP, { target: { value: '01001-000' } });

      await waitFor(() => {
        expect(enderecoService.obterDadosCEP).toHaveBeenCalledWith('01001000');
      });
    });

    test('busca CEP com sucesso quando o status for NoContent (204)', async () => {
      (enderecoService.obterDadosCEP as jest.Mock).mockResolvedValue({
        status: HttpStatusCode.NoContent,
        data: {},
      });

      render(<CriarConta />);

      const inputCEP = document.getElementById(CDEP_INPUT_CEP)!;
      fireEvent.change(inputCEP, { target: { value: '01001000' } });

      await waitFor(() => {
        expect(enderecoService.obterDadosCEP).toHaveBeenCalledWith('01001000');
      });
    });

    test('exibe mensagem de erro quando busca de CEP falha com mensagens da API', async () => {
      const axiosError = {
        response: {
          data: {
            mensagens: ['CEP inválido'],
          },
        },
      } as AxiosError<RetornoBaseDTO>;

      (enderecoService.obterDadosCEP as jest.Mock).mockRejectedValue(axiosError);

      render(<CriarConta />);

      const inputCEP = document.getElementById(CDEP_INPUT_CEP)!;
      fireEvent.change(inputCEP, { target: { value: '99999999' } });

      await waitFor(() => {
        expect(screen.getByText('CEP inválido')).toBeInTheDocument();
      });
    });

    test('lida com erro na busca de CEP quando erro não possui mensagens da API', async () => {
      (enderecoService.obterDadosCEP as jest.Mock).mockRejectedValue(new Error('Network Error'));

      render(<CriarConta />);

      const inputCEP = document.getElementById(CDEP_INPUT_CEP)!;
      fireEvent.change(inputCEP, { target: { value: '99999999' } });

      await waitFor(() => {
        expect(enderecoService.obterDadosCEP).toHaveBeenCalled();
      });
    });
  });

  describe('Submissão do formulário (onFinish)', () => {
    test('submete com sucesso e navega para LOGIN ao cadastrar', async () => {
      (usuarioService.cadastrarUsuarioExterno as jest.Mock).mockResolvedValue({
        data: true,
      });

      render(<CriarConta />);
      capturedForm.setFieldsValue(validFormData);

      fireEvent.submit(document.querySelector('form')!);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(setSpinning(true));
        expect(usuarioService.cadastrarUsuarioExterno).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.LOGIN);
        expect(mockDispatch).toHaveBeenCalledWith(setSpinning(false));
      });
    });

    test('não navega se resposta.data for false', async () => {
      (usuarioService.cadastrarUsuarioExterno as jest.Mock).mockResolvedValue({
        data: false,
      });

      render(<CriarConta />);
      capturedForm.setFieldsValue(validFormData);

      fireEvent.submit(document.querySelector('form')!);

      await waitFor(() => {
        expect(usuarioService.cadastrarUsuarioExterno).toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith(setSpinning(false));
      });
    });

    test('exibe erro geral quando resposta de erro for do tipo string', async () => {
      const axiosError = {
        response: {
          data: 'Erro inesperado no servidor',
        },
      } as AxiosError<RetornoBaseDTO>;

      (usuarioService.cadastrarUsuarioExterno as jest.Mock).mockRejectedValue(axiosError);

      render(<CriarConta />);
      capturedForm.setFieldsValue(validFormData);

      fireEvent.submit(document.querySelector('form')!);

      await waitFor(() => {
        expect(screen.getByText('Erro inesperado no servidor')).toBeInTheDocument();
        expect(mockDispatch).toHaveBeenCalledWith(setSpinning(false));
      });
    });

    test('exibe erro geral quando resposta de erro contiver lista de mensagens', async () => {
      const axiosError = {
        response: {
          data: {
            mensagens: ['O e-mail já está em uso', 'Senha não atende requisitos'],
          },
        },
      } as AxiosError<RetornoBaseDTO>;

      (usuarioService.cadastrarUsuarioExterno as jest.Mock).mockRejectedValue(axiosError);

      render(<CriarConta />);
      capturedForm.setFieldsValue(validFormData);

      fireEvent.submit(document.querySelector('form')!);

      await waitFor(() => {
        expect(screen.getByText('O e-mail já está em uso')).toBeInTheDocument();
        expect(screen.getByText('Senha não atende requisitos')).toBeInTheDocument();
        expect(mockDispatch).toHaveBeenCalledWith(setSpinning(false));
      });
    });

    test('exibe erro padrão quando resposta de erro não contiver mensagem específica', async () => {
      const axiosError = {
        response: {
          data: {},
        },
      } as AxiosError<RetornoBaseDTO>;

      (usuarioService.cadastrarUsuarioExterno as jest.Mock).mockRejectedValue(axiosError);

      render(<CriarConta />);
      capturedForm.setFieldsValue(validFormData);

      fireEvent.submit(document.querySelector('form')!);

      await waitFor(() => {
        expect(screen.getByText(ERRO_CADASTRO_USUARIO)).toBeInTheDocument();
        expect(mockDispatch).toHaveBeenCalledWith(setSpinning(false));
      });
    });
  });
});
