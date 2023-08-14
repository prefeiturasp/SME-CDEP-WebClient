import { Modal, ModalFuncProps } from 'antd';
import { Colors } from '../styles/colors';

const confirmacao = (props: ModalFuncProps) => {
  const { title, content, cancelText } = props;

  Modal.confirm({
    ...props,
    icon: null,
    width: 500,
    content: content,
    title: title || 'Atenção',
    cancelText: cancelText || 'Cancelar',
    cancelButtonProps: {
      type: 'text',
      style: { color: Colors.TEXT, fontWeight: 500, fontSize: '1rem' },
    },
    okButtonProps: {
      type: 'default',
      style: {
        color: Colors.CDEP_PRIMARY,
        border: `1px solid ${Colors.CDEP_PRIMARY}`,
        fontSize: '1rem',
        paddingBottom: 0,
      },
    },
  });
};

export { confirmacao };
