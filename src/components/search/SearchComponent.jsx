  import React, { useState, useEffect, useCallback } from "react";
  import { debounce } from "lodash";
  import { useNavigate } from "react-router-dom";
  

  export const SearchComponent = ({ setSearchQuery }) => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState(""); // Track search text

    // Debounced function to update the search query
    const debouncedSetSearchQuery = useCallback(
      debounce((value) => {
        setSearchQuery(value); // Update parent component or state
      }, 300), // Delay of 300ms
      []
    );

    // Handle input change and update the state
    const handleInputChange = (e) => {
      const value = e.target.value;
      setSearchText(value); // Update search text in the local state
      debouncedSetSearchQuery(value); // Call debounced function
    };

    // Handle clearing the input field
    const handleClearInput = () => {
      setSearchText(""); // Clear local state
      setSearchQuery(""); // Clear parent or global state
      navigate("/"); // Redirect to home or default page
    };

    // Handle key press (specifically Enter key)
    const handleKeyPress = (e) => {
      if (e.key === "Enter" && searchText.trim().length > 0) {
        navigate(`/search?query=${searchText.trim()}`); // Navigate to search results
      }
    };

    // Cleanup debounced function when the component unmounts
    useEffect(() => {
      return () => {
        debouncedSetSearchQuery.cancel();
      };
    }, [debouncedSetSearchQuery]);

    return (
      <div
        id="nit_header_search"
        className="header-search d-flex align-items-center w-lg-250px"
        data-nit-search-keypress="true"
        data-nit-search-min-length="2"
        data-nit-search-enter="enter"
        data-nit-search-layout="menu"
        data-nit-search-responsive="lg"
        data-nit-menu-trigger="auto"
        data-nit-menu-permanent="true"
        data-nit-menu-placement="bottom-end"
        data-nit-menu-attach="parent"
      >
        <div
          data-nit-search-element="toggle"
          className="search-toggle-mobile d-flex d-lg-none align-items-center"
        >
          <div className="d-flex btn btn-custom btn-outline btn-icon btn-icon-gray-700 btn-active-icon-primary">
            <i className="nit-dt nit-magnifier fs-1">
              <span className="path1"></span>
              <span className="path2"></span>
            </i>
          </div>
        </div>

        <div
          data-nit-search-element="form"
          className="d-none d-lg-block w-100 position-relative mb-5 mb-lg-0"
          autoComplete="off"
        >
          <i className="nit-dt nit-magnifier fs-2 fs-lg-3 text-gray-800 position-absolute top-50 translate-middle-y ms-5">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>

          <input
            type="text"
            className="search-input form-control form-control-solid border ps-13 start1"
            name="search"
            placeholder="Search..."
            value={searchText} // Bind input value to state
            onChange={handleInputChange} // Update state on input change
            onKeyPress={handleKeyPress}
            data-nit-search-element="input"
          />

          {searchText && (
            <span
              className="btn btn-flush btn-active-color-primary position-absolute top-50 end-0 translate-middle-y lh-0 me-4"
              data-nit-search-element="clear"
              onClick={handleClearInput} // Clear input when clicked
            >
              <i className="nit-dt nit-cross fs-2 fs-lg-1 me-0">
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
            </span>
          )}
        </div>
      </div>
    );
  };




  // import React, { useState } from "react";
  // import { useNavigate } from "react-router-dom";

  // export const SearchComponent = ({ setSearchQuery }) => {
  //     const navigate =useNavigate();
  //   const [searchText, setSearchText] = useState(""); // Track search text

  //   // Handle input change and update the state
  //   const handleInputChange = (e) => {
  //     const value = e.target.value;
  //     setSearchText(value); // Update search text in component
  //     setSearchQuery(value); // Pass search text to parent or other component
  //   };

  //   // Handle clearing the input field
  //   const handleClearInput = () => {
  //     setSearchText("");
  //     setSearchQuery(""); 
  //     navigate('/');
  //   };

  //    // Handle key press (specifically Enter key)
  //    const handleKeyPress = (e) => {
  //     if (e.key === "Enter" && searchText.length > 0) {
  //       navigate(`/search?query=${searchText}`); // Navigate to search page with query as a parameter
  //     }
  //   };

  //   return (
  //     <div
  //       id="nit_header_search"
  //       className="header-search d-flex align-items-center w-lg-250px"
  //       data-nit-search-keypress="true"
  //       data-nit-search-min-length="2"
  //       data-nit-search-enter="enter"
  //       data-nit-search-layout="menu"
  //       data-nit-search-responsive="lg"
  //       data-nit-menu-trigger="auto"
  //       data-nit-menu-permanent="true"
  //       data-nit-menu-placement="bottom-end"
  //       data-nit-menu-attach="parent"
  //     >
  //       <div
  //         data-nit-search-element="toggle"
  //         className="search-toggle-mobile d-flex d-lg-none align-items-center"
  //       >
  //         <div className="d-flex btn btn-custom btn-outline btn-icon btn-icon-gray-700 btn-active-icon-primary">
  //           <i className="nit-dt nit-magnifier fs-1">
  //             <span className="path1"></span>
  //             <span className="path2"></span>
  //           </i>
  //         </div>
  //       </div>

  //       <div
  //         data-nit-search-element="form"
  //         className="d-none d-lg-block w-100 position-relative mb-5 mb-lg-0"
  //         autoComplete="off"
  //       >
  //         <i className="nit-dt nit-magnifier fs-2 fs-lg-3 text-gray-800 position-absolute top-50 translate-middle-y ms-5">
  //           <span className="path1"></span>
  //           <span className="path2"></span>
  //         </i>

  //         <input
  //           type="text"
  //           className="search-input form-control form-control-solid border ps-13 start1"
  //           name="search"
  //           placeholder="Search..."
  //           value={searchText} // Bind input value to state
  //           onChange={handleInputChange} // Update state on input change
  //           onKeyPress={handleKeyPress}
  //           data-nit-search-element="input"
  //         />

  //         {searchText && (
  //           <span
  //             className="btn btn-flush btn-active-color-primary position-absolute top-50 end-0 translate-middle-y lh-0 me-4"
  //             data-nit-search-element="clear"
  //             onClick={handleClearInput} // Clear input when clicked
  //           >
  //             <i className="nit-dt nit-cross fs-2 fs-lg-1 me-0">
  //               <span className="path1"></span>
  //               <span className="path2"></span>
  //             </i>
  //           </span>
  //         )}
  //       </div>
  //     </div>
  //   );
  // };
