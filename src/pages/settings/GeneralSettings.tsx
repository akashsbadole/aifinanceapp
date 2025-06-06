import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
  Settings,
  Palette,
  Globe,
  Calculator,
  Bell,
  Shield,
} from "lucide-react";

interface GeneralSettingsForm {
  currency: string;
  taxRate: number;
  companyName: string;
  theme: "light" | "dark";
  notifications: boolean;
  autoSave: boolean;
  language: string;
  dateFormat: string;
  numberFormat: string;
}

const GeneralSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [settings, setSettings] = useState<any>({});

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GeneralSettingsForm>({
    defaultValues: {
      currency: "INR",
      taxRate: 18,
      companyName: "",
      theme: "light",
      notifications: true,
      autoSave: true,
      language: "en",
      dateFormat: "DD/MM/YYYY",
      numberFormat: "en-IN",
    },
  });

  // Load settings from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/settings");
        if (response.ok) {
          const settingsData = await response.json();
          setSettings(settingsData);

          // Update form with loaded settings
          setValue("currency", settingsData.currency || "INR");
          setValue("taxRate", parseFloat(settingsData.taxRate) || 18);
          setValue("companyName", settingsData.companyName || "");
          setValue("theme", settingsData.theme || "light");
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };

    loadSettings();
  }, [setValue]);

  const watchedTheme = watch("theme");
  const watchedNotifications = watch("notifications");
  const watchedAutoSave = watch("autoSave");

  const onSubmit = async (data: GeneralSettingsForm) => {
    try {
      setIsLoading(true);

      const settingsToSave = {
        currency: data.currency,
        taxRate: data.taxRate.toString(),
        companyName: data.companyName,
        theme: data.theme,
      };

      const response = await fetch("http://localhost:3001/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settingsToSave),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      toast({
        title: "Settings Updated",
        description: "Your preferences have been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefaults = () => {
    setValue("currency", "INR");
    setValue("taxRate", 18);
    setValue("theme", "light");
    setValue("notifications", true);
    setValue("autoSave", true);
    setValue("language", "en");
    setValue("dateFormat", "DD/MM/YYYY");
    setValue("numberFormat", "en-IN");

    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          General Settings
        </h1>
        <p className="text-gray-600 mt-1">
          Configure your application preferences and defaults
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Business Defaults */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Business Defaults
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currency">Default Currency</Label>
                <Select
                  value={watch("currency")}
                  onValueChange={(value) => setValue("currency", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                    <SelectItem value="USD">US Dollar ($)</SelectItem>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                    <SelectItem value="GBP">British Pound (£)</SelectItem>
                    <SelectItem value="JPY">Japanese Yen (¥)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  {...register("taxRate", {
                    required: "Tax rate is required",
                    min: { value: 0, message: "Tax rate must be positive" },
                    max: { value: 100, message: "Tax rate cannot exceed 100%" },
                  })}
                  placeholder="18.00"
                />
                {errors.taxRate && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.taxRate.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="companyName">Default Company Name</Label>
              <Input
                id="companyName"
                {...register("companyName")}
                placeholder="Your Company Name"
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={watchedTheme}
                onValueChange={(value: "light" | "dark") =>
                  setValue("theme", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Localization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Localization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="language">Language</Label>
                <Select
                  value={watch("language")}
                  onValueChange={(value) => setValue("language", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select
                  value={watch("dateFormat")}
                  onValueChange={(value) => setValue("dateFormat", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="numberFormat">Number Format</Label>
              <Select
                value={watch("numberFormat")}
                onValueChange={(value) => setValue("numberFormat", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select number format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-IN">Indian (1,23,456.78)</SelectItem>
                  <SelectItem value="en-US">US (123,456.78)</SelectItem>
                  <SelectItem value="de-DE">German (123.456,78)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications">Enable Notifications</Label>
                <p className="text-sm text-gray-500">
                  Receive notifications for important events
                </p>
              </div>
              <Switch
                id="notifications"
                checked={watchedNotifications}
                onCheckedChange={(checked) =>
                  setValue("notifications", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoSave">Auto Save</Label>
                <p className="text-sm text-gray-500">
                  Automatically save changes as you work
                </p>
              </div>
              <Switch
                id="autoSave"
                checked={watchedAutoSave}
                onCheckedChange={(checked) => setValue("autoSave", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button type="button" variant="outline" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GeneralSettings;
