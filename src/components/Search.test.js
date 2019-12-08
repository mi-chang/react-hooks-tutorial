import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Search from './Search';

describe('Search', () => {
    it('handles SearchInputChanges', () => {
        const { component, getByLabelText } = render(<Search />);
        
        expect(component).toMatchSnapshot();

        const textbox = getByLabelText('Title');
        expect(textbox.value).toBe('');
        fireEvent.change(textbox, { target: { value: 'abc' } });
        expect(textbox.value).toBe('abc');

        expect(component).toMatchSnapshot();
    });

    it('calls search', () => {
        const search = jest.fn();
        const { component, getByLabelText, getByText } = render(<Search search={search} />);
        
        expect(component).toMatchSnapshot();

        const textbox = getByLabelText('Title');
        expect(textbox.value).toBe('');
        fireEvent.change(textbox, { target: { value: 'abc' } });
        expect(textbox.value).toBe('abc');
        expect(component).toMatchSnapshot();

        expect(search).toHaveBeenCalledTimes(0);
        fireEvent.click(getByText('SEARCH'));
        expect(search).toBeCalledTimes(1);
        expect(search).toBeCalledWith('abc');
        expect(textbox.value).toBe('');
        expect(component).toMatchSnapshot();
    })
});
