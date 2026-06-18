/**
 * Renders an empty state UI for dashboard lists and tables.
 * @param {Object} props - Component props.
 * @param {React.ComponentType} [props.icon] - Optional icon component.
 * @param {string} props.title - The main headline text.
 * @param {string} [props.description] - Optional supporting text below the title.
 * @param {Object} [props.action] - Optional action object with `onClick` function and `label` string.
 * @returns {JSX.Element} An empty state layout.
 */
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
          <Icon size={28} className="text-orange-400" />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-gray-700">{title}</p>
        {description && <p className="text-xs text-gray-400">{description}</p>}
      </div>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl transition-colors duration-200 cursor-pointer border-none"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
