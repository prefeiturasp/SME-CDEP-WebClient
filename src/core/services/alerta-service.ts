import { Modal, ModalFuncProps, notification } from 'antd';
import { Colors } from '../styles/colors';

const exibirAlerta = (tipo: any, mensagem: string) => {
  let titulo;
  let classeTipo;
  switch (tipo) {
    case 'success':
      titulo = 'Sucesso';
      classeTipo = 'alerta-sucesso';
      break;
    case 'error':
      titulo = 'Erro';
      classeTipo = 'alerta-erro';
      break;
    case 'warning':
      titulo = 'Aviso';
      classeTipo = 'alerta-aviso';
      break;

    default:
      titulo = '';
      classeTipo = '';
      break;
  }
  notification[tipo]({
    message: titulo,
    description: mensagem,
    duration: 6,
    className: classeTipo,
  });
};

const sucesso = (mensagem: string) => {
  exibirAlerta('success', mensagem);
};

const erro = (mensagem: string) => {
  exibirAlerta('error', mensagem);
};

const confirmacao = (props: ModalFuncProps) => {
  const { title, content, okText, cancelText } = props;

  Modal.confirm({
    ...props,
    icon: null,
    width: 500,
    content: content,
    okText: okText || 'Sim',
    title: title || 'Atenção',
    cancelText: cancelText || 'Não',
    cancelButtonProps: {
      type: 'text',
      style: { color: Colors.TEXT, fontWeight: 500, fontSize: 16, padding: '0px 15px' },
    },
    okButtonProps: {
      type: 'default',
      style: {
        color: Colors.CDEP_PRIMARY,
        border: `1px solid ${Colors.CDEP_PRIMARY}`,
        fontSize: 16,
        padding: '0px 15px',
        borderRadius: 4,
      },
    },
  });
};

export { confirmacao, erro, exibirAlerta, sucesso };
