import React from 'react';
import { X, Edit2, Trash2 } from 'lucide-react';
import type { Location } from '../types/location';
import { clsx } from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  locations: Location[];
  onEdit: (location: Location) => void;
  onDelete: (id: string) => void;
  onLocationSelect: (position: [number, number]) => void;
}

export function Sidebar({
  isOpen,
  onClose,
  locations,
  onEdit,
  onDelete,
  onLocationSelect,
}: SidebarProps) {
  return (
    <div
      className={clsx(
        'fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-[1000]',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Saved Locations</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          {locations.map((location) => (
            <div
              key={location.id}
              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <div className="flex justify-between items-start">
                <div
                  className="cursor-pointer flex-1"
                  onClick={() => onLocationSelect(location.position)}
                >
                  <h3 className="font-medium">{location.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{location.notes}</p>
                </div>
                <div className="flex space-x-2 ml-2">
                  <button
                    onClick={() => onEdit(location)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(location.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {locations.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No locations saved yet. Click on the map to add one!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}