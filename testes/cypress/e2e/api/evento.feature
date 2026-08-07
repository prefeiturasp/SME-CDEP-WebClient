# language: pt

Funcionalidade: API - Evento

  Cenário: Criar evento no calendário
    Dado que não possuo um token de acesso
    Quando envio uma requisição para criar um evento
    Então retorna criação do evento com status 200
    Quando envio uma requisição DELETE do evento criado
    Então retorna exclusão do evento com status 200

  Cenário: Não cria evento sem envio de campos obrigatório
    Dado que não possuo um token de acesso
    Quando envio uma requisição para criar um evento sem campos necesssários
    Então não cria evento sem envio de campos obrigatório com status 422

  Cenário: Não criar evento no calendário sem autenticação
    Dado que não possuo um token de acesso
    Quando tento uma requisição para criar um evento
    Então não retorna criação do evento com status 401

  Cenário: Excluir evento no calendário
    Dado que não possuo um token de acesso
    Quando envio uma requisição para criar um evento
    Então retorna criação do evento com status 200    
    Quando envio uma requisição DELETE do evento criado
    Então retorna exclusão do evento com status 200

  Cenário: Não excluir evento sem o id 
    Dado que não possuo um token de acesso
    Quando envio uma requisição DELETE sem id evento
    Então não retorna exclusão do evento com status 405

  Cenário: Não excluir evento no calendário sem autenticação 
    Dado que não possuo um token de acesso 
    Quando tento uma requisição DELETE do evento criado
    Então não retorna exclusão do evento com status 401

  Cenário: Buscar com tag de dia e mês
    Dado que possuo um token de acesso
    Quando envio uma requisição GET com tag de evento
    Então retorna eventos de dia e mês com status 200

  Cenário: Dia e mês obrigatório na busca
    Dado que possuo um token de acesso
    Quando envio uma requisição GET de tag sem dia e mês
    Então retorna obrigatório nos eventos de dia e mês com status 601

  Cenário: Não buscar com tag de dia e mês sem autenticação
    Dado que não possuo um token de acesso
    Quando tento uma requisição GET com tag
    Então não retorna eventos de dia e mês com status 401

  Cenário: Buscar mês no calendário
    Dado que possuo um token de acesso
    Quando envio uma requisição GET com mês
    Então retorna eventos do mês no calendário com status 200

  Cenário: Mês no calendário obrigatório na busca
    Dado que possuo um token de acesso
    Quando envio uma requisição GET sem mês do evento
    Então retorna obrigatório nos eventos o mês com status 422

  Cenário: Não buscar mês no calendário sem autenticação
    Dado que não possuo um token de acesso
    Quando tento uma requisição GET com mês
    Então não retorna mês no calendário com status 401

  Cenário: Buscar detalhes do evento do dia
    Dado que possuo um token de acesso
    Quando envio uma requisição GET no detalhes do evento
    Então retorna detalhes do evento do dia com status 200

  Cenário: Dia e mês obrigatório no detalhes do evento
    Dado que possuo um token de acesso
    Quando envio uma requisição GET sem dia e mês no detalhes do evento
    Então retorna obrigatório nos detalhes de dia e mês com status 601

  Cenário: Não buscar detalhes do evento do dia sem autenticação
    Dado que não possuo um token de acesso
    Quando tento uma requisição GET no detalhes do evento
    Então não retorna detalhes de dia e mês com status 401

  Cenário: Buscar por id do evento
    Dado que possuo um token de acesso
    Quando envio uma requisição para criar um evento
    Então retorna criação do evento com status 200
    Quando envio uma requisição GET com id de evento
    Então retorna eventos do id com status 200
    Quando envio uma requisição DELETE do evento criado
    Então retorna exclusão do evento com status 200

  Cenário: Id do evento obrigatório na busca
    Dado que possuo um token de acesso
    Quando envio uma requisição GET sem id de evento
    Então retorna obrigatório sem id evento com status 601

  Cenário: Não buscar id do evento sem autenticação
    Dado que não possuo um token de acesso
    Quando tento uma requisição GET com id de evento
    Então não retorna eventos do id com status 401
