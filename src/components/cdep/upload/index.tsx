import { Form } from 'antd';
import UploadArquivosSME from '~/components/lib/upload';
import armazenamentoService from '~/core/services/armazenamento-service';

const UploadArquivosCDEP = () => {
  return (
    <Form.Item name='arquivos' label='Arquivos' wrapperCol={{ xs: 24 }}>
      <UploadArquivosSME
        multiple
        removeService={armazenamentoService.removerArquivos}
        uploadService={armazenamentoService.fazerUploadArquivo}
        dowloadService={armazenamentoService.obterArquivoParaDownload}
      />
    </Form.Item>
  );
};

export default UploadArquivosCDEP;
