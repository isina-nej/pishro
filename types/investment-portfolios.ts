// Types for Investment Portfolios Page

export interface Portfolio {
  id: string;
  name: string;
  riskLevel: "low" | "medium" | "high";
  monthlyReturn: number; // percentage
  description: string;
  price?: number; // قیمت سبد (اختیاری - بعداً اضافه می‌شود)
  features: string[];
}

export interface InvestmentModel {
  type: "in-person" | "online";
  title: string;
  description: string;
  features: string[];
  icon?: string;
}

export interface PortfolioSelection {
  amount: number;
  duration: number; // in months
  portfolioType: "low" | "medium" | "high";
}
