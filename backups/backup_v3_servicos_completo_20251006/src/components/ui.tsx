"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  style?: React.CSSProperties;
}

export function GlassCard({ children, className, onClick, hover = true, style }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-6",
        hover && "hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-glow",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  onClick, 
  disabled = false,
  type = 'button'
}: ButtonProps) {
  const baseClasses = "font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg hover:scale-105 focus:ring-primary",
    secondary: "bg-gradient-to-r from-secondary to-secondary-dark text-white hover:shadow-lg hover:scale-105 focus:ring-secondary",
    success: "bg-success text-white hover:bg-green-600 hover:shadow-lg hover:scale-105 focus:ring-success",
    warning: "bg-warning text-white hover:bg-yellow-600 hover:shadow-lg hover:scale-105 focus:ring-warning",
    danger: "bg-danger text-white hover:bg-red-600 hover:shadow-lg hover:scale-105 focus:ring-danger",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      type={type}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusColors = {
    scheduled: "bg-blue-100 text-blue-800",
    confirmed: "bg-success/20 text-green-800",
    in_progress: "bg-warning/20 text-yellow-800",
    completed: "bg-success/20 text-green-800",
    cancelled: "bg-danger/20 text-red-800",
    no_show: "bg-gray-100 text-gray-800",
    pending: "bg-warning/20 text-yellow-800",
    paid: "bg-success/20 text-green-800",
  };

  const statusLabels = {
    scheduled: "Agendado",
    confirmed: "Confirmado",
    in_progress: "Em Andamento",
    completed: "Concluído",
    cancelled: "Cancelado",
    no_show: "Não Compareceu",
    pending: "Pendente",
    paid: "Pago",
  };

  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-xs font-semibold",
        statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800",
        className
      )}
    >
      {statusLabels[status as keyof typeof statusLabels] || status}
    </span>
  );
}

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm", 
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          "rounded-full object-cover",
          sizes[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold",
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
}