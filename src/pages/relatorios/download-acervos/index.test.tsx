import { render, screen } from '~/tests/test-utils';
import RelatorioDownloadAcervos from './';

test('renderiza o componente RelatorioDownloadAcervos', () => {
  render(<RelatorioDownloadAcervos />);
  const element = screen.getByText(/Download de Acervos/i);
  expect(element).toBeInTheDocument();
});
