"use client"

import { useCallback, useEffect, useRef, useState } from 'react';
import Search from './search'
import axios from 'axios';
import UserList from './User-List';
import toast, { Toaster } from 'react-hot-toast';

interface User {
    login: string;
    avatar_url: string;
    html_url: string;
    score: number;
}

const UserComponent = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [query, setQuery] = useState<string>("");
    const [sortOption, setSortOption] = useState<string>("Name (A - Z)");
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const previousQuery = useRef<string>("");

    const fetchUsers = useCallback(async () => {
        try {
            const response = await axios.get(`https://api.github.com/search/users`, {
                params: { q: query, per_page: 10, page },
            });
            setUsers(response.data.items);
            setTotalPages(Math.ceil(response.data.total_count / 10));
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                toast.error("API rate limit exceeded \n Please try again later.");
            } else {
                toast.error("Error fetching users \n Please try again.");
            }
        }
    }, [query, page]);

    useEffect(() => {
        if (query) fetchUsers();
    }, [query, page, fetchUsers]);

    const handleInputChange = (input: string) => {
        setQuery(input);
        if (input !== previousQuery.current) {
            setPage(1); // Reset to page 1 only if the query changes
            previousQuery.current = input;
        }
    };

    const handleSortChange = (sort: string) => {
        setSortOption(sort);
        setUsers((prevUsers) => sortUsers(prevUsers, sort));
    };

    const sortUsers = (users: User[], sortOption: string) => {
        const sortedUsers = [...users];
        switch (sortOption) {
            case "Name (A - Z)":
                return sortedUsers.sort((a, b) => a.login.localeCompare(b.login));
            case "Name (Z - A)":
                return sortedUsers.sort((a, b) => b.login.localeCompare(a.login));
            case "Rank ↑":
                return sortedUsers.sort((a, b) => a.score - b.score);
            case "Rank ↓":
                return sortedUsers.sort((a, b) => b.score - a.score);
            default:
                return users;
        }
    };

    return (
        <div className="">
            <div className='bg-[#147abc]'>
                <div className='max-w-screen-sm mx-auto p-4 flex flex-row justify-between gap-4 sm:gap-10'>
                    <select
                        value={sortOption}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="px-4 rounded-md w-full sm:w-96 outline-none"
                    >
                        <option>Name (A - Z)</option>
                        <option>Name (Z - A)</option>
                        <option>Rank ↑</option>
                        <option>Rank ↓</option>
                    </select>
                    <Search onSearch={handleInputChange} />
                </div>
            </div>

            <div className='max-w-screen-sm mx-auto p-4'>
                {users.length > 0 && <div>Total Results: {totalPages}</div>}

                {users.length ?
                    <UserList users={users} />
                    :
                    <div className=' text-center mt-20'>Start searching users</div>
                }

                {users.length > 0 &&
                    <div className="flex justify-between items-center mt-4">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className={`bg-[#147abc] text-white px-4 py-2 rounded-md ${page === 1 && "pointer-events-none opacity-50"}`}
                        >
                            Previous
                        </button>
                        <p>
                            Page {page} of {totalPages}
                        </p>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className={`bg-[#147abc] text-white px-4 py-2 rounded-md ${page === totalPages && "pointer-events-none opacity-50"}`}
                        >
                            Next
                        </button>
                    </div>
                }
            </div>
            <Toaster />
        </div>
    )
}

export default UserComponent