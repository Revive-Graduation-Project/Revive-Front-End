import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CustomerReviews from '../../../components/Dashboard/CustomerReviews';

const mockReviews = [
  {
    id: 1,
    title: 'Amazing food!',
    comment: 'Really loved the Avocado Bowl. Healthy and tasty.',
    name: 'Alice Smith',
    rating: 5,
    date: '2024-01-15',
    time: '14:30',
    image: 'https://example.com/food1.jpg',
  },
  {
    id: 2,
    title: 'Good experience',
    comment: 'Service was okay but food was delicious.',
    name: 'Bob Johnson',
    rating: 3,
    date: '2024-01-16',
    time: '10:00',
    image: 'https://example.com/food2.jpg',
  },
];

describe('CustomerReviews', () => {
  test('renders the section heading', () => {
    render(<CustomerReviews data={[]} />);
    expect(screen.getByText('Customer Reviews')).toBeInTheDocument();
  });

  test('renders a card for each review', () => {
    render(<CustomerReviews data={mockReviews} />);
    expect(screen.getByText('Amazing food!')).toBeInTheDocument();
    expect(screen.getByText('Good experience')).toBeInTheDocument();
  });

  test('renders review comment text', () => {
    render(<CustomerReviews data={mockReviews} />);
    expect(screen.getByText('Really loved the Avocado Bowl. Healthy and tasty.')).toBeInTheDocument();
  });

  test('renders reviewer name', () => {
    render(<CustomerReviews data={mockReviews} />);
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
  });

  test('renders reviewer rating', () => {
    render(<CustomerReviews data={mockReviews} />);
    // Ratings shown as text beside star rating
    const ratings = screen.getAllByText('5');
    expect(ratings.length).toBeGreaterThanOrEqual(1);
    const ratingsThree = screen.getAllByText('3');
    expect(ratingsThree.length).toBeGreaterThanOrEqual(1);
  });

  test('renders date and time', () => {
    render(<CustomerReviews data={mockReviews} />);
    expect(screen.getByText('2024-01-15')).toBeInTheDocument();
    expect(screen.getByText('14:30')).toBeInTheDocument();
  });

  test('falls back to "Customer Review" when title is missing', () => {
    const reviewsWithoutTitle = [{ ...mockReviews[0], id: 99, title: undefined }];
    render(<CustomerReviews data={reviewsWithoutTitle} />);
    expect(screen.getByText('Customer Review')).toBeInTheDocument();
  });

  test('falls back to "No review text available." when comment is missing', () => {
    const reviewsWithoutComment = [{ ...mockReviews[0], id: 99, comment: undefined }];
    render(<CustomerReviews data={reviewsWithoutComment} />);
    expect(screen.getByText('No review text available.')).toBeInTheDocument();
  });

  test('shows "-" for missing date and time', () => {
    const reviewMissingDatetime = [{ ...mockReviews[0], id: 99, date: undefined, time: undefined }];
    render(<CustomerReviews data={reviewMissingDatetime} />);
    const dashes = screen.getAllByText('-');
    expect(dashes.length).toBeGreaterThanOrEqual(2);
  });

  test('renders initials correctly for two-word name', () => {
    render(<CustomerReviews data={[mockReviews[0]]} />);
    // Alice Smith → "AS"
    expect(screen.getByText('AS')).toBeInTheDocument();
  });

  test('renders "U" as initials for empty name', () => {
    const reviewNoName = [{ ...mockReviews[0], id: 99, name: '' }];
    render(<CustomerReviews data={reviewNoName} />);
    expect(screen.getByText('U')).toBeInTheDocument();
  });

  test('renders empty state with no review cards when data is empty array', () => {
    const { container } = render(<CustomerReviews data={[]} />);
    // No review cards should be rendered
    const cards = container.querySelectorAll('.rounded-3xl');
    expect(cards).toHaveLength(0);
    // Heading is still present
    expect(screen.getByText('Customer Reviews')).toBeInTheDocument();
  });

  test('renders food image with alt text', () => {
    render(<CustomerReviews data={[mockReviews[0]]} />);
    const img = screen.getByRole('img', { name: 'dish' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/food1.jpg');
  });
});