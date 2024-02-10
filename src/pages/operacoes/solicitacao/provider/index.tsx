/* eslint-disable @typescript-eslint/no-empty-function */
import React, { PropsWithChildren, createContext, useState } from 'react';
import { AcervoSolicitacaoItemRetornoCadastroDTO } from '~/core/dto/acervo-solicitacao-item-retorno-cadastro-dto';

type AcervoSolicitacaoContextProps = {
  dataSource: AcervoSolicitacaoItemRetornoCadastroDTO[];
  setDataSource: React.Dispatch<React.SetStateAction<AcervoSolicitacaoItemRetornoCadastroDTO[]>>;
  podeCancelarSolicitacao: boolean;
  setPodeCancelarSolicitacao: React.Dispatch<React.SetStateAction<boolean>>;
};

const DEFAULT_VALUES: AcervoSolicitacaoContextProps = {
  dataSource: [],
  setDataSource: () => {},
  podeCancelarSolicitacao: false,
  setPodeCancelarSolicitacao: () => {},
};

export const AcervoSolicitacaoContext =
  createContext<AcervoSolicitacaoContextProps>(DEFAULT_VALUES);

const AcervoSolicitacaoContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [dataSource, setDataSource] = useState<AcervoSolicitacaoItemRetornoCadastroDTO[]>([]);
  const [podeCancelarSolicitacao, setPodeCancelarSolicitacao] = useState<boolean>(false);

  return (
    <AcervoSolicitacaoContext.Provider
      value={{
        dataSource,
        setDataSource,
        podeCancelarSolicitacao,
        setPodeCancelarSolicitacao,
      }}
    >
      {children}
    </AcervoSolicitacaoContext.Provider>
  );
};

export default AcervoSolicitacaoContextProvider;
