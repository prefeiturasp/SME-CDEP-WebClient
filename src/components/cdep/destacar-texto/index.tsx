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

  const comparacaoNormalizada = removerAcentos(palavraComparacao.toLowerCase());

  const palavras = palavraPraDestacar.split(/(\s+|\/+)/);

  return (
    <React.Fragment>
      {palavras.map((word, index) => {
        if (word.includes(' ') || word.includes('/')) {
          return <span key={index}>{word}</span>;
        }

        const palavraNormalizada = removerAcentos(word.toLowerCase());
        const destacada = palavraNormalizada === comparacaoNormalizada;

        return (
          <span key={index} style={{ backgroundColor: destacada ? 'yellow' : 'transparent' }}>
            {word}
          </span>
        );
      })}
    </React.Fragment>
  );
};
