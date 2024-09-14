"use client"

import { useState, useEffect } from "react";

interface SearchProps {
    onSearch: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
    const [query, setQuery] = useState("");


    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            onSearch(query);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query, onSearch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    return (
        <div className="flex items-center space-x-4 w-full">
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search users..."
                className=" outline-none p-3 rounded-md w-full m-0"
            />
        </div>
    );
};

export default Search;
