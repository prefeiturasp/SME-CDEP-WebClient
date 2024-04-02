import { Checkbox } from 'antd';

import React, { useMemo } from 'react';
import { PesquisaAcervoDTO } from '~/core/dto/pesquisa-acervo-dto';
import { useAppDispatch, useAppSelector } from '~/core/hooks/use-redux';
import { setAcervosSelecionados } from '~/core/redux/modules/solicitacao/actions';

type CheckboxSelecionarAcervoProps = {
  pesquisaAcervo: PesquisaAcervoDTO;
};
const CheckboxSelecionarAcervo: React.FC<CheckboxSelecionarAcervoProps> = ({ pesquisaAcervo }) => {
  const dispatch = useAppDispatch();

  const solicitacao = useAppSelector((state) => state.solicitacao);
  const acervosSelecionados = solicitacao?.acervosSelecionados;

  const selected = useMemo(
    () => acervosSelecionados.find((acervoId) => acervoId === pesquisaAcervo?.acervoId),
    [acervosSelecionados, pesquisaAcervo],
  );

  const label = selected ? 'Selecionado' : 'Selecionar';

  const onChange = () => {
    let newValues: number[] = [];

    if (selected) {
      newValues = acervosSelecionados.filter((acervoId) => pesquisaAcervo?.acervoId !== acervoId);
    } else {
      newValues = [...acervosSelecionados, pesquisaAcervo.acervoId];
    }

    dispatch(setAcervosSelecionados(newValues));
  };

  return (
    <Checkbox
      onChange={onChange}
      checked={!!selected}
      disabled={pesquisaAcervo?.temControleDisponibilidade && !pesquisaAcervo?.estaDisponivel}
    >
      {label}
    </Checkbox>
  );
};

export default React.memo(CheckboxSelecionarAcervo);
