import React from "react";
import {
  Activity,
  Award,
  Banknote,
  BarChart3,
  Bell,
  BookOpen,
  Bookmark,
  Briefcase,
  Building2,
  Calculator,
  CheckCircle2,
  Clock,
  Coins,
  Compass,
  CreditCard,
  Eye,
  FileText,
  Flame,
  Globe,
  GraduationCap,
  Headphones,
  HeartHandshake,
  HelpCircle,
  Laptop,
  Layers,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Percent,
  Phone,
  PhoneCall,
  PieChart,
  Rocket,
  Send,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Tag,
  Target,
  ThumbsUp,
  TrendingUp,
  Users,
  Video,
  Wallet,
  Zap,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

export interface IconMeta {
  name: string;
  labelFa: string;
  category: "finance" | "education" | "trust" | "contact" | "general";
  icon: LucideIcon;
}

export const AVAILABLE_ICONS: IconMeta[] = [
  // مالی و سرمایه
  { name: "TrendingUp", labelFa: "رشد و صعود", category: "finance", icon: TrendingUp },
  { name: "Coins", labelFa: "سکه‌ها", category: "finance", icon: Coins },
  { name: "PieChart", labelFa: "نمودار دایره‌ای", category: "finance", icon: PieChart },
  { name: "BarChart3", labelFa: "نمودار میله‌ای", category: "finance", icon: BarChart3 },
  { name: "Wallet", labelFa: "کیف پول", category: "finance", icon: Wallet },
  { name: "Banknote", labelFa: "اسکناس", category: "finance", icon: Banknote },
  { name: "CreditCard", labelFa: "کارت بانکی", category: "finance", icon: CreditCard },
  { name: "Percent", labelFa: "درصد و بازدهی", category: "finance", icon: Percent },
  { name: "Calculator", labelFa: "ماشین‌حساب", category: "finance", icon: Calculator },

  // آموزش و محتوا
  { name: "GraduationCap", labelFa: "کلاه فارغ‌التحصیلی", category: "education", icon: GraduationCap },
  { name: "BookOpen", labelFa: "کتاب باز", category: "education", icon: BookOpen },
  { name: "FileText", labelFa: "مقاله و سند", category: "education", icon: FileText },
  { name: "Video", labelFa: "ویدیو", category: "education", icon: Video },
  { name: "Bookmark", labelFa: "نشانه‌گذاری", category: "education", icon: Bookmark },
  { name: "Compass", labelFa: "قطب‌نما و هدایت", category: "education", icon: Compass },
  { name: "Layers", labelFa: "لایه‌ها و سطوح", category: "education", icon: Layers },

  // اعتماد، امنیت و دستاورد
  { name: "ShieldCheck", labelFa: "سپر امن و تایید", category: "trust", icon: ShieldCheck },
  { name: "Shield", labelFa: "سپر محافظ", category: "trust", icon: Shield },
  { name: "Award", labelFa: "مدال و افتخار", category: "trust", icon: Award },
  { name: "Star", labelFa: "ستاره امتیاز", category: "trust", icon: Star },
  { name: "CheckCircle2", labelFa: "تایید شده", category: "trust", icon: CheckCircle2 },
  { name: "HeartHandshake", labelFa: "همکاری و تعهد", category: "trust", icon: HeartHandshake },
  { name: "Lock", labelFa: "قفل و حریم خصوصی", category: "trust", icon: Lock },
  { name: "ThumbsUp", labelFa: "رضایت کاربر", category: "trust", icon: ThumbsUp },

  // ارتباطات و تماس
  { name: "PhoneCall", labelFa: "تماس تلفنی", category: "contact", icon: PhoneCall },
  { name: "Phone", labelFa: "تلفن", category: "contact", icon: Phone },
  { name: "Smartphone", labelFa: "تلفن همراه", category: "contact", icon: Smartphone },
  { name: "Headphones", labelFa: "پشتیبانی ۲۴ ساعته", category: "contact", icon: Headphones },
  { name: "Mail", labelFa: "پست الکترونیک", category: "contact", icon: Mail },
  { name: "MessageCircle", labelFa: "گفتگو و چت", category: "contact", icon: MessageCircle },
  { name: "MessageSquare", labelFa: "پیام", category: "contact", icon: MessageSquare },
  { name: "Send", labelFa: "ارسال و تلگرام", category: "contact", icon: Send },
  { name: "MapPin", labelFa: "موقعیت مکانی", category: "contact", icon: MapPin },
  { name: "Clock", labelFa: "ساعت کاری", category: "contact", icon: Clock },

  // عمومی و ویژگی‌ها
  { name: "Sparkles", labelFa: "ویژه و ممتاز", category: "general", icon: Sparkles },
  { name: "Zap", labelFa: "سرعت و انرژی", category: "general", icon: Zap },
  { name: "Flame", labelFa: "داغ و محبوب", category: "general", icon: Flame },
  { name: "Rocket", labelFa: "شروع پرقدرت", category: "general", icon: Rocket },
  { name: "Target", labelFa: "هدف‌گذاری", category: "general", icon: Target },
  { name: "Users", labelFa: "کاربران و جامعه", category: "general", icon: Users },
  { name: "Briefcase", labelFa: "مشاوره و کسب‌وکار", category: "general", icon: Briefcase },
  { name: "Building2", labelFa: "شرکت و سازمان", category: "general", icon: Building2 },
  { name: "Globe", labelFa: "جهانی و وب", category: "general", icon: Globe },
  { name: "Bell", labelFa: "زنگوله خبرنامه", category: "general", icon: Bell },
  { name: "HelpCircle", labelFa: "راهنما و سوالات", category: "general", icon: HelpCircle },
  { name: "Activity", labelFa: "فعالیت زنده", category: "general", icon: Activity },
  { name: "Laptop", labelFa: "پلتفرم دیجیتال", category: "general", icon: Laptop },
  { name: "Eye", labelFa: "بازدید", category: "general", icon: Eye },
  { name: "Tag", labelFa: "برچسب", category: "general", icon: Tag },
];

const ICON_MAP = new Map<string, LucideIcon>();
AVAILABLE_ICONS.forEach((item) => {
  ICON_MAP.set(item.name.toLowerCase(), item.icon);
  ICON_MAP.set(item.name, item.icon);
});

export interface DynamicIconProps extends LucideProps {
  name: string;
  fallback?: LucideIcon;
}

export function DynamicIcon({
  name,
  fallback = Sparkles,
  ...props
}: DynamicIconProps) {
  if (!name) {
    const Fallback = fallback;
    return <Fallback {...props} />;
  }

  // Check map directly or lowercased
  const IconComponent = ICON_MAP.get(name) || ICON_MAP.get(name.toLowerCase()) || fallback;
  return <IconComponent {...props} />;
}
