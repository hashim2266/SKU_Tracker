import { render, screen } from '@testing-library/react';
import App from './App';

test('explains how to configure Supabase when credentials are missing', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /konfigurasi supabase diperlukan/i })).toBeInTheDocument();
  expect(screen.getByText(/REACT_APP_SUPABASE_URL/)).toBeInTheDocument();
  expect(screen.getByText(/npm start/)).toBeInTheDocument();
});
