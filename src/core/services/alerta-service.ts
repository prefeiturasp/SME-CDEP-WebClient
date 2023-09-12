import { Modal, ModalFuncProps } from 'antd';
import { Colors } from '../styles/colors';

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

export { confirmacao };
