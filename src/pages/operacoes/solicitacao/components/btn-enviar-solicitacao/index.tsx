import Checkbox, { CheckboxChangeEvent } from 'antd/es/checkbox/Checkbox';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Spin from '~/components/cdep/spin';
import ButtonSecundary from '~/components/lib/button/secundary';
import Modal from '~/components/lib/modal';
import { CDEP_BUTTON_NOVO } from '~/core/constants/ids/button/intex';
import { AcervoSolicitacaoItemCadastroDTO } from '~/core/dto/acervo-solicitacao-item-cadastro-dto';
import { ROUTES } from '~/core/enum/routes';
import { setAcervosSelecionados } from '~/core/redux/modules/solicitacao/actions';
import { obterTermoDeCompromisso } from '~/core/services/acervo-service';
import acervoSolicitacaoService from '~/core/services/acervo-solicitacao-service';
import { AcervoSolicitacaoContext } from '../../provider';
import { notification } from '~/components/lib/notification';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';

const BtnEnviarSolicitacoes: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const paramsRoute = useParams();

  const solicitacaoId = paramsRoute?.id ? Number(paramsRoute.id) : 0;

  const { dataSource } = useContext(AcervoSolicitacaoContext);
  const { permissao } = useContext(PermissaoContext);

  const [showModal, setShowModal] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const [dados, setDados] = useState<string>('');

  const desabilitarBtnEnviarSolicitacao: boolean = useMemo(
    () => !permissao?.podeIncluir || !!solicitacaoId || !dataSource?.length,
    [dataSource, solicitacaoId, permissao],
  );

  const obterTermo = async () => {
    setLoading(true);
    const resposta = await obterTermoDeCompromisso().finally(() => setLoading(false));

    if (resposta.sucesso) {
      setDados(resposta.dados);
    }
  };

  const onClickEnviar = () => {
    if (permissao?.podeIncluir) {
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setChecked(false);
  };

  const validateFields = async () => {
    if (!checked) {
      return;
    }

    const params: AcervoSolicitacaoItemCadastroDTO[] = dataSource.map((item) => ({
      acervoId: item.acervoId,
    }));

    setLoading(true);
    const resposta = await acervoSolicitacaoService
      .inserir(params)
      .finally(() => setLoading(false));

    if (resposta.sucesso) {
      dispatch(setAcervosSelecionados([]));

      navigate(ROUTES.PRINCIPAL);

      notification.success({
        message: 'Sucesso',
        description: 'Solicitação realizada com sucesso.',
      });

      closeModal();
    }
  };

  const onCancelModal = () => {
    closeModal();
  };

  useEffect(() => {
    if (showModal) obterTermo();
  }, [showModal]);

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
        title='TERMO DE COMPROMISSO DO PESQUISADOR CDEP'
        onOk={validateFields}
        onCancel={onCancelModal}
        centered
        destroyOnClose
        okText='Prosseguir'
        okButtonProps={{ disabled: !checked }}
        cancelButtonProps={{ disabled: loading }}
        width={669}
        closable={!loading}
        maskClosable={!loading}
        keyboard={!loading}
        confirmLoading={loading}
      >
        <Spin spinning={loading}>
          {dados && <div dangerouslySetInnerHTML={{ __html: dados }} />}
        </Spin>
        <Checkbox checked={checked} onChange={handleCheckboxChange} disabled={loading}>
          Li e estou de acordo com os termos
        </Checkbox>
      </Modal>
    </>
  );
};

export default BtnEnviarSolicitacoes;
