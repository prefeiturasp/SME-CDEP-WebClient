import React from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonPrimary from '~/components/lib/button/primary';
import { PesquisaAcervoDTO } from '~/core/dto/pesquisa-acervo-dto';
import { ROUTES } from '~/core/enum/routes';
import { useAppDispatch, useAppSelector } from '~/core/hooks/use-redux';
import { setAcervosSelecionados } from '~/core/redux/modules/solicitacao/actions';

type ButtonEnviarParaMinhaSelecaoProps = {
  pesquisaAcervo?: PesquisaAcervoDTO;
};
export const ButtonEnviarParaMinhaSelecao: React.FC<ButtonEnviarParaMinhaSelecaoProps> = ({
  pesquisaAcervo,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const solicitacao = useAppSelector((state) => state.solicitacao);

  const acervosSelecionados = solicitacao?.acervosSelecionados;

  const onClick = () => {
    if (pesquisaAcervo) {
      const temNaLista = acervosSelecionados.find(
        (acervoId) => pesquisaAcervo?.acervoId === acervoId,
      );

      if (!temNaLista) {
        const newValues = [...acervosSelecionados, pesquisaAcervo.acervoId];
        dispatch(setAcervosSelecionados(newValues));
      }
    }

    navigate(ROUTES.SOLICITACAO);
  };

  return (
    <ButtonPrimary
      style={{
        fontSize: 18,
        height: 40,
        borderRadius: 40,
        display: 'flex',
        alignItems: 'center',
      }}
      onClick={onClick}
      disabled={acervosSelecionados.length == 0 && !pesquisaAcervo?.acervoId}
    >
      Enviar para a minha seleção
    </ButtonPrimary>
  );
};
