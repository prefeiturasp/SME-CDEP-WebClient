# language: pt

Funcionalidade: API - Menu

  Cenário: Acessar o menu do sistema
    Dado que possuo um token de acesso
    Quando envio uma requisição GET
    Então retorna o menu com status 200

  Cenário: Não acessar o menu sem autenticação
    Dado que não possuo um token de acesso
    Quando tento uma requisição GET
    Então não carrega o menu retornando o status 401
