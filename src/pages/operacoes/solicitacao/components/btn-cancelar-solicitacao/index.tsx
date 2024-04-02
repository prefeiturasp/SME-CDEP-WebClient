import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ButtonSecundary from '~/components/lib/button/secundary';
import { notification } from '~/components/lib/notification';
import { CDEP_BUTTON_CANCELAR_SOLICITACAO } from '~/core/constants/ids/button/intex';
import { ROUTES } from '~/core/enum/routes';
import acervoSolicitacaoService from '~/core/services/acervo-solicitacao-service';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { AcervoSolicitacaoContext } from '../../provider';

const BtnCancelarSolicitacoes: React.FC = () => {
  const navigate = useNavigate();

  const paramsRoute = useParams();

  const acervoSolicitacaoId = paramsRoute?.id ? Number(paramsRoute.id) : 0;

  const { podeCancelarSolicitacao } = useContext(AcervoSolicitacaoContext);
  const { permissao } = useContext(PermissaoContext);

  const onClickCancelar = async () => {
    const resultado = await acervoSolicitacaoService.cancelarAtendimento(acervoSolicitacaoId);

    if (resultado.sucesso) {
      notification.success({
        message: 'Sucesso',
        description: 'Solicitação cancelada com sucesso',
      });

      navigate(ROUTES.PRINCIPAL);
    }
  };

  return (
    <ButtonSecundary
      id={CDEP_BUTTON_CANCELAR_SOLICITACAO}
      onClick={() => onClickCancelar()}
      disabled={!podeCancelarSolicitacao || !permissao.podeAlterar}
    >
      Cancelar solicitação
    </ButtonSecundary>
  );
};

export default BtnCancelarSolicitacoes;
