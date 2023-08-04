import { AxiosResponse } from 'axios';
import { DadosUsuarioDTO } from '../dto/dados-usuario-dto';
import { EnderecoUsuarioExternoDTO } from '../dto/endereco-usuario-externo-dto';
import { RecuperacaoSenhaDTO } from '../dto/recuperacao-senha-dto';
import { RetornoPerfilUsuarioDTO } from '../dto/retorno-perfil-usuario-dto';
import { SenhaNovaDTO } from '../dto/senha-nova-dto';
import { UsuarioExternoDTO } from '../dto/usuario-externo-dto';
import api from './api';

const URL_DEFAULT = 'v1/usuario';

const cadastrarUsuarioExterno = (dados: UsuarioExternoDTO): Promise<AxiosResponse<boolean>> =>
  api.post(URL_DEFAULT, { ...dados });

const obterMeusDados = (login: string): Promise<AxiosResponse<DadosUsuarioDTO>> =>
  api.get(`${URL_DEFAULT}/${login}`);

const validaCPFExistente = (cpf: string): Promise<AxiosResponse<boolean>> =>
  api.get(`${URL_DEFAULT}/${cpf}/existe`);

const alterarEmail = (login: string, email: string): Promise<AxiosResponse<boolean>> =>
  api.put(`${URL_DEFAULT}/${login}/email`, { email });

const alterarTelefone = (login: string, telefone: string): Promise<AxiosResponse<boolean>> =>
  api.put(`${URL_DEFAULT}/${login}/telefone`, { telefone });

const alterarEndereco = (
  login: string,
  dados: EnderecoUsuarioExternoDTO,
): Promise<AxiosResponse<boolean>> => api.put(`${URL_DEFAULT}/${login}/endereco`, { ...dados });

const alterarSenha = (login: string, dados: SenhaNovaDTO): Promise<AxiosResponse<boolean>> =>
  api.put(`${URL_DEFAULT}/${login}/senha`, dados);

const solicitarRecuperacaoSenha = (login: string): Promise<AxiosResponse<string>> =>
  api.post(`${URL_DEFAULT}/${login}/solicitar-recuperacao-senha`);

const alterarSenhaComTokenRecuperacao = (
  params: RecuperacaoSenhaDTO,
): Promise<AxiosResponse<RetornoPerfilUsuarioDTO>> =>
  api.put(`${URL_DEFAULT}/recuperar-senha`, { ...params });

const tokenRecuperacaoSenhaEstaValido = (token: string): Promise<AxiosResponse<boolean>> =>
  api.get(`${URL_DEFAULT}/valida-token-recuperacao-senha/${token}`);

export default {
  alterarEmail,
  alterarSenha,
  obterMeusDados,
  alterarTelefone,
  alterarEndereco,
  validaCPFExistente,
  cadastrarUsuarioExterno,
  solicitarRecuperacaoSenha,
  alterarSenhaComTokenRecuperacao,
  tokenRecuperacaoSenhaEstaValido,
};
