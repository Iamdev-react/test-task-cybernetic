import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import UserList from '../../pages/userList/UserList';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

const mockUsers = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '123456789', company: { name: 'Company A' } },
    { id: 2, firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', phone: '987654321', company: { name: 'Company B' } }
];

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('UserList Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            users: {
                users: mockUsers,
                status: 'succeeded',
                error: null
            }
        });
    });

    test('renders user list table with data', () => {
        render(
            <Provider store={mockStore({
                users: {
                    users: mockUsers,
                    status: 'succeeded',
                    error: null
                }
            })}>
                <MemoryRouter>
                    <UserList />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });

    test('filters user list based on search input', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <UserList />
                </MemoryRouter>
            </Provider>
        );
        
        const searchInput = screen.getByPlaceholderText('Search by Name');
        fireEvent.change(searchInput, { target: { value: 'John' } });

        expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
});
