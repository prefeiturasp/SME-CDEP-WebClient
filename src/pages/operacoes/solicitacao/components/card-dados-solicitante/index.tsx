import React, { useEffect, useState } from 'react';
import { DadosSolicitanteDTO } from '~/core/dto/dados-solicitante-dto';
import { tratarCatch, tratarThen } from '~/core/services/api';
import usuarioService from '~/core/services/usuario-service';

const CardDadosSolicitante: React.FC = () => {
  const [dados, setDados] = useState<DadosSolicitanteDTO>();
  const [loading, setLoading] = useState<boolean>(false);

  const obterDados = async () => {
    setLoading(true);
    const resposta = await usuarioService
      .obterDadosSolicitante()
      .then(tratarThen)
      .catch(tratarCatch)
      .finally(() => setLoading(false));

    if (resposta.sucesso) {
      setDados(resposta.dados);
    }
  };

  useEffect(() => {
    obterDados();
  }, []);

  return <div>CardDadosSolicitante</div>;
};

export default CardDadosSolicitante;
