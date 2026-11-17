import { render, screen } from '~/tests/test-utils';
import { Form } from 'antd';
import InputISBN from './input-isbn';
import InputEdicao from './input-edicao';
import InputDuracao from './input-duracao';
import InputVolume from './input-volume';
import InputNumeroDePaginas from './input-numero-de-paginas';
import {
  CDEP_INPUT_ISBN,
  CDEP_INPUT_EDICAO,
  CDEP_INPUT_DURACAO,
  CDEP_INPUT_VOLUME,
  CDEP_INPUT_NUMERO_DE_PAGINAS,
} from '~/core/constants/ids/input';
import { TipoAcervo } from '~/core/enum/tipo-acervo';

describe('Inputs Especializados de Acervo', () => {
  describe('InputISBN', () => {
    test('renderiza input com atributos corretos e prop extra', () => {
      render(
        <Form>
          <InputISBN extra={<span data-testid='extra-isbn'>Texto Extra</span>} />
        </Form>,
      );

      const input = document.querySelector(`#${CDEP_INPUT_ISBN}`) as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('maxLength', '50');
      expect(input).toHaveAttribute('type', 'text');
      expect(screen.getByTestId('extra-isbn')).toBeInTheDocument();
    });
  });

  describe('InputEdicao', () => {
    test('renderiza input com atributos corretos e prop extra', () => {
      render(
        <Form>
          <InputEdicao extra={<span data-testid='extra-edicao'>Texto Extra</span>} />
        </Form>,
      );

      const input = document.querySelector(`#${CDEP_INPUT_EDICAO}`) as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('maxLength', '30');
      expect(input).toHaveAttribute('type', 'text');
      expect(screen.getByTestId('extra-edicao')).toBeInTheDocument();
    });
  });

  describe('InputDuracao', () => {
    test('renderiza input com atributos corretos e prop extra', () => {
      render(
        <Form>
          <InputDuracao extra={<span data-testid='extra-duracao'>Texto Extra</span>} />
        </Form>,
      );

      const input = document.querySelector(`#${CDEP_INPUT_DURACAO}`) as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('maxLength', '15');
      expect(input).toHaveAttribute('type', 'text');
      expect(screen.getByTestId('extra-duracao')).toBeInTheDocument();
    });
  });

  describe('InputVolume', () => {
    test('renderiza input com atributos corretos e prop extra', () => {
      render(
        <Form>
          <InputVolume extra={<span data-testid='extra-volume'>Texto Extra</span>} />
        </Form>,
      );

      const input = document.querySelector(`#${CDEP_INPUT_VOLUME}`) as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('maxLength', '15');
      expect(input).toHaveAttribute('type', 'text');
      expect(screen.getByTestId('extra-volume')).toBeInTheDocument();
    });
  });

  describe('InputNumeroDePaginas', () => {
    test('define campo obrigatório para DocumentacaoTextual', () => {
      const { container } = render(
        <Form>
          <InputNumeroDePaginas
            tipoAcervo={TipoAcervo.DocumentacaoTextual}
            extra={<span data-testid='extra-paginas'>Extra</span>}
          />
        </Form>,
      );

      const input = document.querySelector(`#${CDEP_INPUT_NUMERO_DE_PAGINAS}`);
      expect(input).toBeInTheDocument();
      expect(screen.getByTestId('extra-paginas')).toBeInTheDocument();

      const requiredItem = container.querySelector('.ant-form-item-required');
      expect(requiredItem).toBeInTheDocument();
    });

    test('não define campo obrigatório para tipologia Bibliografico', () => {
      const { container } = render(
        <Form>
          <InputNumeroDePaginas tipoAcervo={TipoAcervo.Bibliografico} />
        </Form>,
      );

      const requiredItem = container.querySelector('.ant-form-item-required');
      expect(requiredItem).not.toBeInTheDocument();
    });
  });
});
