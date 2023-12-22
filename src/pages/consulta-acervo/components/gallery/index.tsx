import React from 'react';
import ReactImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';
import styled from 'styled-components';
import cdepLogo from '~/assets/cdep-logo-centralizado.svg';

const ImageGalleryContainer = styled.div`
  .image-gallery {
    width: 400px !important;
  }
`;

type ImageGalleryDetalhesAcervoProps = {
  imagens?: ReactImageGalleryItem[];
};
export const ImageGalleryDetalhesAcervo: React.FC<ImageGalleryDetalhesAcervoProps> = ({
  imagens,
}) => {
  const temImagens = !!imagens?.length;

  const items: ReactImageGalleryItem[] = temImagens
    ? imagens
    : [
        {
          original: cdepLogo,
          thumbnail: cdepLogo,
        },
      ];
  return (
    <ImageGalleryContainer>
      <ReactImageGallery
        items={items}
        autoPlay={false}
        showBullets={false}
        showPlayButton={false}
        showFullscreenButton={temImagens}
        showThumbnails={temImagens}
      />
    </ImageGalleryContainer>
  );
};
