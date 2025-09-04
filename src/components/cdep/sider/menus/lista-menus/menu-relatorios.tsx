import { FaPrint } from 'react-icons/fa';
import { MenuEnum } from '~/core/enum/menu-enum';
import { PermissaoEnum } from '~/core/enum/permissao-enum';
import { ROUTES } from '~/core/enum/routes';
import { MenuItemCDEPProps } from '..';

export const MENU_RELATORIOS: MenuItemCDEPProps = {
  key: MenuEnum.Relatorios,
  title: 'Relatórios',
  icon: <FaPrint size={24} />,
  children: [
    {
      key: MenuEnum.LivrosEmprestados,
      title: 'Controle de livros emprestados',
      url: ROUTES.LIVROS_EMPRESTADOS,
      roles: {
        podeConsultar: PermissaoEnum.CadastroCredito_C,
        podeIncluir: PermissaoEnum.CadastroCredito_I,
        podeExcluir: PermissaoEnum.CadastroCredito_E,
        podeAlterar: PermissaoEnum.CadastroCredito_A,
      },
    },
    {
      key: MenuEnum.TomboCodigo,
      title: 'Controle de tombo/código',
      url: ROUTES.TOMBO_CODIGO,
      roles: {
        podeConsultar: PermissaoEnum.CadastroAutor_C,
        podeIncluir: PermissaoEnum.CadastroAutor_I,
        podeExcluir: PermissaoEnum.CadastroAutor_E,
        podeAlterar: PermissaoEnum.CadastroAutor_A,
      },
    },
    {
      key: MenuEnum.AutorCredito,
      title: 'Controle por autor/crédito',
      url: ROUTES.AUTOR_CREDITO,
      roles: {
        podeConsultar: PermissaoEnum.CadastroEditora_C,
        podeIncluir: PermissaoEnum.CadastroEditora_I,
        podeExcluir: PermissaoEnum.CadastroEditora_E,
        podeAlterar: PermissaoEnum.CadastroEditora_A,
      },
    },
     {
      key: MenuEnum.RelatorioEditora,
      title: 'Controle por editora',
      url: ROUTES.RELATORIO_EDITORA,
      roles: {
        podeConsultar: PermissaoEnum.CadastroEditora_C,
        podeIncluir: PermissaoEnum.CadastroEditora_I,
        podeExcluir: PermissaoEnum.CadastroEditora_E,
        podeAlterar: PermissaoEnum.CadastroEditora_A,
      },
    },
    {
      key: MenuEnum.RelatorioDevolucaoLivro,
      title: 'Controle de devolução de livros em atraso',
      url: ROUTES.RELATORIO_DEVOLUCAO_LIVRO,
      roles: {
        podeConsultar: PermissaoEnum.CadastroCredito_C,
        podeIncluir: PermissaoEnum.CadastroCredito_I,
        podeExcluir: PermissaoEnum.CadastroCredito_E,
        podeAlterar: PermissaoEnum.CadastroCredito_A,
      },
    },
  ],
};
