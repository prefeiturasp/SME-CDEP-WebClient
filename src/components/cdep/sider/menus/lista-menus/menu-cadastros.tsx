import { FaUserPlus } from 'react-icons/fa';
import { MenuEnum } from '~/core/enum/menu-enum';
import { PermissaoEnum } from '~/core/enum/permissao-enum';
import { ROUTES } from '~/core/enum/routes';
import { MenuItemCDEPProps } from '..';

export const MENU_CADASTRO: MenuItemCDEPProps = {
  key: MenuEnum.Cadastros,
  title: 'Cadastros',
  icon: <FaUserPlus size={24} />,
  children: [
    {
      key: MenuEnum.Credito,
      title: 'Crédito',
      url: ROUTES.CREDITO,
      roles: {
        podeConsultar: PermissaoEnum.CadastroCredito_C,
        podeIncluir: PermissaoEnum.CadastroCredito_I,
        podeExcluir: PermissaoEnum.CadastroCredito_E,
        podeAlterar: PermissaoEnum.CadastroCredito_A,
      },
    },
    {
      key: MenuEnum.Autor,
      title: 'Autor',
      url: ROUTES.AUTOR,
      roles: {
        podeConsultar: PermissaoEnum.CadastroAutor_C,
        podeIncluir: PermissaoEnum.CadastroAutor_I,
        podeExcluir: PermissaoEnum.CadastroAutor_E,
        podeAlterar: PermissaoEnum.CadastroAutor_A,
      },
    },
    {
      key: MenuEnum.Editora,
      title: 'Editora',
      url: ROUTES.EDITORA,
      roles: {
        podeConsultar: PermissaoEnum.CadastroEditora_C,
        podeIncluir: PermissaoEnum.CadastroEditora_I,
        podeExcluir: PermissaoEnum.CadastroEditora_E,
        podeAlterar: PermissaoEnum.CadastroEditora_A,
      },
    },
    {
      key: MenuEnum.Assunto,
      title: 'Assunto',
      url: ROUTES.ASSUNTO,
      roles: {
        podeConsultar: PermissaoEnum.CadastroAssunto_C,
        podeIncluir: PermissaoEnum.CadastroAssunto_I,
        podeExcluir: PermissaoEnum.CadastroAssunto_E,
        podeAlterar: PermissaoEnum.CadastroAssunto_A,
      },
    },
    {
      key: MenuEnum.SerieColecao,
      title: 'Série/Coleção',
      url: ROUTES.SERIE_COLECAO,
      roles: {
        podeConsultar: PermissaoEnum.CadastroSerieColecao_C,
        podeIncluir: PermissaoEnum.CadastroSerieColecao_I,
        podeExcluir: PermissaoEnum.CadastroSerieColecao_E,
        podeAlterar: PermissaoEnum.CadastroSerieColecao_A,
      },
    },
    {
      key: MenuEnum.Acervo,
      title: 'Acervo',
      url: ROUTES.ACERVO,
      roles: {
        podeConsultar: PermissaoEnum.CadastroAcervo_C,
        podeIncluir: PermissaoEnum.CadastroAcervo_I,
        podeExcluir: PermissaoEnum.CadastroAcervo_E,
        podeAlterar: PermissaoEnum.CadastroAcervo_A,
      },
    },
  ],
};
