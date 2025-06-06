const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/settings - Get all settings
router.get('/', async (req, res) => {
  try {
    const settings = await prisma.settings.findMany({
      orderBy: { key: 'asc' },
    });

    // Convert to key-value object
    const settingsObj = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});

    res.json(settingsObj);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// GET /api/settings/:key - Get single setting
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    
    const setting = await prisma.settings.findUnique({
      where: { key },
    });

    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    res.json({ key: setting.key, value: setting.value });
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
});

// POST /api/settings - Create or update multiple settings
router.post('/', async (req, res) => {
  try {
    const settingsData = req.body;
    
    if (!settingsData || typeof settingsData !== 'object') {
      return res.status(400).json({ error: 'Invalid settings data' });
    }

    const operations = Object.entries(settingsData).map(([key, value]) => 
      prisma.settings.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    );

    await Promise.all(operations);

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// PUT /api/settings/:key - Update single setting
router.put('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { value, description } = req.body;

    if (value === undefined) {
      return res.status(400).json({ error: 'Value is required' });
    }

    const setting = await prisma.settings.upsert({
      where: { key },
      update: { 
        value: String(value),
        description: description || undefined,
      },
      create: { 
        key, 
        value: String(value),
        description: description || undefined,
      },
    });

    res.json(setting);
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

// DELETE /api/settings/:key - Delete setting
router.delete('/:key', async (req, res) => {
  try {
    const { key } = req.params;

    await prisma.settings.delete({
      where: { key },
    });

    res.json({ message: 'Setting deleted successfully' });
  } catch (error) {
    console.error('Error deleting setting:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Setting not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete setting' });
    }
  }
});

// POST /api/settings/reset - Reset all settings to defaults
router.post('/reset', async (req, res) => {
  try {
    // Delete all existing settings
    await prisma.settings.deleteMany({});

    // Create default settings
    const defaultSettings = [
      { key: 'currency', value: 'INR', description: 'Default currency' },
      { key: 'taxRate', value: '18', description: 'Default tax rate percentage' },
      { key: 'companyName', value: '', description: 'Default company name' },
      { key: 'theme', value: 'light', description: 'Application theme' },
      { key: 'language', value: 'en', description: 'Application language' },
      { key: 'dateFormat', value: 'DD/MM/YYYY', description: 'Date format' },
      { key: 'numberFormat', value: 'en-IN', description: 'Number format' },
    ];

    await prisma.settings.createMany({
      data: defaultSettings,
    });

    res.json({ message: 'Settings reset to defaults successfully' });
  } catch (error) {
    console.error('Error resetting settings:', error);
    res.status(500).json({ error: 'Failed to reset settings' });
  }
});

module.exports = router;
