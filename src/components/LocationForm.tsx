import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Location } from '../types/location';

interface LocationFormProps {
  location?: Location;
  position: [number, number];
  onSave: (location: Omit<Location, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

export function LocationForm({
  location,
  position,
  onSave,
  onClose,
}: LocationFormProps) {
  const [name, setName] = useState(location?.name ?? '');
  const [notes, setNotes] = useState(location?.notes ?? '');

  useEffect(() => {
    setName(location?.name ?? '');
    setNotes(location?.notes ?? '');
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      notes,
      position,
    });
    onClose();
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {location ? 'Edit Location' : 'Add Location'}
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700"
          >
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}