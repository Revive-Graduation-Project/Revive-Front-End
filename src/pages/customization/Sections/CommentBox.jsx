// components/customize/CommentBox.jsx

import { useCustomizeStore } from "../../../store";

const CommentBox = () => {
  const { comment, setComment } = useCustomizeStore();

  return (
    <div className="mt-8">
      <p className="text-sm mb-2">If you have any comment , Write for chef ?</p>

      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Enter Comment..."
        className="w-full border rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
      />
    </div>
  );
};

export default CommentBox;
