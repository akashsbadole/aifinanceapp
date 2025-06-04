import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const businessProfileController = {
  // Get all business profiles
  async getAllProfiles(req: Request, res: Response) {
    try {
      const profiles = await prisma.businessProfile.findMany({
        orderBy: { isDefault: 'desc' }
      });
      res.json(profiles);
    } catch (error) {
      console.error('Error fetching business profiles:', error);
      res.status(500).json({ error: 'Failed to fetch business profiles' });
    }
  },

  // Get default business profile
  async getDefaultProfile(req: Request, res: Response) {
    try {
      let profile = await prisma.businessProfile.findFirst({
        where: { isDefault: true }
      });

      // If no default profile exists, get the first one or create a default
      if (!profile) {
        profile = await prisma.businessProfile.findFirst();
        
        if (!profile) {
          // Create a default profile if none exists
          profile = await prisma.businessProfile.create({
            data: {
              companyName: 'Your Company Name',
              isDefault: true
            }
          });
        }
      }

      res.json(profile);
    } catch (error) {
      console.error('Error fetching default profile:', error);
      res.status(500).json({ error: 'Failed to fetch default profile' });
    }
  },

  // Get single business profile
  async getProfileById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const profile = await prisma.businessProfile.findUnique({
        where: { id }
      });

      if (!profile) {
        return res.status(404).json({ error: 'Business profile not found' });
      }

      res.json(profile);
    } catch (error) {
      console.error('Error fetching business profile:', error);
      res.status(500).json({ error: 'Failed to fetch business profile' });
    }
  },

  // Create new business profile
  async createProfile(req: Request, res: Response) {
    try {
      const {
        companyName,
        companyAddress,
        gstin,
        phone,
        email,
        website,
        logo,
        bankName,
        accountNumber,
        ifscCode,
        upiId,
        isDefault = false
      } = req.body;

      // If this is set as default, unset other defaults
      if (isDefault) {
        await prisma.businessProfile.updateMany({
          where: { isDefault: true },
          data: { isDefault: false }
        });
      }

      const profile = await prisma.businessProfile.create({
        data: {
          companyName,
          companyAddress,
          gstin,
          phone,
          email,
          website,
          logo,
          bankName,
          accountNumber,
          ifscCode,
          upiId,
          isDefault
        }
      });

      res.status(201).json(profile);
    } catch (error) {
      console.error('Error creating business profile:', error);
      res.status(500).json({ error: 'Failed to create business profile' });
    }
  },

  // Update business profile
  async updateProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        companyName,
        companyAddress,
        gstin,
        phone,
        email,
        website,
        logo,
        bankName,
        accountNumber,
        ifscCode,
        upiId,
        isDefault
      } = req.body;

      // If this is set as default, unset other defaults
      if (isDefault) {
        await prisma.businessProfile.updateMany({
          where: { 
            isDefault: true,
            id: { not: id }
          },
          data: { isDefault: false }
        });
      }

      const profile = await prisma.businessProfile.update({
        where: { id },
        data: {
          companyName,
          companyAddress,
          gstin,
          phone,
          email,
          website,
          logo,
          bankName,
          accountNumber,
          ifscCode,
          upiId,
          isDefault
        }
      });

      res.json(profile);
    } catch (error) {
      console.error('Error updating business profile:', error);
      res.status(500).json({ error: 'Failed to update business profile' });
    }
  },

  // Delete business profile
  async deleteProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Check if this is the default profile
      const profile = await prisma.businessProfile.findUnique({
        where: { id }
      });

      if (!profile) {
        return res.status(404).json({ error: 'Business profile not found' });
      }

      // Don't allow deletion of default profile if it's the only one
      if (profile.isDefault) {
        const profileCount = await prisma.businessProfile.count();
        if (profileCount === 1) {
          return res.status(400).json({ 
            error: 'Cannot delete the only business profile' 
          });
        }

        // Set another profile as default before deleting
        const anotherProfile = await prisma.businessProfile.findFirst({
          where: { id: { not: id } }
        });

        if (anotherProfile) {
          await prisma.businessProfile.update({
            where: { id: anotherProfile.id },
            data: { isDefault: true }
          });
        }
      }

      await prisma.businessProfile.delete({
        where: { id }
      });

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting business profile:', error);
      res.status(500).json({ error: 'Failed to delete business profile' });
    }
  },

  // Set profile as default
  async setAsDefault(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Unset all other defaults
      await prisma.businessProfile.updateMany({
        where: { isDefault: true },
        data: { isDefault: false }
      });

      // Set this profile as default
      const profile = await prisma.businessProfile.update({
        where: { id },
        data: { isDefault: true }
      });

      res.json(profile);
    } catch (error) {
      console.error('Error setting default profile:', error);
      res.status(500).json({ error: 'Failed to set default profile' });
    }
  }
};
