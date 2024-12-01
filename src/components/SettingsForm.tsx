import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import type { Settings } from '../types/settings';

interface SettingsFormProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onClose: () => void;
  currentPosition: [number, number];
  currentZoom: number;
}

export function SettingsForm({
  settings,
  onSave,
  onClose,
  currentPosition,
  currentZoom,
}: SettingsFormProps) {
  const [defaultLocation, setDefaultLocation] = useState(settings.defaultLocation);

  const handleSetCurrentAsDefault = () => {
    setDefaultLocation({
      position: currentPosition,
      zoom: currentZoom,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      defaultLocation,
    });
    onClose();
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Map Settings</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Default Location</h4>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">
              Current default: {defaultLocation.position[0].toFixed(4)}°, {defaultLocation.position[1].toFixed(4)}°
            </p>
            <p className="text-sm text-gray-600">
              Zoom level: {defaultLocation.zoom}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSetCurrentAsDefault}
            className="mt-2 flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Set Current View as Default
          </button>
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
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}