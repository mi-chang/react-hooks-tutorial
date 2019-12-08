import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('shows loading before request', () => {
    const { container, getByText } = render(<App />);
 
    expect(getByText('Sharing a few our favourite movies')).toBeInTheDocument();
    expect(getByText('loading...')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  })

  it('searches "man" at first', async () => {
    const fetchAPI = jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          Response: 'True',
          Search: [
            {
              Title: 'man',
              Poster: 'http://some.com/image/man',
              Year: 1111
            }
          ]
        })
      })
    );
    
    let myContainer, myGetByText, myGetByRole, myGetByAltText;
    await act(async () => {
      const { container, getByText, getByRole, getByAltText }
        = render(<App />);
      // TODO Better way must exist.
      [myContainer, myGetByText, myGetByRole, myGetByAltText]
        = [container, getByText, getByRole, getByAltText];
    });

    expect(myGetByText('Sharing a few our favourite movies')).toBeInTheDocument();
    expect(myGetByText('man')).toBeInTheDocument();
    expect(myGetByText('(1111)')).toBeInTheDocument();
    expect(myGetByAltText('The movie titled: man')).toBeInTheDocument();
    expect(myGetByRole('img').src).toBe('http://some.com/image/man');
    expect(fetchAPI).toBeCalledTimes(1);
    expect(fetchAPI.mock.calls[0][0]).toContain('s=man');
    expect(myContainer).toMatchSnapshot();

    fetchAPI.mockRestore();
  });

  it('searches "woman"', async () => {
    const fetchAPI = jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          Response: 'True',
          Search: [
            {
              Title: 'man',
              Poster: 'http://some.com/image/man',
              Year: 1111
            }
          ]
        })
      })
    );
    
    let myContainer, myGetByLabelText, myGetByText, myGetByRole, myGetByAltText;
    await act(async () => {
      const { container, getByLabelText, getByText, getByRole, getByAltText }
        = render(<App />);
      // TODO Better way must exist.
      [myContainer, myGetByLabelText, myGetByText, myGetByRole, myGetByAltText]
        = [container, getByLabelText, getByText, getByRole, getByAltText];
    });
    expect(fetchAPI).toBeCalledTimes(1);

    fetchAPI.mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          Response: 'True',
          Search: [
            {
              Title: 'woman',
              Poster: 'http://some.com/image/woman',
              Year: 2222
            }
          ]
        })
      })
    );
    fireEvent.change(myGetByLabelText('Title'), { target: { value: 'woman' } });
    await act(async () => fireEvent.click(myGetByText('SEARCH')));

    expect(myGetByText('Sharing a few our favourite movies')).toBeInTheDocument();
    expect(myGetByText('woman')).toBeInTheDocument();
    expect(myGetByText('(2222)')).toBeInTheDocument();
    expect(myGetByAltText('The movie titled: woman')).toBeInTheDocument();
    expect(myGetByRole('img').src).toBe('http://some.com/image/woman');
    expect(fetchAPI).toBeCalledTimes(2);
    expect(fetchAPI.mock.calls[1][0]).toContain('s=woman');
    expect(myContainer).toMatchSnapshot();

    fetchAPI.mockRestore();
  });

  it('shows error message', async () => {
    const fetchAPI = jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          Response: 'True',
          Search: [
            {
              Title: 'aaa',
              Poster: 'http://some.com/image/aaa',
              Year: 1111
            }
          ]
        })
      })
    );
    
    let myContainer, myGetByLabelText, myGetByText;
    await act(async () => {
      const { container, getByLabelText, getByText } = render(<App />);
      // TODO Better way must exist.
      [myContainer, myGetByLabelText, myGetByText] = [container, getByLabelText, getByText];
    });
    expect(fetchAPI).toBeCalledTimes(1);

    fetchAPI.mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          Response: 'False',
          Error: 'Somethig bad!'
        })
      })
    );
    fireEvent.change(myGetByLabelText('Title'), { target: { value: 'abc' } });
    await act(async () => fireEvent.click(myGetByText('SEARCH')));

    expect(myGetByText('Sharing a few our favourite movies')).toBeInTheDocument();
    expect(myGetByText('Somethig bad!')).toBeInTheDocument();
    expect(fetchAPI).toBeCalledTimes(2);
    expect(fetchAPI.mock.calls[1][0]).toContain('s=abc');
    expect(myContainer).toMatchSnapshot();

    fetchAPI.mockRestore();
  });
});
