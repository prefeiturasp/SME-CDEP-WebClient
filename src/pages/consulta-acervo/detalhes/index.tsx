import { Button, Col, Flex, Row, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import 'react-image-gallery/styles/css/image-gallery.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import {
  ConsultaAcervoDetalhesDTO,
  FieldAcervoDetalhesProps,
} from '~/core/dto/form-cadastro-detalhes';
import { ROUTES } from '~/core/enum/routes';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { obterDetalhamentoPorTipoAcervoECodigoAreaPublica } from '~/core/services/acervo-service';
import { Colors } from '~/core/styles/colors';
import { ImageGalleryDetalhesAcervo } from '../components/gallery';
import DetalhesAcervoAreaPublica from './detalhes-acervo-area-publica';
import { FieldsDetalhesArtesGraficas } from './form-fields-config/artes-graficas';
import { FieldsDetalhesAudiovisual } from './form-fields-config/audiovisual';
import { FieldsDetalhesBibliografico } from './form-fields-config/bibliografico';
import { FieldsDetalhesDocumentacaoTextual } from './form-fields-config/documentacao-historica';
import { FieldsDetalhesFotografico } from './form-fields-config/fotografico';
import { FieldsDetalhesTridimensional } from './form-fields-config/tridimensional';
import { ButtonEnviarParaMinhaSelecao } from '../components/button-enviar-para-minha-selecao';
import { PesquisaAcervoDTO } from '~/core/dto/pesquisa-acervo-dto';

export const DetalhesConsultaAcervo: React.FC = () => {
  const navigate = useNavigate();
  const paramsRoute = useParams();
  const location = useLocation();

  const state: PesquisaAcervoDTO = location.state;

  const tipoAcervoState: TipoAcervo = state?.tipo;

  const acervoId = paramsRoute?.id ? Number(paramsRoute.id) : 0;

  const [fields, setFields] = useState<FieldAcervoDetalhesProps[]>([]);
  const [dados, setDados] = useState<ConsultaAcervoDetalhesDTO>();

  const obterCampos = useCallback(() => {
    switch (tipoAcervoState) {
      case TipoAcervo.Fotografico:
        setFields(FieldsDetalhesFotografico);
        break;
      case TipoAcervo.ArtesGraficas:
        setFields(FieldsDetalhesArtesGraficas);
        break;
      case TipoAcervo.Tridimensional:
        setFields(FieldsDetalhesTridimensional);
        break;
      case TipoAcervo.Audiovisual:
        setFields(FieldsDetalhesAudiovisual);
        break;
      case TipoAcervo.DocumentacaoTextual:
        setFields(FieldsDetalhesDocumentacaoTextual);
        break;
      case TipoAcervo.Bibliografico:
        setFields(FieldsDetalhesBibliografico);
        break;
      default:
        setFields([]);
        break;
    }
  }, [tipoAcervoState]);

  useEffect(() => {
    if (tipoAcervoState) {
      obterCampos();
    } else {
      setFields([]);
    }
  }, [obterCampos, tipoAcervoState]);

  const obterDados = useCallback(async () => {
    const resposta = await obterDetalhamentoPorTipoAcervoECodigoAreaPublica(
      state?.codigo,
      state?.tipo,
    );

    if (resposta.sucesso) {
      setDados(resposta.dados);
    } else {
      setDados(undefined);
    }
  }, [state]);

  useEffect(() => {
    if (fields?.length && state?.codigo && state?.tipo) {
      obterDados();
    } else {
      setDados(undefined);
    }
  }, [acervoId, state, obterDados, fields]);

  return (
    <Col
      xs={24}
      style={{
        padding: '20px 60px',
      }}
    >
      <Row gutter={[30, 30]}>
        <Col xs={24}>
          <Row gutter={[16, 16]}>
            <Col>
              <Button
                type='link'
                style={{ marginLeft: '-16px' }}
                onClick={() => {
                  navigate(ROUTES.CONSULTA_ACERVO);
                }}
              >
                <Typography.Text
                  strong
                  underline
                  style={{ color: Colors.SystemSME.CDEP.PRIMARY, fontSize: 18 }}
                >
                  Voltar
                </Typography.Text>
              </Button>
            </Col>
            <Col>
              <ButtonEnviarParaMinhaSelecao pesquisaAcervo={state} />
            </Col>
          </Row>
        </Col>

        <Col xs={24}>
          <Row gutter={[16, 16]}>
            <Flex gap='small'>
              <ImageGalleryDetalhesAcervo
                imagens={dados?.imagens}
                enderecoImagemPadrao={dados?.enderecoImagemPadrao || ''}
              />

              <Col>
                <DetalhesAcervoAreaPublica fields={fields} dados={dados} />
              </Col>
            </Flex>
          </Row>
        </Col>
      </Row>
    </Col>
  );
};
