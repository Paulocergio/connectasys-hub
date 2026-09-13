import { Lineicons, type LineiconsProps } from "@lineiconshq/react-lineicons";
import {
  Alarm1Outlined,
  ArrowRightOutlined,
  BarChart4Outlined,
  BarChartDollarOutlined,
  Bolt2Outlined,
  BoxClosedOutlined,
  Buildings1Outlined,
  CalendarDaysOutlined,
  Car2Outlined,
  CheckCircle1Outlined,
  CheckOutlined,
  ChevronDownOutlined,
  ChevronLeftOutlined,
  CreditCardMultipleOutlined,
  ExitOutlined,
  FilePencilOutlined,
  Flag1Outlined,
  Gauge1Outlined,
  Gear1Outlined,
  Headphone1Outlined,
  Layout26Outlined,
  MagicOutlined,
  MinusCircleOutlined,
  MinusOutlined,
  MoonHalfRight5Outlined,
  PlusOutlined,
  PrinterOutlined,
  Search1Outlined,
  Shield2Outlined,
  Spinner2SacleOutlined,
  StarFatSolid,
  Sun1Outlined,
  Ticket1Outlined,
  Trash3Outlined,
  TrendUp1Outlined,
  User4Outlined,
  UserMultiple4Outlined,
  Wallet1Outlined,
  XOutlined,
} from "@lineiconshq/free-icons";
import { cn } from "@/lib/utils";

/**
 * Substitui os ícones lucide-react usados no app por Lineicons (free-icons).
 * A versão free não cobre todo o conjunto original (sem Wrench, Package,
 * Receipt, Clock, TriangleAlert, CircleDot, ChevronRight avulsos etc.) —
 * cada nome abaixo mapeia pro ícone mais próximo disponível, mantendo os
 * mesmos nomes de export pra não precisar tocar no JSX de quem usa.
 */

type IconData = LineiconsProps["icon"];
type IconProps = { className?: string };

function criarIcone(icon: IconData) {
  return function Icone({ className }: IconProps) {
    return <Lineicons icon={icon} className={className} />;
  };
}

export const Wrench = criarIcone(Gear1Outlined);
export const Users = criarIcone(UserMultiple4Outlined);
export const User = criarIcone(User4Outlined);
export const UserCog = criarIcone(User4Outlined);
export const Contact = criarIcone(User4Outlined);
export const Package = criarIcone(BoxClosedOutlined);
export const PackageSearch = criarIcone(BoxClosedOutlined);
export const Receipt = criarIcone(BarChartDollarOutlined);
export const HandCoins = criarIcone(TrendUp1Outlined);
export const TrendUp = criarIcone(TrendUp1Outlined);
export const Wallet = criarIcone(Wallet1Outlined);
export const Banknote = criarIcone(Wallet1Outlined);
export const CreditCard = criarIcone(CreditCardMultipleOutlined);
export const Barcode = criarIcone(Ticket1Outlined);
export const Zap = criarIcone(Bolt2Outlined);
export const Minus = criarIcone(MinusOutlined);
export const ChevronLeft = criarIcone(ChevronLeftOutlined);
export const ChevronDown = criarIcone(ChevronDownOutlined);
export const LogOut = criarIcone(ExitOutlined);
export const Sun = criarIcone(Sun1Outlined);
export const Moon = criarIcone(MoonHalfRight5Outlined);
export const TriangleAlert = criarIcone(Flag1Outlined);
export const AlertCircle = criarIcone(Flag1Outlined);
export const CircleDot = criarIcone(MinusCircleOutlined);
export const CheckCircle2 = criarIcone(CheckCircle1Outlined);
export const XCircle = criarIcone(XOutlined);
export const Clock = criarIcone(Alarm1Outlined);
export const Shield = criarIcone(Shield2Outlined);
export const Headset = criarIcone(Headphone1Outlined);
export const CalendarClock = criarIcone(CalendarDaysOutlined);
export const BarChart3 = criarIcone(BarChart4Outlined);
export const Check = criarIcone(CheckOutlined);
export const Star = criarIcone(StarFatSolid);
export const ArrowRight = criarIcone(ArrowRightOutlined);
export const Building2 = criarIcone(Buildings1Outlined);
export const Sparkles = criarIcone(MagicOutlined);
export const Gauge = criarIcone(Gauge1Outlined);
export const LayoutDashboard = criarIcone(Layout26Outlined);
export const Plus = criarIcone(PlusOutlined);
export const Pencil = criarIcone(FilePencilOutlined);
export const Trash2 = criarIcone(Trash3Outlined);
export const Search = criarIcone(Search1Outlined);
export const Car = criarIcone(Car2Outlined);
export const Printer = criarIcone(PrinterOutlined);

// Girado pelo caller com a classe animate-spin, igual ao Loader2 do lucide.
export const Loader2 = criarIcone(Spinner2SacleOutlined);

// Sem ChevronRight na free-icons — espelha o ChevronLeft.
export function ChevronRight({ className }: IconProps) {
  return <Lineicons icon={ChevronLeftOutlined} className={cn("rotate-180", className)} />;
}
