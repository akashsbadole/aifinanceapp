const API_BASE_URL = "http://localhost:3002/api";

export interface BusinessProfile {
  id?: string;
  companyName: string;
  companyAddress?: string;
  gstin?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

class BusinessProfileService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Network error" }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Get all business profiles
  async getAllProfiles(): Promise<BusinessProfile[]> {
    return this.request<BusinessProfile[]>("/business-profiles");
  }

  // Get default business profile
  async getDefaultProfile(): Promise<BusinessProfile> {
    return this.request<BusinessProfile>("/business-profiles/default");
  }

  // Get single business profile by ID
  async getProfileById(id: string): Promise<BusinessProfile> {
    return this.request<BusinessProfile>(`/business-profiles/${id}`);
  }

  // Create new business profile
  async createProfile(
    profile: Omit<BusinessProfile, "id" | "createdAt" | "updatedAt">
  ): Promise<BusinessProfile> {
    return this.request<BusinessProfile>("/business-profiles", {
      method: "POST",
      body: JSON.stringify(profile),
    });
  }

  // Update business profile
  async updateProfile(
    id: string,
    profile: Partial<BusinessProfile>
  ): Promise<BusinessProfile> {
    return this.request<BusinessProfile>(`/business-profiles/${id}`, {
      method: "PUT",
      body: JSON.stringify(profile),
    });
  }

  // Set profile as default
  async setAsDefault(id: string): Promise<BusinessProfile> {
    return this.request<BusinessProfile>(`/business-profiles/${id}/default`, {
      method: "PATCH",
    });
  }

  // Delete business profile
  async deleteProfile(id: string): Promise<void> {
    await this.request<void>(`/business-profiles/${id}`, {
      method: "DELETE",
    });
  }

  // Validate GSTIN format
  validateGSTIN(gstin: string): boolean {
    const gstinRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstinRegex.test(gstin);
  }

  // Validate email format
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate phone number format
  validatePhone(phone: string): boolean {
    const phoneRegex = /^[+]?[1-9]?[0-9]{7,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  }

  // Validate IFSC code format
  validateIFSC(ifsc: string): boolean {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc);
  }

  // Validate UPI ID format
  validateUPI(upi: string): boolean {
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    return upiRegex.test(upi);
  }

  // Format phone number for display
  formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, "");

    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    } else if (cleaned.length === 12 && cleaned.startsWith("91")) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(
        7
      )}`;
    }

    return phone;
  }

  // Generate QR code data for business profile
  generateBusinessQRData(profile: BusinessProfile): string {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${profile.companyName}`,
      profile.phone && `TEL:${profile.phone}`,
      profile.email && `EMAIL:${profile.email}`,
      profile.website && `URL:${profile.website}`,
      profile.companyAddress && `ADR:;;${profile.companyAddress};;;;`,
      "END:VCARD",
    ]
      .filter(Boolean)
      .join("\n");

    return vcard;
  }

  // Export profile data
  exportToJSON(profiles: BusinessProfile[]): string {
    return JSON.stringify(profiles, null, 2);
  }

  // Import profile data
  async importFromJSON(jsonData: string): Promise<BusinessProfile[]> {
    try {
      const profiles = JSON.parse(jsonData) as BusinessProfile[];
      const importedProfiles: BusinessProfile[] = [];

      for (const profile of profiles) {
        // Remove ID and timestamps for import
        const { id, createdAt, updatedAt, ...profileData } = profile;

        // Ensure only one default profile
        if (profileData.isDefault) {
          profileData.isDefault = importedProfiles.length === 0;
        }

        const imported = await this.createProfile(profileData);
        importedProfiles.push(imported);
      }

      return importedProfiles;
    } catch (error) {
      throw new Error("Invalid JSON format or import failed");
    }
  }

  // Get profile completeness percentage
  getProfileCompleteness(profile: BusinessProfile): number {
    const fields = [
      "companyName",
      "companyAddress",
      "gstin",
      "phone",
      "email",
      "website",
      "bankName",
      "accountNumber",
      "ifscCode",
      "upiId",
    ];

    const filledFields = fields.filter((field) => {
      const value = profile[field as keyof BusinessProfile];
      return value && value.toString().trim() !== "";
    });

    return Math.round((filledFields.length / fields.length) * 100);
  }

  // Get missing required fields
  getMissingRequiredFields(profile: BusinessProfile): string[] {
    const requiredFields = [
      { key: "companyName", label: "Company Name" },
      { key: "phone", label: "Phone Number" },
      { key: "email", label: "Email Address" },
    ];

    return requiredFields
      .filter((field) => {
        const value = profile[field.key as keyof BusinessProfile];
        return !value || value.toString().trim() === "";
      })
      .map((field) => field.label);
  }

  // Validate profile data
  validateProfile(profile: Partial<BusinessProfile>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!profile.companyName || profile.companyName.trim() === "") {
      errors.push("Company name is required");
    }

    if (profile.email && !this.validateEmail(profile.email)) {
      errors.push("Invalid email format");
    }

    if (profile.phone && !this.validatePhone(profile.phone)) {
      errors.push("Invalid phone number format");
    }

    if (profile.gstin && !this.validateGSTIN(profile.gstin)) {
      errors.push("Invalid GSTIN format");
    }

    if (profile.ifscCode && !this.validateIFSC(profile.ifscCode)) {
      errors.push("Invalid IFSC code format");
    }

    if (profile.upiId && !this.validateUPI(profile.upiId)) {
      errors.push("Invalid UPI ID format");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Create default profile template
  createDefaultProfile(): Omit<
    BusinessProfile,
    "id" | "createdAt" | "updatedAt"
  > {
    return {
      companyName: "",
      companyAddress: "",
      gstin: "",
      phone: "",
      email: "",
      website: "",
      logo: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      upiId: "",
      isDefault: true,
    };
  }
}

export const businessProfileService = new BusinessProfileService();
