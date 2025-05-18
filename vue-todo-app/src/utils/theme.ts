export const toggleTheme = () => {
  const html = document.documentElement;
  html.classList.toggle('dark');
  localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
};

export const initializeTheme = () => {
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') document.documentElement.classList.add('dark');
};
