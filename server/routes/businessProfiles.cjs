const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/business-profiles - Get all business profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await prisma.businessProfile.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json(profiles);
  } catch (error) {
    console.error('Error fetching business profiles:', error);
    res.status(500).json({ error: 'Failed to fetch business profiles' });
  }
});

// GET /api/business-profiles/default - Get default business profile
router.get('/default', async (req, res) => {
  try {
    const defaultProfile = await prisma.businessProfile.findFirst({
      where: { isDefault: true },
    });

    if (!defaultProfile) {
      return res.status(404).json({ error: 'No default business profile found' });
    }

    res.json(defaultProfile);
  } catch (error) {
    console.error('Error fetching default business profile:', error);
    res.status(500).json({ error: 'Failed to fetch default business profile' });
  }
});

// GET /api/business-profiles/:id - Get single business profile
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const profile = await prisma.businessProfile.findUnique({
      where: { id },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Business profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error fetching business profile:', error);
    res.status(500).json({ error: 'Failed to fetch business profile' });
  }
});

// POST /api/business-profiles - Create new business profile
router.post('/', async (req, res) => {
  try {
    const profileData = req.body;
    
    // Validate required fields
    if (!profileData.companyName || !profileData.companyAddress) {
      return res.status(400).json({ error: 'Company name and address are required' });
    }

    // If this is set as default, unset other defaults
    if (profileData.isDefault) {
      await prisma.businessProfile.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    const profile = await prisma.businessProfile.create({
      data: profileData,
    });

    res.status(201).json(profile);
  } catch (error) {
    console.error('Error creating business profile:', error);
    res.status(500).json({ error: 'Failed to create business profile' });
  }
});

// PUT /api/business-profiles/:id - Update business profile
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const profileData = req.body;

    // If this is set as default, unset other defaults
    if (profileData.isDefault) {
      await prisma.businessProfile.updateMany({
        where: { 
          isDefault: true,
          id: { not: id }
        },
        data: { isDefault: false },
      });
    }

    const profile = await prisma.businessProfile.update({
      where: { id },
      data: profileData,
    });

    res.json(profile);
  } catch (error) {
    console.error('Error updating business profile:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Business profile not found' });
    } else {
      res.status(500).json({ error: 'Failed to update business profile' });
    }
  }
});

// DELETE /api/business-profiles/:id - Delete business profile
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if this is the default profile
    const profile = await prisma.businessProfile.findUnique({
      where: { id },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Business profile not found' });
    }

    // Check if there are invoices using this profile
    const invoiceCount = await prisma.invoice.count({
      where: { businessProfileId: id },
    });

    if (invoiceCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete business profile with existing invoices',
        invoiceCount 
      });
    }

    await prisma.businessProfile.delete({
      where: { id },
    });

    // If this was the default profile, set another one as default
    if (profile.isDefault) {
      const firstProfile = await prisma.businessProfile.findFirst();
      if (firstProfile) {
        await prisma.businessProfile.update({
          where: { id: firstProfile.id },
          data: { isDefault: true },
        });
      }
    }

    res.json({ message: 'Business profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting business profile:', error);
    res.status(500).json({ error: 'Failed to delete business profile' });
  }
});

// POST /api/business-profiles/:id/set-default - Set as default profile
router.post('/:id/set-default', async (req, res) => {
  try {
    const { id } = req.params;

    // Unset all other defaults
    await prisma.businessProfile.updateMany({
      where: { isDefault: true },
      data: { isDefault: false },
    });

    // Set this profile as default
    const profile = await prisma.businessProfile.update({
      where: { id },
      data: { isDefault: true },
    });

    res.json(profile);
  } catch (error) {
    console.error('Error setting default business profile:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Business profile not found' });
    } else {
      res.status(500).json({ error: 'Failed to set default business profile' });
    }
  }
});

module.exports = router;
