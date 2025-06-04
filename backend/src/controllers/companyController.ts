import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import * as csv from "csv-parse";
import * as fs from "fs";

const prisma = new PrismaClient();

export const getCompanies = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const where = search
      ? {
          OR: [
            { name: { contains: String(search), mode: "insensitive" } },
            { symbol: { contains: String(search), mode: "insensitive" } },
          ],
        }
      : {};

    const companies = await prisma.company.findMany({ where });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch companies" });
  }
};

export const getCompanyDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        stockData: {
          orderBy: { date: "desc" },
          take: 30, // Last 30 days of data
        },
      },
    });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch company details" });
  }
};

export const importCSV = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const results: any[] = [];
    fs.createReadStream(req.file.path)
      .pipe(csv.parse({ columns: true, trim: true }))
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        // Import companies one by one to handle duplicates
        for (const row of results) {
          try {
            await prisma.company.upsert({
              where: { symbol: row.symbol },
              update: {
                name: row.name,
                sector: row.sector,
                industry: row.industry,
                description: row.description,
                marketCap: parseFloat(row.marketCap) || null,
              },
              create: {
                symbol: row.symbol,
                name: row.name,
                sector: row.sector,
                industry: row.industry,
                description: row.description,
                marketCap: parseFloat(row.marketCap) || null,
              },
            });
          } catch (error) {
            console.error(`Failed to import company ${row.symbol}:`, error);
          }
        }

        fs.unlinkSync(req.file!.path);
        res.json({ message: "CSV data imported successfully" });
      });
  } catch (error) {
    res.status(500).json({ error: "Failed to import CSV data" });
  }
};
