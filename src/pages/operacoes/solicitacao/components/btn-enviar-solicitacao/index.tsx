import Checkbox, { CheckboxChangeEvent } from 'antd/es/checkbox/Checkbox';
import React, { useEffect, useState } from 'react';
import Spin from '~/components/cdep/spin';
import ButtonPrimary from '~/components/lib/button/primary';
import Modal from '~/components/lib/modal';
import { obterTermoDeCompromisso } from '~/core/services/acervo-service'
import { CDEP_BUTTON_NOVO } from '~/core/constants/ids/button/intex';
import { tratarCatch, tratarThen } from '~/core/services/api';

const BtnEnviarSolicitacoes: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [checked, setChecked] = useState(false);
  const [dados, setDados] = useState(false);
  const [loading, setLoading] = useState(false);

  const obterTermos = async () => {        
    setLoading(true);
    const resposta = await 
      obterTermoDeCompromisso()
      .then(tratarThen)
      .catch(tratarCatch)
      .finally(()=>setLoading(false))
    if (resposta.sucesso) {
      setDados(resposta.dados);
    }
  };

  const onClickEnviar = () => {
    setShowModal(true);
  };

  const validateFields = () => {
    if (!checked) {
      return;
    }

    setShowModal(false);
  };

  const onCancelModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    obterTermos();
  }, []);

  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    setChecked(e.target.checked);
  };

  return (
    <>
      <ButtonPrimary
        id={CDEP_BUTTON_NOVO}
        onClick={() => onClickEnviar()}
      >
        Enviar solicitação
      </ButtonPrimary>

      {showModal && (
        <Modal
          open
          title="Termos de compromisso"
          onOk={validateFields}
          onCancel={onCancelModal}
          centered
          destroyOnClose
          okText='Prosseguir'
          okButtonProps={{ disabled: !checked }} 
          width={669}
        >
          <Spin spinning={loading}>
            {dados && (
              <div dangerouslySetInnerHTML={{ __html: dados }} />
            )}
          </Spin>
          <Checkbox
            checked={checked}
            onChange={handleCheckboxChange}
          >
            Li e estou de acordo com os termos
          </Checkbox>
        </Modal>
      )}
    </>
  );
};

export default BtnEnviarSolicitacoes;
