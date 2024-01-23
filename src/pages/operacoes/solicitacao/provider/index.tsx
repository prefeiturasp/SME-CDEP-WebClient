/* eslint-disable @typescript-eslint/no-empty-function */
import React, { PropsWithChildren, createContext, useState } from 'react';
import { AcervoSolicitacaoItemRetornoCadastroDTO } from '~/core/dto/acervo-solicitacao-item-retorno-cadastro-dto';

type AcervoSolicitacaoContextProps = {
  dataSource: AcervoSolicitacaoItemRetornoCadastroDTO[];
  setDataSource: React.Dispatch<React.SetStateAction<AcervoSolicitacaoItemRetornoCadastroDTO[]>>;
};

const DEFAULT_VALUES: AcervoSolicitacaoContextProps = {
  dataSource: [],
  setDataSource: () => {},
};

export const AcervoSolicitacaoContext =
  createContext<AcervoSolicitacaoContextProps>(DEFAULT_VALUES);

const AcervoSolicitacaoContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [dataSource, setDataSource] = useState<AcervoSolicitacaoItemRetornoCadastroDTO[]>([]);

  return (
    <AcervoSolicitacaoContext.Provider
      value={{
        dataSource,
        setDataSource,
      }}
    >
      {children}
    </AcervoSolicitacaoContext.Provider>
  );
};

export default AcervoSolicitacaoContextProvider;
