import React, { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

// Alert Manager untuk menyimpan & memberitahu subscriber
class AlertManager {
  constructor() {
    this.listeners = [];
    this.alerts = [];
    this.idCounter = 0;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.alerts));
  }

  show(type, message, options = {}) {
    const id = ++this.idCounter;
    const alert = {
      id,
      type,
      message,
      title: options.title,
      duration: options.duration ?? 5000,
      closable: options.closable ?? true,
      action: options.action,
    };

    this.alerts.push(alert);
    this.notify();

    if (alert.duration > 0) {
      setTimeout(() => this.remove(id), alert.duration);
    }
  }

  remove(id) {
    this.alerts = this.alerts.filter((a) => a.id !== id);
    this.notify();
  }

  success(m, o) {
    this.show("success", m, o);
  }
  error(m, o) {
    this.show("error", m, o);
  }
  warning(m, o) {
    this.show("warning", m, o);
  }
  info(m, o) {
    this.show("info", m, o);
  }
  clear() {
    this.alerts = [];
    this.notify();
  }
}

const alertManager = new AlertManager();
export const Alert = {
  success: (msg, opts) => alertManager.success(msg, opts),
  error: (msg, opts) => alertManager.error(msg, opts),
  warning: (msg, opts) => alertManager.warning(msg, opts),
  info: (msg, opts) => alertManager.info(msg, opts),
  clear: () => alertManager.clear(),
};

// Komponen Alert Item
const AlertItem = ({ alert }) => {
  const [exit, setExit] = useState(false);

  const configs = {
    success: {
      icon: CheckCircle,
      style: "bg-emerald-50 border-emerald-500 text-emerald-800",
    },
    error: {
      icon: AlertCircle,
      style: "bg-red-50 border-red-500 text-red-800",
    },
    warning: {
      icon: AlertTriangle,
      style: "bg-amber-50 border-amber-500 text-amber-800",
    },
    info: {
      icon: Info,
      style: "bg-blue-50 border-blue-500 text-blue-800",
    },
  };

  const cfg = configs[alert.type];
  const Icon = cfg.icon;

  return (
    <div
      className={`
        border-l-4 p-4 mb-3 rounded-lg shadow transition-all duration-300
        ${cfg.style}
        ${exit ? "opacity-0 translate-x-full" : ""}
      `}
    >
      <div className="flex gap-3">
        <Icon size={20} />

        <div className="flex-1">
          {alert.title && <p className="font-semibold">{alert.title}</p>}
          <p className="text-sm">{alert.message}</p>
        </div>

        {alert.closable !== false && (
          <button
            onClick={() => {
              setExit(true);
              setTimeout(() => alertManager.remove(alert.id), 300);
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

// Container
export default function AlertContainer() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => alertManager.subscribe(setAlerts), []);

  return (
    <div className="fixed top-4 right-4 z-50 w-96 pointer-events-none">
      <div className="pointer-events-auto">
        {alerts.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
}
