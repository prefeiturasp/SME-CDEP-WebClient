# language: pt

Funcionalidade: API - Acervos de empréstimos

  Cenário: Retornar situações de acervos de empréstimos
    Dado que possuo um token de acesso
    Quando envio uma requisição GET para acervos de empréstimos
    Então retorna o status 200 com todas situações 

  Cenário: Não retorna situações de acervos de empréstimos sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição GET para acervos de empréstimos
    Então retorna o status 401 sem situações dos acervos

  Cenário: Prorrogar empréstimo de acervo
    Dado que possuo um token de acesso
    Quando envio uma requisição PUT na solicitação
    Então retorna o status 200 prorrogando o empréstimo

  Cenário: Prorrogar empréstimo somente com data posterior
    Dado que possuo um token de acesso
    Quando envio uma requisição PUT na solicitação informando data inferior
    Então retorna o status 601 que prorroga somente com data posterior

  Cenário: Código da solicitação é obrigatório
    Dado que possuo um token de acesso
    Quando envio uma requisição PUT sem o ID
    Então retorna o status 422 que o código da solicitação é obrigatório

  Cenário: Código da solicitação inválido
    Dado que possuo um token de acesso
    Quando envio uma requisição PUT com o ID incorreto
    Então retorna o status 422 que o código da solicitação inválido

  Cenário: Não prorrogar empréstimo de acervo sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição PUT na solicitação
    Então retorna o status 401 sem prorrogar empréstimo de acervo

  Cenário: Devolver empréstimo de acervo
    Dado que possuo um token de acesso
    Quando envio a requisição PUT na solicitação
    Então retorna o status 200 devolvendo o empréstimo 

  Cenário: Código da solicitação inválido na devolução
    Dado que possuo um token de acesso
    Quando envio uma requisição PUT com ID incorreto
    Então retorna o status 422 que devolução é inválida
  
  Cenário: Código da solicitação vazio na devolução
    Dado que possuo um token de acesso
    Quando envio uma requisição PUT com o ID vazio
    Então retorna o status 404 que a devolução deve ser preenchido

  Cenário: Não devolver empréstimo de acervo sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição PUT na solicitação de devolução
    Então retorna o status 401 sem devolver empréstimo de acervo