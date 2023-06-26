import { AxiosResponse } from 'axios';
import { UsuarioExternoDTO } from '../dto/usuario-externo-dto';
import api from './api';
import { DadosUsuarioDTO } from '../dto/dados-usuario-dto';

const URL_DEFAULT = 'v1/usuarios';

const cadastrarUsuarioExterno = (dados: UsuarioExternoDTO): Promise<AxiosResponse<boolean>> =>
  api.post(URL_DEFAULT, { ...dados });

const obterMeusDados = (login: string): Promise<AxiosResponse<DadosUsuarioDTO>> =>
  api.get(`${URL_DEFAULT}/${login}`);

export default {
  cadastrarUsuarioExterno,
  obterMeusDados,
};
