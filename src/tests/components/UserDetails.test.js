import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UserDetails from '../../pages/userDetails/UserDetails';
import { fetchUserDetails } from '../../features/users/userSlice';
import '@testing-library/jest-dom';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

jest.mock('../../features/users/userSlice', () => ({
    fetchUserDetails: jest.fn(),
}));

const mockUserDetails = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '123456789',
    company: {
        name: 'Company A',
        address: { address: '123 Main St' },
        department: 'Engineering',
        title: 'Software Engineer',
    },
};

describe('UserDetails Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            users: {
                userDetails: null,
                status: 'idle',
                error: null,
            },
        });
    });

    test('displays loading spinner while fetching user details', async () => {
        fetchUserDetails.mockReturnValue(() => Promise.resolve({ meta: { requestStatus: 'pending' } }));

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/user/1']}>
                    <Routes>
                        <Route path="/user/:id" element={<UserDetails />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('renders user details after successful fetch', async () => {
        fetchUserDetails.mockReturnValue(() =>
            Promise.resolve({ meta: { requestStatus: 'fulfilled' }, payload: mockUserDetails })
        );

        store = mockStore({
            users: {
                userDetails: mockUserDetails,
                status: 'succeeded',
                error: null,
            },
        });

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/user/1']}>
                    <Routes>
                        <Route path="/user/:id" element={<UserDetails />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText(/User Details/i)).toBeInTheDocument();
            expect(screen.getByText(/First Name:/i)).toBeInTheDocument();
            expect(screen.getByText(/Last Name:/i)).toBeInTheDocument();
            expect(screen.getByText(/Doe/i)).toBeInTheDocument();
        });
    });

    test('displays "User not found" when no user details are available', async () => {
        fetchUserDetails.mockReturnValue(() =>
            Promise.resolve({ meta: { requestStatus: 'fulfilled' }, payload: null })
        );

        store = mockStore({
            users: {
                userDetails: null,
                status: 'succeeded',
                error: null,
            },
        });

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/user/1']}>
                    <Routes>
                        <Route path="/user/:id" element={<UserDetails />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText(/User not found/i)).toBeInTheDocument();
        });
    });
});
