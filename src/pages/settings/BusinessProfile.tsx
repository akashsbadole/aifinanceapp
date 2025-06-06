import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
  Upload,
  Trash2,
} from "lucide-react";

interface BusinessProfileForm {
  companyName: string;
  companyAddress: string;
  phone: string;
  email: string;
  website: string;
  gstin: string;
  logo?: string;
}

const BusinessProfile = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [currentProfile, setCurrentProfile] = useState<any>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BusinessProfileForm>({
    defaultValues: {
      companyName: "",
      companyAddress: "",
      phone: "",
      email: "",
      website: "",
      gstin: "",
      logo: "",
    },
  });

  // Load current profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/business-profiles/default"
        );
        if (response.ok) {
          const profile = await response.json();
          setCurrentProfile(profile);
          reset({
            companyName: profile.companyName || "",
            companyAddress: profile.companyAddress || "",
            phone: profile.phone || "",
            email: profile.email || "",
            website: profile.website || "",
            gstin: profile.gstin || "",
            logo: profile.logo || "",
          });
          setLogoPreview(profile.logo || null);
        }
      } catch (error) {
        console.error("Failed to load business profile:", error);
      }
    };

    loadProfile();
  }, [reset]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 2MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setLogoPreview(result);
      setValue("logo", result);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoPreview(null);
    setValue("logo", "");
  };

  const onSubmit = async (data: BusinessProfileForm) => {
    try {
      setIsLoading(true);

      const profileData = {
        ...data,
        logo: logoPreview || undefined,
        isDefault: !currentProfile, // First profile is default
      };

      if (currentProfile) {
        // Update existing profile
        const response = await fetch(
          `http://localhost:3001/api/business-profiles/${currentProfile.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(profileData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update profile");
        }

        toast({
          title: "Profile Updated",
          description: "Your business profile has been updated successfully.",
        });
      } else {
        // Create new profile
        const response = await fetch(
          "http://localhost:3001/api/business-profiles",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(profileData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create profile");
        }

        const newProfile = await response.json();
        setCurrentProfile(newProfile);

        toast({
          title: "Profile Created",
          description: "Your business profile has been created successfully.",
        });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save business profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Business Profile
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your business information and branding
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Company Logo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Company Logo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {logoPreview ? (
                <div className="relative">
                  <img
                    src={logoPreview}
                    alt="Company Logo"
                    className="h-20 w-20 object-contain border rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={removeLogo}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="h-20 w-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div>
                <Label htmlFor="logo" className="cursor-pointer">
                  <Button type="button" variant="outline" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </span>
                  </Button>
                </Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 2MB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  {...register("companyName", {
                    required: "Company name is required",
                  })}
                  placeholder="Your Company Name"
                />
                {errors.companyName && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.companyName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="gstin">GSTIN</Label>
                <Input
                  id="gstin"
                  {...register("gstin")}
                  placeholder="GST Number"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="companyAddress">Company Address *</Label>
              <Textarea
                id="companyAddress"
                {...register("companyAddress", {
                  required: "Company address is required",
                })}
                placeholder="Enter your complete business address"
                rows={3}
              />
              {errors.companyAddress && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.companyAddress.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="contact@company.com"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                {...register("website")}
                placeholder="https://www.company.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {currentProfile ? "Update Profile" : "Create Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BusinessProfile;
