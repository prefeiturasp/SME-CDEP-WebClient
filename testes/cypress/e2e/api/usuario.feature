# language: pt

Funcionalidade: API - Usuario

  Cenário: Buscar cadastro do usuário
    Dado que possuo um token válido no endpoint Usuario
    Quando envio uma requisição GET buscar o usuário
    Então retorna o status 200 com cadastro do usuário

  Cenário: Não buscar cadastro do usuário inválido
    Dado que possuo um token válido no endpoint Usuario
    Quando envio uma requisição GET buscar sem usuário válido
    Então retorna o status 405 sem cadastro do usuário

  Cenário: Não buscar cadastro do usuário sem autenticação
    Dado que não possuo um token válido
    Quando tento a requisição GET buscar o usuário
    Então retorna o status 401 sem cadastro do usuário

  Cenário: Validar perfis responsáveis usuário
    Dado que possuo um token válido no endpoint Usuario
    Quando envio uma requisição GET perfis responsáveis
    Então retorna o status 200 validando perfis responsáveis usuário

  Cenário: Não busca perfis responsáveis usuário sem autenticação
    Dado que não possuo um token válido
    Quando tento a requisição GET perfis responsáveis
    Então retorna o status 401 sem perfis responsáveis usuário

  Cenário: Buscar dados solicitante do usuário
    Dado que possuo um token válido no endpoint Usuario
    Quando envio uma requisição GET dados solicitante
    Então retorna o status 200 dados solicitante do usuário

  Cenário: Não buscar dados solicitante do usuário sem autenticação
    Dado que não possuo um token válido
    Quando tento a requisição GET dados solicitante
    Então retorna o status 401 sem dados solicitante do usuário

  Cenário: Alterar senha do usuário
    Dado que possuo um token válido no endpoint Usuario
    Quando envio uma requisição PUT com usuário da senha
    Então retorna o status 200 alterando a senha do usuário

  Cenário: Não alterar senha sem usuário
    Dado que possuo um token válido no endpoint Usuario
    Quando envio uma requisição PUT sem usuário da senha
    Então retorna o status 405 sem alterar senha do usuário

  Cenário: Não alterar senha sem autenticação
    Dado que não possuo um token válido
    Quando tento a requisição PUT com usuário da senha
    Então retorna o status 401 sem alterar senha do usuário  

  Cenário: Alterar e-mail com usuário
    Dado que possuo um token válido no endpoint Usuario
    Quando envio uma requisição PUT com usuário para e-mail
    Então retorna o status 200 alterando e-mail do usuário

  Cenário: Não alterar e-mail sem o dado no usuário
    Dado que possuo um token válido no endpoint Usuario
    Quando envio uma requisição PUT Usuario sem e-mail
    Então retorna o status 601 sem alterar o e-mail de Usuario

  Cenário: Não alterar e-mail sem usuário na requisição
    Dado que possuo um token válido no endpoint Usuario
    Quando envio uma requisição PUT sem usuário do campo email
    Então retorna o status 422 sem alterar email do usuário

  Cenário: Não alterar email sem autenticação
    Dado que não possuo um token válido
    Quando tento a requisição PUT com usuário para e-mail
    Então retorna o status 401 sem alterar email do usuário

  Cenário: Alterar telefone do usuário
    Dado que possuo um token válido no endpoint Usuario
    Quando envio uma requisição PUT com telefone do usuário
    Então retorna o status 200 alterando telefone do usuário

  Cenário: Não alterar telefone sem o dado no usuário
    Dado que possuo um token válido no endpoint Usuario
    Quando envio uma requisição PUT Usuario sem telefone
    Então retorna o status 601 sem alterar telefone de Usuario

  Cenário: Não alterar telefone sem autenticação
    Dado que não possuo um token válido
    Quando tento a requisição PUT com telefone do usuário
    Então retorna o status 401 sem alterar telefone do usuário

  Cenário: Alterar endereço do usuário
    Dado que possuo um token válido no endpoint Usuario
    Quando envio uma requisição PUT com endereço do usuário
    Então retorna o status 200 alterando endereço do usuário

  Cenário: Não alterar endereço sem o dado no usuário
    Dado que possuo um token válido no endpoint Usuario
    Quando envio uma requisição PUT Usuario sem endereço
    Então retorna o status 422 sem alterar endereço de Usuario

  Cenário: Não alterar endereço sem autenticação
    Dado que não possuo um token válido
    Quando tento a requisição PUT com endereço do usuário
    Então retorna o status 401 sem alterar endereço do usuário

  Cenário: Buscar dados solicitante por usuário
    Dado que possuo um token válido no endpoint Usuario
    Quando envio uma requisição GET dados por solicitante
    Então retorna o status 200 dados solicitante por usuário

  Cenário: Não buscar dados solicitante sem usuário
    Dado que possuo um token válido no endpoint Usuario
    Quando envio uma requisição GET dados sem solicitante
    Então retorna o status 422 não buscando dados solicitante sem usuário

  Cenário: Não buscar dados solicitante por usuário sem autenticação
    Dado que não possuo um token válido
    Quando tento a requisição GET dados por solicitante
    Então retorna o status 401 sem dados solicitante por usuário

  Cenário: Consulta se documento do usuário existe
    Dado que possuo um token válido no endpoint Usuario
    Quando envio uma requisição GET existência de solicitante
    Então retorna o status 601 que documento do usuário existe

  Cenário: Não busca documento do usuário existe
    Dado que possuo um token válido no endpoint Usuario
    Quando envio uma requisição GET existência sem documento solicitante
    Então retorna o status 422 não buscando documento do usuário existe

  Cenário: Não buscar ddocumento do usuário existe sem autenticação
    Dado que não possuo um token válido
    Quando tento a requisição GET existência de solicitante
    Então retorna o status 401 sem documento do usuário existe