import React from 'react';
import { render } from '@testing-library/react';
import Movie from './Movie';

describe('Movie', () => {
    it('has default image', () => {
        const { container, getByText, getByAltText, getByRole } = render(<Movie movie={
            {
                Poster: 'N/A',
                Title: 'Default Image Title',
                Year: 1111
            }} />);
        expect(getByText('Default Image Title')).toBeInTheDocument();
        expect(getByText('(1111)')).toBeInTheDocument();
        expect(getByAltText('The movie titled: Default Image Title')).toBeInTheDocument();
        expect(getByRole('img').src).toBe('https://m.media-amazon.com/images/M/MV5BMTczNTI2ODUwOF5BMl5BanBnXkFtZTcwMTU0NTIzMw@@._V1_SX300.jpg');
        expect(container).toMatchSnapshot();
    });

    it('has an image', () => {
        const { container, getByText, getByAltText, getByRole } = render(<Movie movie={
            {
                Poster: 'https://some.com/uri/to/poster/image',
                Title: 'An Image Title',
                Year: 2222
            }} />);
        expect(getByText('An Image Title')).toBeInTheDocument();
        expect(getByText('(2222)')).toBeInTheDocument();
        expect(getByAltText('The movie titled: An Image Title')).toBeInTheDocument();
        expect(getByRole('img').src).toBe('https://some.com/uri/to/poster/image');
        expect(container).toMatchSnapshot();
    });
});
