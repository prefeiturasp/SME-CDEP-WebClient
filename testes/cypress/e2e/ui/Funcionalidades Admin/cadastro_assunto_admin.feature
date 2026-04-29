# language: pt

Funcionalidade: Cadastro de Assunto

  Contexto:
    Dado eu acesso o sistema com a visualização "web"
    E realizo login no sistema CDEP com perfil "Admin"    

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Assunto
    Quando crio cadastro de assunto "<tipo>"
    Então o sistema salva o assunto

    Exemplos:
      | tipo    | caso                           |
      | acervo  | Assunto cadastrado com sucesso |

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Assunto
    Quando crio cadastro de assunto "<tipo>"
    E tento cadastro o mesmo nome no assunto
    Então o sistema não permite salvar o assunto duplicado

    Exemplos:
      | tipo    | caso                            |
      | acervo  | Não permitir registro duplicado |

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Assunto
    Quando clico em novo cadastro de assunto "<tipo>"
    E tento salvar sem nome do assunto
    Então o sistema não permite salvar sem título do assunto

    Exemplos:
      | tipo    | caso                            |
      | acervo  | Título do assunto é obrigatório |


