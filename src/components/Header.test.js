import React from 'react';
import { render } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
    it('has text', () => {
        const { container, getByText } = render(<Header text='header text' />);
        expect(getByText('header text')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    })
});