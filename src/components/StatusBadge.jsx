import React from 'react';
import {
  Clock,
  Package,
  Truck,
  Navigation,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';

export const STATUS_OPTIONS = [
  { value: 'Pending', label: '🟡 Pending', color: 'amber' },
  { value: 'Picked Up', label: '🩵 Picked Up', color: 'sky' },
  { value: 'In Transit', label: '🔵 In Transit', color: 'blue' },
  { value: 'Out for Delivery', label: '🟣 Out for Delivery', color: 'indigo' },
  { value: 'Delivered', label: '🟢 Delivered', color: 'emerald' },
  { value: 'Cancelled', label: '⚪ Cancelled', color: 'slate' },
  { value: 'Failed Delivery', label: '⚠️ Failed Delivery', color: 'rose' }
];

export const getStatusConfig = (status) => {
  switch (status) {
    case 'Delivered':
      return {
        label: 'Delivered',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        icon: CheckCircle2,
        iconClass: 'text-emerald-600',
        dotClass: 'bg-emerald-500'
      };
    case 'Out for Delivery':
      return {
        label: 'Out for Delivery',
        badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
        icon: Navigation,
        iconClass: 'text-indigo-600',
        dotClass: 'bg-indigo-500'
      };
    case 'In Transit':
      return {
        label: 'In Transit',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: Truck,
        iconClass: 'text-blue-600',
        dotClass: 'bg-blue-500'
      };
    case 'Picked Up':
      return {
        label: 'Picked Up',
        badgeClass: 'bg-sky-100 text-sky-800 border-sky-300',
        icon: Package,
        iconClass: 'text-sky-600',
        dotClass: 'bg-sky-500'
      };
    case 'Pending':
      return {
        label: 'Pending',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        icon: Clock,
        iconClass: 'text-amber-600',
        dotClass: 'bg-amber-500'
      };
    case 'Failed Delivery':
      return {
        label: 'Failed Delivery',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
        icon: AlertTriangle,
        iconClass: 'text-rose-600',
        dotClass: 'bg-rose-500'
      };
    case 'Cancelled':
      return {
        label: 'Cancelled',
        badgeClass: 'bg-slate-200 text-slate-800 border-slate-300',
        icon: XCircle,
        iconClass: 'text-slate-600',
        dotClass: 'bg-slate-500'
      };
    default:
      return {
        label: status || 'Pending',
        badgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
        icon: Clock,
        iconClass: 'text-slate-500',
        dotClass: 'bg-slate-400'
      };
  }
};

const StatusBadge = ({ status, showIcon = true, size = 'normal' }) => {
  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  const sizeClasses =
    size === 'small'
      ? 'px-2 py-0.5 text-[10px]'
      : size === 'large'
      ? 'px-4 py-1.5 text-xs'
      : 'px-2.5 py-1 text-[11px]';

  return (
    <span
      className={`inline-flex items-center gap-1.2 rounded-full font-bold border transition-all shadow-2xs ${config.badgeClass} ${sizeClasses}`}
    >
      {showIcon && <IconComponent className={`w-3.5 h-3.5 shrink-0 ${config.iconClass}`} />}
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
