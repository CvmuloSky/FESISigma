"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface Settings {
  notifications: boolean;
  darkMode: boolean;
  analysisSensitivity: number;
  autoSave: boolean;
  deleteHistory: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    darkMode: false,
    analysisSensitivity: 0.5,
    autoSave: true,
    deleteHistory: false,
  });

  const handleSave = async () => {
    // Simulate saving settings
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Settings saved:", settings);
  };

  const handleDeleteHistory = async () => {
    if (settings.deleteHistory) {
      // Simulate deleting history
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("History deleted");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications">Enable Notifications</Label>
          <Switch
            id="notifications"
            checked={settings.notifications}
            onCheckedChange={(checked: boolean) =>
              setSettings({ ...settings, notifications: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="darkMode">Dark Mode</Label>
          <Switch
            id="darkMode"
            checked={settings.darkMode}
            onCheckedChange={(checked: boolean) =>
              setSettings({ ...settings, darkMode: checked })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sensitivity">Analysis Sensitivity</Label>
          <Slider
            id="sensitivity"
            value={[settings.analysisSensitivity]}
            onValueChange={(value: number[]) =>
              setSettings({ ...settings, analysisSensitivity: value[0] })
            }
            min={0}
            max={1}
            step={0.1}
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="autoSave">Auto-save Results</Label>
          <Switch
            id="autoSave"
            checked={settings.autoSave}
            onCheckedChange={(checked: boolean) =>
              setSettings({ ...settings, autoSave: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="deleteHistory">Delete History</Label>
          <Switch
            id="deleteHistory"
            checked={settings.deleteHistory}
            onCheckedChange={(checked: boolean) =>
              setSettings({ ...settings, deleteHistory: checked })
            }
          />
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={handleDeleteHistory}
            className="px-4 py-2 text-red-600 hover:text-red-700"
            disabled={!settings.deleteHistory}
          >
            Delete History
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
} 