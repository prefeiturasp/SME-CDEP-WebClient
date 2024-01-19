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
    () =>
      acervosSelecionados.find(
        (item) => item?.codigo === pesquisaAcervo?.codigo && item?.tipo === pesquisaAcervo?.tipo,
      ),
    [acervosSelecionados, pesquisaAcervo],
  );

  const label = selected ? 'Selecionado' : 'Selecionar';

  const onChange = () => {
    let newValues: PesquisaAcervoDTO[] = [];

    if (selected) {
      newValues = acervosSelecionados.filter(
        (item) => !(item?.codigo === pesquisaAcervo?.codigo && item?.tipo === pesquisaAcervo?.tipo),
      );
    } else {
      newValues = [...acervosSelecionados, pesquisaAcervo];
    }

    dispatch(setAcervosSelecionados(newValues));
  };

  return (
    <Checkbox onChange={onChange} checked={!!selected}>
      {label}
    </Checkbox>
  );
};

export default React.memo(CheckboxSelecionarAcervo);
