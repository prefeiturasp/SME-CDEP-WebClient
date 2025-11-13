import { render, screen } from '@testing-library/react';
import RelatorioDownloadAcervos from './';

test('renderiza o texto "Hello World"', () => {
  render(<RelatorioDownloadAcervos />);
  const element = screen.getByText(/hello world/i);
  expect(element).toBeInTheDocument();
});
