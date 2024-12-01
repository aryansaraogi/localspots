import React, { useState } from 'react';
import { Map } from './components/Map';
import { Sidebar } from './components/Sidebar';
import { LocationForm } from './components/LocationForm';
import { SettingsForm } from './components/SettingsForm';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Location } from './types/location';
import type { Settings } from './types/settings';
import { Menu, Settings as SettingsIcon } from 'lucide-react';

const DEFAULT_CENTER: [number, number] = [28.6990, 77.1387]; // Delhi, India
const DEFAULT_ZOOM = 13;

const DEFAULT_SETTINGS: Settings = {
  defaultLocation: {
    position: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
  },
};

function App() {
  const [locations, setLocations] = useLocalStorage<Location[]>('map-locations', []);
  const [settings, setSettings] = useLocalStorage<Settings>('map-settings', DEFAULT_SETTINGS);
  const [currentPosition, setCurrentPosition] = useState<[number, number]>(settings.defaultLocation.position);
  const [currentZoom, setCurrentZoom] = useState(settings.defaultLocation.zoom);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const handleMapClick = (position: [number, number]) => {
    setSelectedPosition(position);
  };

  const handleViewChange = (center: [number, number], zoom: number) => {
    setCurrentPosition(center);
    setCurrentZoom(zoom);
  };

  const handleLocationSave = (locationData: Omit<Location, 'id' | 'createdAt'>) => {
    if (editingLocation) {
      setLocations(
        locations.map((loc) =>
          loc.id === editingLocation.id
            ? { ...loc, ...locationData }
            : loc
        )
      );
    } else {
      const newLocation: Location = {
        ...locationData,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      setLocations([...locations, newLocation]);
    }
    setSelectedPosition(null);
    setEditingLocation(null);
  };

  const handleLocationDelete = (id: string) => {
    setLocations(locations.filter((loc) => loc.id !== id));
  };

  const handleLocationEdit = (location: Location) => {
    setEditingLocation(location);
    setSelectedPosition(location.position);
  };

  const handleLocationSelect = (position: [number, number]) => {
    setCurrentPosition(position);
    setIsSidebarOpen(false);
  };

  const handleSettingsSave = (newSettings: Settings) => {
    setSettings(newSettings);
    setCurrentPosition(newSettings.defaultLocation.position);
    setCurrentZoom(newSettings.defaultLocation.zoom);
  };

  return (
    <div className="relative h-screen">
      <Map
        locations={locations}
        center={currentPosition}
        zoom={currentZoom}
        onMapClick={handleMapClick}
        onViewChange={handleViewChange}
      />
      
      <div className="fixed bottom-4 left-4 z-[1000] flex flex-col space-y-2">
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100"
        >
          <SettingsIcon className="w-6 h-6" />
        </button>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        locations={locations}
        onEdit={handleLocationEdit}
        onDelete={handleLocationDelete}
        onLocationSelect={handleLocationSelect}
      />

      {(selectedPosition || editingLocation) && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[2000] p-4">
          <LocationForm
            location={editingLocation ?? undefined}
            position={selectedPosition ?? editingLocation!.position}
            onSave={handleLocationSave}
            onClose={() => {
              setSelectedPosition(null);
              setEditingLocation(null);
            }}
          />
        </div>
      )}

      {isSettingsOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[2000] p-4">
          <SettingsForm
            settings={settings}
            onSave={handleSettingsSave}
            onClose={() => setIsSettingsOpen(false)}
            currentPosition={currentPosition}
            currentZoom={currentZoom}
          />
        </div>
      )}
    </div>
  );
}

export default App;