/* eslint-disable @typescript-eslint/no-empty-function */
import React, { PropsWithChildren, createContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PermissaoMenusAcoesDTO } from '~/core/dto/permissao-menu-acoes-dto';
import { PermissaoPorMenuDTO } from '~/core/dto/permissao-por-menu-dto';

type PermissaoContextProps = {
  desabilitarCampos: boolean;
  setDesabilitarCampos: React.Dispatch<React.SetStateAction<boolean>>;
  permissao: PermissaoMenusAcoesDTO;
};

const DEFAULT_VALUES: PermissaoContextProps = {
  desabilitarCampos: false,
  setDesabilitarCampos: () => false,
  permissao: {
    customRoles: [],
    podeAlterar: true,
    podeConsultar: true,
    podeExcluir: true,
    podeIncluir: true,
  },
};

export const PermissaoContext = createContext<PermissaoContextProps>(DEFAULT_VALUES);

type PermissaoContextProviderProps = PropsWithChildren & {
  menu: PermissaoPorMenuDTO;
};

const PermissaoContextProvider: React.FC<PermissaoContextProviderProps> = ({ menu, children }) => {
  const paramsRoute = useParams();

  const [desabilitarCampos, setDesabilitarCampos] = useState(DEFAULT_VALUES.desabilitarCampos);

  const id = paramsRoute?.id ? parseInt(paramsRoute?.id) : 0;

  useEffect(() => {
    const permissoesTela = menu.permissao;

    let desabilitar = permissoesTela?.somenteConsulta;

    if (!desabilitar) {
      if (id > 0) {
        desabilitar = !permissoesTela?.podeAlterar;
      } else {
        desabilitar = !permissoesTela?.podeIncluir;
      }
    }

    setDesabilitarCampos(desabilitar);
  }, [menu, id]);

  return (
    <PermissaoContext.Provider
      value={{
        desabilitarCampos,
        setDesabilitarCampos,
        permissao: menu.permissao,
      }}
    >
      {children}
    </PermissaoContext.Provider>
  );
};

export default PermissaoContextProvider;
