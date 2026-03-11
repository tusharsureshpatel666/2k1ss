import React, { useState } from "react";

const UserBussiness = () => {
  const [bussiness, setBussiness] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    console.log("Business:", bussiness);
    setOpen(false);
  };

  return (
    <div className="p-6">
      {/* Open Dialog Button */}
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Add Business
      </button>

      {/* Dialog */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-xl w-[400px] shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add Business</h2>

            {/* Input */}
            <input
              type="text"
              placeholder="Enter business name"
              value={bussiness}
              onChange={(e) => setBussiness(e.target.value)}
              className="w-full border p-2 rounded-md mb-4"
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBussiness;
