# language: pt

Funcionalidade: API - Painel gerencial de acervos cadastrados

  Cenário: Retornar os tipos de acervos cadastrados
    Dado que possuo um token de acesso
    Quando envio uma requisição GET para o painel gerencial
    Então retorna o status 200 com os tipos de acervos cadastrados

  Cenário: Não retornar os tipos de acervos cadastrados sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição GET para o painel gerencial
    Então retorna o status 401 sem os tipos de acervos cadastrados

  Cenário: Retornar quantidade de pesquisas mensais
    Dado que possuo um token de acesso
    Quando envio a requisição GET para o painel gerencial
    Então retorna o status 200 com a quantidade pesquisas mensais

  Cenário: Não retornar quantidade de pesquisas mensais sem autenticação
    Dado que não possuo um token de acesso
    Quando tento uma requisição GET para o painel gerencial
    Então retorna o status 401 sem quantidade pesquisas mensais

  Cenário: Retornar quantidade de solicitações mensais
    Dado que possuo um token de acesso
    Quando envio o GET para o painel gerencial
    Então retorna o status 200 com a quantidade solicitações mensais

  Cenário: Não retornar quantidade de solicitações mensais sem autenticação
    Dado que não possuo um token de acesso
    Quando tento enviar GET para o painel gerencial
    Então retorna o status 401 sem quantidade solicitações mensais

  Cenário: Buscar as solicitações por tipos de acervo
    Dado que possuo um token de acesso
    Quando envio o GET para as solicitações no painel gerencial
    Então retorna o status 200 buscando as solicitações por tipos de acervo

  Cenário: Não busca as solicitações por tipos de acervo sem autenticação
    Dado que não possuo um token de acesso
    Quando tento enviar o GET para as solicitações no painel gerencial
    Então retorna o status 401 sem as solicitações por tipos de acervo

  Cenário: Buscar os livros emprestados
    Dado que possuo um token de acesso
    Quando envio o GET para livros emprestados no painel gerencial
    Então retorna o status 200 buscando os livros emprestados

  Cenário: Não busca os livros emprestados sem autenticação
    Dado que não possuo um token de acesso
    Quando tento enviar o GET para livros emprestados no painel gerencial
    Então retorna o status 401 sem os livros emprestados

  Cenário: Buscar solicitações por situação
    Dado que possuo um token de acesso
    Quando envio o GET para solicitações no painel gerencial
    Então retorna o status 200 buscando por situação

  Cenário: Não busca solicitações por situação sem autenticação
    Dado que não possuo um token de acesso
    Quando tento enviar o GET para solicitações no painel gerencial
    Então retorna o status 401 sem buscar por situação