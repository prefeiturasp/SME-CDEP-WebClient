import { AxiosResponse } from 'axios';
import { UsuarioExternoDTO } from '../dto/usuario-externo-dto';
import api from './api';
import { DadosUsuarioDTO } from '../dto/dados-usuario-dto';
import { EnderecoUsuarioExternoDTO } from '../dto/endereco-usuario-externo-dto';
import { SenhaNovaDTO } from '../dto/senha-nova-dto';

const URL_DEFAULT = 'v1/usuarios';

const cadastrarUsuarioExterno = (dados: UsuarioExternoDTO): Promise<AxiosResponse<boolean>> =>
  api.post(URL_DEFAULT, { ...dados });

const obterMeusDados = (login: string): Promise<AxiosResponse<DadosUsuarioDTO>> =>
  api.get(`${URL_DEFAULT}/${login}`);

const alterarEmail = (login: string, email: string): Promise<AxiosResponse<boolean>> =>
  api.put(`${URL_DEFAULT}/${login}/email?email=${email}`);

const alterarTelefone = (login: string, telefone: string): Promise<AxiosResponse<boolean>> =>
  api.put(`${URL_DEFAULT}/${login}/telefone?telefone=${telefone}`);

const alterarEndereco = (
  login: string,
  dados: EnderecoUsuarioExternoDTO,
): Promise<AxiosResponse<boolean>> => api.put(`${URL_DEFAULT}/${login}/endereco`, { ...dados });

const alterarSenha = (login: string, dados: SenhaNovaDTO): Promise<AxiosResponse<boolean>> =>
  api.put(`${URL_DEFAULT}/${login}/senha`, dados);

export default {
  cadastrarUsuarioExterno,
  obterMeusDados,
  alterarEmail,
  alterarTelefone,
  alterarEndereco,
  alterarSenha,
};
