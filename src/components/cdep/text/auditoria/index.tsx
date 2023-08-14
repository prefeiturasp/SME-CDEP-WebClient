import { FC } from 'react';
import { Space, Typography } from 'antd';
import { EntidadeBaseAuditavel } from '~/core/dto/auditoria-dto';
import { formatarDataHoraAuditoria } from '~/core/utils/functions';

interface InfoAuditoriaProps {
  rf: string;
  data: string;
  autor: string;
  label: string;
}

interface AuditoriaProps {
  dados: EntidadeBaseAuditavel;
}

const InfoAuditoria: FC<InfoAuditoriaProps> = ({ label, autor, rf, data }) => {
  return (
    <Typography.Text style={{ fontSize: 9, fontWeight: 700 }}>
      {`${label} por ${autor} ${`(${rf})`}`} em {formatarDataHoraAuditoria(data)}
    </Typography.Text>
  );
};

const Auditoria: FC<AuditoriaProps> = ({ dados }) => {
  const { criadoPor, criadoEm, criadoLogin, alteradoLogin, alteradoPor, alteradoEm } = dados;

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