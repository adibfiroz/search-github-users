"use client"

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Repository {
    name: string;
    language: string;
    stargazers_count: number;
}

interface User {
    login: string;
    avatar_url: string;
    html_url: string;
}

interface UserListProps {
    users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
    const [expandedUser, setExpandedUser] = useState<string | null>(null);
    const [repositories, setRepositories] = useState<Record<string, Repository[]>>({});

    const handleToggleDetails = async (username: string) => {
        if (expandedUser === username) {
            setExpandedUser(null);
        } else {
            if (repositories[username]) {
                setExpandedUser(username);
            } else {
                try {
                    const response = await axios.get(`https://api.github.com/users/${username}/repos`);
                    setRepositories((prevState) => ({
                        ...prevState,
                        [username]: response.data,
                    }));
                    setExpandedUser(username);
                } catch (error) {
                    console.error("Error fetching repositories:", error);
                }
            }
        }
    };

    return (
        <div className=" mt-4">
            {users.map((user) => (
                <div key={user.login} className="shadow-md bg-white rounded-md mb-4">
                    <div className="flex flex-col p-4 sm:flex-row justify-between gap-5">
                        <div className="flex items-center gap-5">
                            <img src={user.avatar_url} alt={user.login} className="w-20 h-20 rounded-full" />
                            <div>
                                <h2 className="text-xl">{user.login}</h2>
                                <div className="text-sm text-gray-600 mt-2">Profile URL:
                                    <Link target="_blank" className="text-blue-500" href={user.html_url}> {user.html_url}</Link>
                                </div>
                            </div>
                        </div>

                        <div className=" text-center">
                            <button
                                onClick={() => handleToggleDetails(user.login)}
                                className="border border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500 px-6 py-2 rounded-md mt-2 sm:mt-10"
                            >
                                {expandedUser === user.login ? "Collapse" : "Details"}
                            </button>
                        </div>
                    </div>

                    {expandedUser === user.login && repositories[user.login] && (
                        <div className="mt-4">
                            <div className="">
                                <table width="100%">
                                    {repositories[user.login].map((repo) => (
                                        <tr key={repo.name}>
                                            <td className="sm:w-10"></td>
                                            <td className="text-md p-2 font-medium">{repo.name}</td>
                                            <td className="p-2">Stars: {repo.stargazers_count}</td>
                                            <td className="p-2">Language: {repo.language}</td>
                                        </tr>
                                    ))}
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default UserList;
