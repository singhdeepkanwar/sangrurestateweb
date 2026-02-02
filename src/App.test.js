import { render, screen } from '@testing-library/react';
import App from './App';

test('renders App without crashing', () => {
  render(<App />);
  // Check for some text from LandingPage
  const linkElement = screen.getAllByText(/Sangrur/i)[0];
  expect(linkElement).toBeInTheDocument();
});
