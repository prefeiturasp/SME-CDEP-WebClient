import { FC } from 'react';
import { Space, Typography } from 'antd';
import { EntidadeBaseAuditavel } from '~/core/dto/auditoria-dto';
import { formatarDataHora } from '~/core/utils/functions';

interface InfoAuditoriaProps {
  rf: string;
  data: string;
  autor: string;
  label: string;
}

interface AuditoriaProps {
  dadosAuditoria: EntidadeBaseAuditavel;
}

const InfoAuditoria: FC<InfoAuditoriaProps> = ({ label, autor, rf, data }) => {
  return (
    <Typography.Text strong>
      {`${label} por ${autor} ${rf}`} em {formatarDataHora(data)}
    </Typography.Text>
  );
};

const Auditoria: FC<AuditoriaProps> = ({ dadosAuditoria }) => {
  const { criadoPor, criadoEm, criadoLogin, alteradoLogin, alteradoPor, alteradoEm } =
    dadosAuditoria;

  return (
    <Space direction='vertical'>
      {criadoPor && (
        <InfoAuditoria label='INSERIDO' autor={criadoPor} rf={criadoLogin} data={criadoEm} />
      )}
      {alteradoPor && (
        <InfoAuditoria label='ALTERADO' autor={alteradoPor} rf={alteradoLogin} data={alteradoEm} />
      )}
    </Space>
  );
};

export default Auditoria;
