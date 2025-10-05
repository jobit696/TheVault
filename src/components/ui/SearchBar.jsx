import { useState } from "react";
import { useNavigate } from "react-router";

export default function SearchBar() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [ariaInvalid, setAriaInvalid] = useState(null);

    const handleSearch = (event) => {
        event.preventDefault();
        if (typeof search === 'string' && search.trim().length !== 0) {
            navigate(`/search?q=${search}`);
            setAriaInvalid(null);
            setSearch(""); 
        } else {
            setAriaInvalid(true);
        }
    };

    return (
        <form onSubmit={handleSearch}>
            <div className="input-group rounded">
                <input 
                    type="search" 
                    className="form-control rounded custom-searchbar-input" 
                    placeholder={ariaInvalid ? "You must search something" : "Search a game"}
                    aria-label="Search" 
                    aria-describedby="search-addon"
                    aria-invalid={ariaInvalid}
                    onChange={(event) => setSearch(event.target.value)}
                    value={search}
                />
                <button 
                    type="submit" 
                    className="input-group-text border-0 custom-searchbar-submit" 
                    id="search-addon"
                >
                    <i className="fas fa-search"></i>
                </button>
            </div>
        </form>
    );
}