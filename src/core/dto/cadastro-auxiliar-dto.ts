import { EntidadeBaseAuditavel } from './auditoria-dto';

export type CadastroAuxiliarDTO = {
  nome: string;
} & EntidadeBaseAuditavel;
