import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api-client";

type Paginated<T> = { items: T[]; pagination?: unknown };

async function listItems<T>(url: string): Promise<T[]> {
  const { data } = await api.get(url);
  const payload = data.data;
  if (Array.isArray(payload)) return payload as T[];
  return ((payload as Paginated<T>)?.items ?? []) as T[];
}

function mutationError(error: unknown, fallback: string) {
  return (
    (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
    fallback
  );
}

export const landingCmsKeys = {
  all: ["admin-landing-cms"] as const,
  homeLanding: () => [...landingCmsKeys.all, "home-landing"] as const,
  homeSlides: () => [...landingCmsKeys.all, "home-slides"] as const,
  homeMiniSliders: () => [...landingCmsKeys.all, "home-mini-sliders"] as const,
  mobileSteps: () => [...landingCmsKeys.all, "mobile-steps"] as const,
  about: () => [...landingCmsKeys.all, "about"] as const,
  business: () => [...landingCmsKeys.all, "business"] as const,
  investmentPlans: () => [...landingCmsKeys.all, "investment-plans"] as const,
};

export function useAdminHomeLanding() {
  return useQuery({
    queryKey: landingCmsKeys.homeLanding(),
    queryFn: () => listItems<Record<string, unknown>>("/api/admin/home-landing?limit=1"),
    staleTime: 30_000,
  });
}

export function useUpdateHomeLanding(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.patch(`/api/admin/home-landing/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: landingCmsKeys.homeLanding() });
      toast.success("لندینگ خانه ذخیره شد");
    },
    onError: (e) => toast.error(mutationError(e, "خطا در ذخیره لندینگ")),
  });
}

export function useAdminHomeSlides() {
  return useQuery({
    queryKey: landingCmsKeys.homeSlides(),
    queryFn: () => listItems<Record<string, unknown>>("/api/admin/home-slides?limit=100"),
  });
}

export function useCreateHomeSlide() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.post("/api/admin/home-slides", payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: landingCmsKeys.homeSlides() });
      toast.success("اسلاید اضافه شد");
    },
    onError: (e) => toast.error(mutationError(e, "خطا در ایجاد اسلاید")),
  });
}

export function useUpdateHomeSlide() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Record<string, unknown> & { id: string }) => {
      const { data } = await api.patch(`/api/admin/home-slides/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: landingCmsKeys.homeSlides() });
      toast.success("اسلاید به‌روزرسانی شد");
    },
    onError: (e) => toast.error(mutationError(e, "خطا در به‌روزرسانی اسلاید")),
  });
}

export function useDeleteHomeSlide() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/admin/home-slides/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: landingCmsKeys.homeSlides() });
      toast.success("اسلاید حذف شد");
    },
    onError: () => toast.error("خطا در حذف اسلاید"),
  });
}

export function useAdminHomeMiniSliders() {
  return useQuery({
    queryKey: landingCmsKeys.homeMiniSliders(),
    queryFn: () => listItems<Record<string, unknown>>("/api/admin/home-mini-sliders?limit=100"),
  });
}

export function useCreateHomeMiniSlider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.post("/api/admin/home-mini-sliders", payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: landingCmsKeys.homeMiniSliders() });
      toast.success("مینی‌اسلایدر اضافه شد");
    },
    onError: (e) => toast.error(mutationError(e, "خطا در ایجاد مینی‌اسلایدر")),
  });
}

export function useUpdateHomeMiniSlider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Record<string, unknown> & { id: string }) => {
      const { data } = await api.patch(`/api/admin/home-mini-sliders/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: landingCmsKeys.homeMiniSliders() });
      toast.success("مینی‌اسلایدر به‌روزرسانی شد");
    },
    onError: (e) => toast.error(mutationError(e, "خطا در به‌روزرسانی")),
  });
}

export function useDeleteHomeMiniSlider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/admin/home-mini-sliders/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: landingCmsKeys.homeMiniSliders() });
      toast.success("مینی‌اسلایدر حذف شد");
    },
    onError: () => toast.error("خطا در حذف"),
  });
}

export function useAdminMobileSteps() {
  return useQuery({
    queryKey: landingCmsKeys.mobileSteps(),
    queryFn: () =>
      listItems<Record<string, unknown>>("/api/admin/mobile-scroller-steps?limit=500"),
  });
}

export function useCreateMobileStep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.post("/api/admin/mobile-scroller-steps", payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: landingCmsKeys.mobileSteps() });
      toast.success("قدم اضافه شد");
    },
    onError: (e) => toast.error(mutationError(e, "خطا در ایجاد قدم")),
  });
}

export function useUpdateMobileStep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Record<string, unknown> & { id: string }) => {
      const { data } = await api.patch(`/api/admin/mobile-scroller-steps/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: landingCmsKeys.mobileSteps() });
      toast.success("قدم به‌روزرسانی شد");
    },
    onError: (e) => toast.error(mutationError(e, "خطا در به‌روزرسانی قدم")),
  });
}

export function useDeleteMobileStep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/admin/mobile-scroller-steps/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: landingCmsKeys.mobileSteps() });
      toast.success("قدم حذف شد");
    },
    onError: () => toast.error("خطا در حذف قدم"),
  });
}

export function useAdminAboutPage() {
  return useQuery({
    queryKey: landingCmsKeys.about(),
    queryFn: async () => {
      const items = await listItems<Record<string, unknown>>(
        "/api/admin/about-page?limit=1"
      );
      return items[0] ?? null;
    },
  });
}

export function useUpdateAboutPage(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.patch(`/api/admin/about-page/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: landingCmsKeys.about() });
      toast.success("صفحه درباره ما ذخیره شد");
    },
    onError: (e) => toast.error(mutationError(e, "خطا در ذخیره درباره ما")),
  });
}

export function useCreateResumeItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.post("/api/admin/resume-items", payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: landingCmsKeys.about() });
      toast.success("آیتم رزومه اضافه شد");
    },
    onError: (e) => toast.error(mutationError(e, "خطا در ایجاد آیتم")),
  });
}

export function useUpdateResumeItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Record<string, unknown> & { id: string }) => {
      const { data } = await api.patch(`/api/admin/resume-items/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: landingCmsKeys.about() });
      toast.success("آیتم رزومه به‌روزرسانی شد");
    },
    onError: (e) => toast.error(mutationError(e, "خطا در به‌روزرسانی")),
  });
}

export function useDeleteResumeItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/admin/resume-items/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: landingCmsKeys.about() });
      toast.success("آیتم حذف شد");
    },
    onError: () => toast.error("خطا در حذف"),
  });
}

export function useCreateTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.post("/api/admin/team-members", payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: landingCmsKeys.about() });
      toast.success("عضو تیم اضافه شد");
    },
    onError: (e) => toast.error(mutationError(e, "خطا در ایجاد عضو")),
  });
}

export function useUpdateTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Record<string, unknown> & { id: string }) => {
      const { data } = await api.patch(`/api/admin/team-members/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: landingCmsKeys.about() });
      toast.success("عضو تیم به‌روزرسانی شد");
    },
    onError: (e) => toast.error(mutationError(e, "خطا در به‌روزرسانی")),
  });
}

export function useDeleteTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/admin/team-members/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: landingCmsKeys.about() });
      toast.success("عضو حذف شد");
    },
    onError: () => toast.error("خطا در حذف"),
  });
}

export function useCreateCertificate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.post("/api/admin/certificates", payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: landingCmsKeys.about() });
      toast.success("گواهی اضافه شد");
    },
    onError: (e) => toast.error(mutationError(e, "خطا در ایجاد گواهی")),
  });
}

export function useUpdateCertificate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Record<string, unknown> & { id: string }) => {
      const { data } = await api.patch(`/api/admin/certificates/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: landingCmsKeys.about() });
      toast.success("گواهی به‌روزرسانی شد");
    },
    onError: (e) => toast.error(mutationError(e, "خطا در به‌روزرسانی")),
  });
}

export function useDeleteCertificate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/admin/certificates/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: landingCmsKeys.about() });
      toast.success("گواهی حذف شد");
    },
    onError: () => toast.error("خطا در حذف"),
  });
}

export function useAdminBusinessConsulting() {
  return useQuery({
    queryKey: landingCmsKeys.business(),
    queryFn: async () => {
      const items = await listItems<Record<string, unknown>>(
        "/api/admin/business-consulting?limit=1"
      );
      return items[0] ?? null;
    },
  });
}

export function useUpdateBusinessConsulting(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.patch(`/api/admin/business-consulting/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: landingCmsKeys.business() });
      toast.success("صفحه مشاوره ذخیره شد");
    },
    onError: (e) => toast.error(mutationError(e, "خطا در ذخیره مشاوره")),
  });
}

export function useAdminInvestmentPlansPage() {
  return useQuery({
    queryKey: landingCmsKeys.investmentPlans(),
    queryFn: async () => {
      const items = await listItems<Record<string, unknown>>(
        "/api/admin/investment-plans?limit=1"
      );
      const first = items[0];
      if (!first?.id) return null;
      const { data } = await api.get(`/api/admin/investment-plans/${first.id}`);
      return data.data as Record<string, unknown>;
    },
  });
}

export function useUpdateInvestmentPlansPage(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.patch(`/api/admin/investment-plans/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: landingCmsKeys.investmentPlans() });
      toast.success("صفحه سبدها ذخیره شد");
    },
    onError: (e) => toast.error(mutationError(e, "خطا در ذخیره سبدها")),
  });
}

export function useCreateInvestmentPlanItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.post("/api/admin/investment-plan-items", payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: landingCmsKeys.investmentPlans() });
      toast.success("نوع سبد اضافه شد");
    },
    onError: (e) => toast.error(mutationError(e, "خطا در ایجاد")),
  });
}

export function useUpdateInvestmentPlanItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Record<string, unknown> & { id: string }) => {
      const { data } = await api.patch(`/api/admin/investment-plan-items/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: landingCmsKeys.investmentPlans() });
      toast.success("نوع سبد به‌روزرسانی شد");
    },
    onError: (e) => toast.error(mutationError(e, "خطا در به‌روزرسانی")),
  });
}

export function useDeleteInvestmentPlanItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/admin/investment-plan-items/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: landingCmsKeys.investmentPlans() });
      toast.success("نوع سبد حذف شد");
    },
    onError: () => toast.error("خطا در حذف"),
  });
}

export function useCreateInvestmentTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.post("/api/admin/investment-tags", payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: landingCmsKeys.investmentPlans() });
      toast.success("تگ اضافه شد");
    },
    onError: (e) => toast.error(mutationError(e, "خطا در ایجاد تگ")),
  });
}

export function useUpdateInvestmentTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Record<string, unknown> & { id: string }) => {
      const { data } = await api.patch(`/api/admin/investment-tags/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: landingCmsKeys.investmentPlans() });
      toast.success("تگ به‌روزرسانی شد");
    },
    onError: (e) => toast.error(mutationError(e, "خطا در به‌روزرسانی")),
  });
}

export function useDeleteInvestmentTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/admin/investment-tags/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: landingCmsKeys.investmentPlans() });
      toast.success("تگ حذف شد");
    },
    onError: () => toast.error("خطا در حذف"),
  });
}
