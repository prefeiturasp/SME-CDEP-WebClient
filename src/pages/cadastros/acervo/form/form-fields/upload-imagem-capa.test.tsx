import { render, screen, fireEvent, waitFor } from '~/tests/test-utils';
import { message } from 'antd';
import UploadImagemCapa from './upload-imagem-capa';

jest.mock('antd', () => {
  const original = jest.requireActual('antd');
  return {
    ...original,
    message: {
      ...original.message,
      error: jest.fn(),
    },
  };
});

describe('UploadImagemCapa', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza botão de upload inicialmente quando não há imagem', () => {
    render(<UploadImagemCapa />);
    expect(screen.getByText('Adicionar capa')).toBeInTheDocument();
  });

  test('renderiza prévia da imagem quando value é fornecido', () => {
    render(<UploadImagemCapa value='data:image/png;base64,mockImage' />);
    const img = screen.getByAltText('Prévia da Capa do Documento');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'data:image/png;base64,mockImage');
  });

  test('remove a imagem ao clicar no botão de fechar e chama onChange com null', () => {
    const handleChange = jest.fn();
    render(<UploadImagemCapa value='data:image/png;base64,mockImage' onChange={handleChange} />);

    const removeBtn = screen.getByRole('button');
    fireEvent.click(removeBtn);

    expect(handleChange).toHaveBeenCalledWith(null);
    expect(screen.queryByAltText('Prévia da Capa do Documento')).not.toBeInTheDocument();
    expect(screen.getByText('Adicionar capa')).toBeInTheDocument();
  });

  test('rejeita arquivo com tipo não permitido e exibe mensagem de erro', async () => {
    const { container } = render(<UploadImagemCapa />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    const invalidFile = new File(['dummy content'], 'document.pdf', { type: 'application/pdf' });
    fireEvent.change(input, { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Você só pode carregar imagens JPG/PNG!');
    });
  });

  test('rejeita imagem com tamanho superior a 5MB e exibe mensagem de erro', async () => {
    const { container } = render(<UploadImagemCapa />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    const largeFile = new File(['dummy content'], 'large.png', { type: 'image/png' });
    Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 });

    fireEvent.change(input, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('A imagem deve ser menor que 5MB!');
    });
  });

  test('converte imagem válida em base64 e chama onChange', async () => {
    const handleChange = jest.fn();
    const { container } = render(<UploadImagemCapa onChange={handleChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    const validFile = new File(['valid content'], 'foto.jpg', { type: 'image/jpeg' });
    Object.defineProperty(validFile, 'size', { value: 1024 });

    // Mock FileReader
    const mockFileReader = {
      readAsDataURL: jest.fn(function (this: any) {
        this.result = 'data:image/jpeg;base64,validBase64';
        this.onload?.();
      }),
      addEventListener: jest.fn(function (this: any, event: string, cb: any) {
        if (event === 'load') {
          this.onload = cb;
        }
      }),
    };
    jest.spyOn(window, 'FileReader').mockImplementation(() => mockFileReader as any);

    fireEvent.change(input, { target: { files: [validFile] } });

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith('data:image/jpeg;base64,validBase64');
    });
  });
});
