import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Company {
  id: string;
  symbol: string;
  name: string;
  sector?: string;
  marketCap?: number;
}

interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<
    Company & { stockData?: StockData[] }
  >();
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, [search]);

  const fetchCompanies = async () => {
    try {
      const response = await fetch(
        `/api/companies${search ? `?search=${search}` : ""}`
      );
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    }
  };

  const handleCompanyClick = async (company: Company) => {
    try {
      const response = await fetch(`/api/companies/${company.id}`);
      const data = await response.json();
      setSelectedCompany(data);
    } catch (error) {
      console.error("Failed to fetch company details:", error);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files?.[0]) return;

    const formData = new FormData();
    formData.append("file", event.target.files[0]);
    setIsUploading(true);

    try {
      await fetch("/api/companies/import", {
        method: "POST",
        body: formData,
      });
      fetchCompanies();
    } catch (error) {
      console.error("Failed to upload CSV:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Market Data</h1>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search companies..."
            className="flex-1 p-2 border rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csvUpload"
            />
            <label
              htmlFor="csvUpload"
              className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {isUploading ? "Uploading..." : "Import CSV"}
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Companies</h2>
          <div className="space-y-2">
            {companies.map((company) => (
              <div
                key={company.id}
                onClick={() => handleCompanyClick(company)}
                className="p-2 hover:bg-gray-100 cursor-pointer rounded"
              >
                <div className="font-medium">{company.symbol}</div>
                <div className="text-sm text-gray-600">{company.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-lg shadow p-4">
          {selectedCompany ? (
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {selectedCompany.name}
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-600">Symbol</p>
                  <p className="font-medium">{selectedCompany.symbol}</p>
                </div>
                <div>
                  <p className="text-gray-600">Sector</p>
                  <p className="font-medium">
                    {selectedCompany.sector || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Market Cap</p>
                  <p className="font-medium">
                    {selectedCompany.marketCap
                      ? new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          notation: "compact",
                        }).format(selectedCompany.marketCap)
                      : "N/A"}
                  </p>
                </div>
              </div>

              {selectedCompany.stockData &&
                selectedCompany.stockData.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Recent Stock Data
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Open</th>
                            <th className="px-4 py-2">High</th>
                            <th className="px-4 py-2">Low</th>
                            <th className="px-4 py-2">Close</th>
                            <th className="px-4 py-2">Volume</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedCompany.stockData.map((data) => (
                            <tr key={data.date} className="border-t">
                              <td className="px-4 py-2">
                                {new Date(data.date).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-2">
                                {data.open.toFixed(2)}
                              </td>
                              <td className="px-4 py-2">
                                {data.high.toFixed(2)}
                              </td>
                              <td className="px-4 py-2">
                                {data.low.toFixed(2)}
                              </td>
                              <td className="px-4 py-2">
                                {data.close.toFixed(2)}
                              </td>
                              <td className="px-4 py-2">
                                {new Intl.NumberFormat().format(data.volume)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Select a company to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Companies;
