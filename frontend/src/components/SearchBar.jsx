import React from "react";

const SearchBar = () => {
    return (
        <div className="w-[40%]">
            <div className="bg-blue-600/30 backdrop-blur-md rounded-full flex items-center px-4 py-2 shadow-md">
                <input
                    type="text"
                    placeholder="Search hotels..."
                    className="w-full bg-transparent text-blue-500 placeholder-gray-300 focus:outline-none"
                />
                <button className="text-white">
                    🔍
                </button>
            </div>
        </div>
    );
};

export default SearchBar;