import FavoritesList from "../../components/Favorites/FavoritesList";


/**
 * Favorites Page
 * Container page for Favorites List and Suggestions.
 */
export default function Favorites() {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-28 pb-8 min-h-screen">
      <FavoritesList />
    </div>
  );
}
