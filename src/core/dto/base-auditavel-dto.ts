import { BaseDTO } from './base-dto';

export type BaseAuditavelDTO = {
  criadoEm: string;
  criadoPor: string;
  alteradoEm: string;
  alteradoPor: string;
  criadoLogin: string;
  alteradoLogin: string;
} & BaseDTO;
