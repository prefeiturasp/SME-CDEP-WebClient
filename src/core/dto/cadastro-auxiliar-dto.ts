import { TipoCreditoAutoria } from '../enum/tipo-credito-autoria';
import { BaseAuditavelDTO } from './base-auditavel-dto';

export type CadastroAuxiliarDTO = {
  nome: string;
  tipo?: TipoCreditoAutoria;
} & BaseAuditavelDTO;
