import { AxiosResponse } from 'axios';
import { UsuarioExternoDTO } from '../dto/usuario-externo-dto';
import api from './api';

const URL_DEFAULT = 'v1/usuarios';

const cadastrarUsuarioExterno = (dados: UsuarioExternoDTO): Promise<AxiosResponse<boolean>> =>
  api.post(URL_DEFAULT, { ...dados });

export default {
  cadastrarUsuarioExterno,
};
