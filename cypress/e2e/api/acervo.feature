# language: pt

Funcionalidade: API - Acervos

  Cenário: Retornar os tipos de acervos
    Dado que possuo um token de acesso
    Quando envio uma requisição GET para acervos tipos
    Então retorna o status 200 com os tipos de acervos cadastrados

  Cenário: Retornar todos os acervos
    Dado que possuo um token de acesso
    Quando envio uma requisição GET para o cadastro de acervos
    Então retorna o status 200 com todos os acervos cadastrados

  Cenário: Busca por tipo, título e código
    Dado que possuo um token de acesso
    Quando envio uma requisição GET com os dados do acervos
    Então retorna o status 200 e tipo, título e código

  Cenário: Busca por tipo
    Dado que possuo um token de acesso
    Quando envio uma requisição GET com o id do tipo
    Então retorna o status 200 mostrando os acervos do código

  Cenário: Busca por título
    Dado que possuo um token de acesso
    Quando envio uma requisição GET com a descrição do título
    Então retorna o status 200 mostrando os acervos da descrição

  Cenário: Busca por código
    Dado que possuo um token de acesso
    Quando envio uma requisição GET com o código do acervo
    Então retorna o status 200 referente aos cadastrados

  Cenário: Não retornar os tipos de acervos sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição GET para acervos tipos
    Então retorna o status 401 sem os tipos de acervos cadastrados

  Cenário: Pesquisar acervos
    Dado que possuo um token de acesso
    Quando envio uma requisição GET para endpoint de pesquisar
    Então retorna o status 200 pesquisando o acervo com sucesso

  Cenário: Pesquisar por tipo de acervo
    Dado que possuo um token de acesso
    Quando envio uma requisição GET pesquisando pelo tipo
    Então retorna o status 200 através do tipo de acervo

  Cenário: Pesquisar por tipo e texto livre do acervo
    Dado que possuo um token de acesso
    Quando envio a requisição GET filtrando a pesquisa
    Então retorna o status 200 através do tipo e texto livre do acervo

  Cenário: Pesquisar por tipo, texto livre do acervo e ano inicial
    Dado que possuo um token de acesso
    Quando envio a requisição GET filtrando o pesquisar
    Então retorna o status 200 através do tipo, texto livre do acervo e ano inicial do acervo

  Cenário: Pesquisar por tipo, texto livre do acervo e ano inicial/final
    Dado que possuo um token de acesso
    Quando envio a requisição GET filtrando todos os campos
    Então retorna o status 200 do tipo, texto livre do acervo e ano inicial e final do acervo

  Cenário: Retornar o termo de compromisso
    Dado que possuo um token de acesso
    Quando envio uma requisição GET das condições aceitas
    Então retorna o status 200 do termo de compromisso

  Cenário: Não retornar o termo de compromisso sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição GET das condições aceitas
    Então retorna o status 401 sem o termo de compromisso

  Cenário: Pesquisa por código tombo
    Dado que possuo um token de acesso
    Quando envio uma requisição GET de pesquisa
    Então retorna o status 200 a pesquisa por código tombo

  Cenário: Código tombo é obrigatório na pesquisa
    Dado que possuo um token de acesso
    Quando envio uma requisição GET de pesquisar sem código tombo
    Então retorna o status 422 informando que o código tombo é obrigatório

  Cenário: Não pesquisa por código tombo sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição GET de pesquisa
    Então retorna o status 401 sem a pesquisa por código tombo

  Cenário: Detalhar o acervo
    Dado que possuo um token de acesso
    Quando envio uma requisição GET de pesquisa com código e tipo
    Então retorna o status 200 detalhando o acervo

  Cenário: Código tombo é obrigatório para detalhar
    Dado que possuo um token de acesso
    Quando envio uma requisição GET de pesquisar sem código
    Então retorna o status 422 informando sem código ao detalhar

  Cenário: Tipo é obrigatório para detalhar
    Dado que possuo um token de acesso
    Quando envio uma requisição GET de pesquisar sem o tipo
    Então retorna o status 422 informando que o código tombo é obrigatório

  Cenário: Autocompletar o termo pesquisado
    Dado que possuo um token de acesso
    Quando envio uma requisição GET de pesquisa com o texto
    Então retorna o status 200 autocompletando a pesquisa

  Cenário: Termo é obrigatório para autocompletar
    Dado que possuo um token de acesso
    Quando envio uma requisição GET de pesquisa sem o texto
    Então retorna o status 422 informando que o termo é obrigatório

  Cenário: Não autocompletar o termo sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição GET de pesquisa com o texto
    Então retorna o status 401 sem autocompletar