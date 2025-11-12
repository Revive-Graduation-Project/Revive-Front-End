  import { CiSearch } from "react-icons/ci";
  import { LuSettings2 } from "react-icons/lu";

  export default function SearchBar() {

    const formAction = (formData) => {
      // Placeholder for future search functionality
    };
    const handleFilterClick = () => {
      // Placeholder for future filter functionality
    };

    return (
      <div className="relative grow-2">
        <form action={formAction} className="w-full">
          <input
            type="text"
            name="search"
            placeholder="Search..."
            className="border px-10 py-1 rounded-3xl border-green w-full outline-none focus:ring"
          />
        </form>
        <CiSearch className="text-2xl text-gray-500 ml-2 absolute top-1/2 transform -translate-y-1/2 left-1" />
        <LuSettings2
          className="text-2xl text-gray-500 ml-2 cursor-pointer absolute top-1/2 transform -translate-y-1/2 right-3"
          onClick={handleFilterClick}
        />
      </div>
    );
  }
