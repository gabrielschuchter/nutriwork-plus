const themeBootScript = `(() => {
  const storageKey = 'nutriwork-theme';
  let theme = 'light';
  try {
    const savedTheme = localStorage.getItem(storageKey);
    theme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'light';
  } catch {
    theme = 'light';
  }
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute('content', theme === 'light' ? '#f4f7fc' : '#02040a');
})();`;

export function Head() {
  return <>
    <meta name="theme-color" content="#f4f7fc" />
    <meta name="robots" content="index, follow" />
    <meta property="og:locale" content="pt_BR" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,500;1,600&display=swap" rel="stylesheet" />
    <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
  </>;
}
