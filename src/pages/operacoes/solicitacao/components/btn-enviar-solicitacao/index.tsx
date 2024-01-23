import Checkbox, { CheckboxChangeEvent } from 'antd/es/checkbox/Checkbox';
import React, { useContext, useEffect, useState } from 'react';
import Spin from '~/components/cdep/spin';
import ButtonSecundary from '~/components/lib/button/secundary';
import Modal from '~/components/lib/modal';
import { CDEP_BUTTON_NOVO } from '~/core/constants/ids/button/intex';
import { obterTermoDeCompromisso } from '~/core/services/acervo-service';
import { tratarCatch, tratarThen } from '~/core/services/api';
import { AcervoSolicitacaoContext } from '../../provider';

const BtnEnviarSolicitacoes: React.FC = () => {
  const { dataSource } = useContext(AcervoSolicitacaoContext);

  const [showModal, setShowModal] = useState(false);
  const [checked, setChecked] = useState(false);
  const [dados, setDados] = useState(false);
  const [loading, setLoading] = useState(false);

  const desabilitarBtnEnviarSolicitacao = !dataSource?.length;

  const obterTermo = async () => {
    setLoading(true);
    const resposta = await obterTermoDeCompromisso()
      .then(tratarThen)
      .catch(tratarCatch)
      .finally(() => setLoading(false));

    if (resposta.sucesso) {
      setDados(resposta.dados);
    }
  };

  const onClickEnviar = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setChecked(false);
  };

  const validateFields = () => {
    if (!checked) {
      return;
    }

    console.log(dataSource);
    // TODO - Consumir endpoint para enviar a solicitação e mapear dto com o dataSource acima para enviar no endpoint

    closeModal();
  };

  const onCancelModal = () => {
    closeModal();
  };

  useEffect(() => {
    obterTermo();
  }, []);

  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    setChecked(e.target.checked);
  };

  return (
    <>
      <ButtonSecundary
        id={CDEP_BUTTON_NOVO}
        onClick={() => onClickEnviar()}
        disabled={desabilitarBtnEnviarSolicitacao}
      >
        Enviar solicitação
      </ButtonSecundary>

      <Modal
        open={showModal}
        title='Termos de compromisso'
        onOk={validateFields}
        onCancel={onCancelModal}
        centered
        destroyOnClose
        okText='Prosseguir'
        okButtonProps={{ disabled: !checked }}
        width={669}
      >
        <Spin spinning={loading}>
          {dados && <div dangerouslySetInnerHTML={{ __html: dados }} />}
        </Spin>
        <Checkbox checked={checked} onChange={handleCheckboxChange}>
          Li e estou de acordo com os termos
        </Checkbox>
      </Modal>
    </>
  );
};

export default BtnEnviarSolicitacoes;
