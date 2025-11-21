const config = {
  success: {
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    text: "text-green-600",
    iconColor: "#22c55e",
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#22c55e"><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2Zm4.78 7.7-5.67 5.67a.75.75 0 0 1-1.06 0l-2.83-2.83a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l2.3 2.3 5.14-5.14c.29-.29.77-.29 1.06 0 .29.29.29.76 0 1.06Z"></path></svg>`,
  },
  error: {
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-600",
    iconColor: "#ef4444",
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ef4444"><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2Zm3.36 12.3c.29.29.29.77 0 1.06-.15.15-.34.22-.53.22s-.38-.07-.53-.22l-2.3-2.3-2.3 2.3c-.15.15-.34.22-.53.22s-.38-.07-.53-.22a.754.754 0 0 1 0-1.06l2.3-2.3-2.3-2.3a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l2.3 2.3 2.3-2.3c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06l-2.3 2.3 2.3 2.3Z"></path></svg>`,
  },
  warning: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    text: "text-yellow-600",
    iconColor: "#eab308",
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#eab308"><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2Zm-.75 6c0-.41.34-.75.75-.75s.75.34.75.75v5c0 .41-.34.75-.75.75s-.75-.34-.75-.75V8Zm1.67 8.38c-.05.13-.12.23-.21.33-.1.09-.21.16-.33.21-.12.05-.25.08-.38.08s-.26-.03-.38-.08-.23-.12-.33-.21c-.09-.1-.16-.2-.21-.33A.995.995 0 0 1 11 16c0-.13.03-.26.08-.38s.12-.23.21-.33c.1-.09.21-.16.33-.21a1 1 0 0 1 .76 0c.12.05.23.12.33.21.09.1.16.21.21.33.05.12.08.25.08.38s-.03.26-.08.38Z"></path></svg>`,
  },
  info: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-600",
    iconColor: "#3b82f6",
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#3b82f6"><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2Zm.75 6c0 .41-.34.75-.75.75s-.75-.34-.75-.75.34-.75.75-.75.75.34.75.75Zm-.75 10c-.41 0-.75-.34-.75-.75v-5c0-.41.34-.75.75-.75s.75.34.75.75v5c0 .41-.34.75-.75.75Z"></path></svg>`,
  },
};

// Modern toast – glossy + blur + smooth animation
export const showToastTopRight = (type, message) => {
  const style = config[type] || config.info;

  const toast = document.createElement("div");
  toast.className = `
    fixed right-5 top-5 z-[9999]
    ${style.bg} ${style.border}
    backdrop-blur-xl
    border
    shadow-xl
    rounded-xl
    px-4 py-3
    flex items-center gap-3 w-[330px]
    animate-[slideIn_.25s_ease-out]
  `;

  const iconWrapper = document.createElement("div");
  iconWrapper.className = "flex-shrink-0";
  iconWrapper.innerHTML = style.iconSvg;

  const msgText = document.createElement("p");
  msgText.className = `${style.text} text-sm leading-relaxed flex-1`;
  msgText.textContent = message;

  toast.appendChild(iconWrapper);
  toast.appendChild(msgText);

  document.body.appendChild(toast);

  // auto remove
  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-x-2", "transition-all");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};
