import { query } from "@/lib/db";
import type {
  InvestmentModelFeature,
  InvestmentModelContact,
} from "@/types/landing";

interface InvestmentModel {
  id: string;
  investmentModelsPageId: string;
  type: string;
  title: string;
  description: string;
  icon?: string;
  color?: string;
  gradient?: string;
  features?: InvestmentModelFeature[] | string | null;
  benefits?: string[] | string | null;
  ctaText?: string;
  ctaLink?: string;
  ctaIsScroll: boolean;
  contactTitle?: string;
  contactDescription?: string;
  contacts?: InvestmentModelContact[] | string | null;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface InvestmentModelsPage {
  id: string;
  additionalInfoTitle?: string;
  additionalInfoContent?: string;
  published: boolean;
  models?: InvestmentModel[];
  createdAt: string;
  updatedAt: string;
}

export async function getInvestmentModelsPage() {
  try {
    const pages = await query<InvestmentModelsPage>(
      `SELECT * FROM InvestmentModelsPage WHERE published = 1 ORDER BY createdAt DESC LIMIT 1`,
      []
    );

    if (!pages || pages.length === 0) {
      return null;
    }

    const page = pages[0];

    // Get models for this page
    const models = await query<InvestmentModel>(
      `SELECT * FROM InvestmentModel WHERE investmentModelsPageId = ? AND published = 1 ORDER BY \`order\` ASC`,
      [page.id]
    );

    return {
      ...page,
      models: models.map((model) => ({
        ...model,
        features: model.features ? JSON.parse(String(model.features)) : [],
        benefits: model.benefits ? JSON.parse(String(model.benefits)) : [],
        contacts: model.contacts ? JSON.parse(String(model.contacts)) : [],
      })),
    };
  } catch (error) {
    console.error("Error fetching investment models page:", error);
    return null;
  }
}

export async function getInvestmentModelsPageById(id: string) {
  try {
    const pages = await query<InvestmentModelsPage>(
      `SELECT * FROM InvestmentModelsPage WHERE id = ? LIMIT 1`,
      [id]
    );

    if (!pages || pages.length === 0) {
      return null;
    }

    const page = pages[0];

    // Get models for this page
    const models = await query<InvestmentModel>(
      `SELECT * FROM InvestmentModel WHERE investmentModelsPageId = ? ORDER BY \`order\` ASC`,
      [page.id]
    );

    return {
      ...page,
      models: models.map((model) => ({
        ...model,
        features: model.features ? JSON.parse(String(model.features)) : [],
        benefits: model.benefits ? JSON.parse(String(model.benefits)) : [],
        contacts: model.contacts ? JSON.parse(String(model.contacts)) : [],
      })),
    };
  } catch (error) {
    console.error("Error fetching investment models page by ID:", error);
    return null;
  }
}
