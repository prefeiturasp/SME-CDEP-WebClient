import React from 'react';

interface DestacarTextoProps {
  palavraPraDestacar: string;
  palavraComparacao?: string;
}

export const DestacarTexto: React.FC<DestacarTextoProps> = ({
  palavraPraDestacar,
  palavraComparacao,
}) => {
  const removerAcentos = (str: string): string => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  if (!palavraComparacao) return palavraPraDestacar;

  const normalizarPalabraComparacao = removerAcentos(palavraComparacao);
  const regex = new RegExp(
    `(${normalizarPalabraComparacao.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
    'gi',
  );

  return palavraPraDestacar.split(' ').map((word, index, words) => {
    const normalizarPalavra = removerAcentos(word).toLowerCase();
    const destacada = regex.test(normalizarPalavra);

    return (
      <React.Fragment key={index}>
        <span style={{ backgroundColor: destacada ? 'yellow' : 'transparent' }}>{word}</span>
        {index < words.length - 1 ? ' ' : ''}
      </React.Fragment>
    );
  });
};
