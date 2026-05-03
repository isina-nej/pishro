import { 
  getInvestmentModelsPage as getPageMySQL, 
  getInvestmentModelsPageById as getPageByIdMySQL 
} from "./investment-models-mysql";

/**
 * دریافت صفحه Investment Models با تمام مدل‌های منتشر شده
 */
export async function getInvestmentModelsPage() {
  return await getPageMySQL();
}

/**
 * دریافت یک صفحه Investment Models خاص (برای ادمین)
 */
export async function getInvestmentModelsPageById(id: string) {
  return await getPageByIdMySQL(id);
}
