const lightThemeBootScript = `(() => {
  document.documentElement.dataset.theme = 'light';
  document.documentElement.style.colorScheme = 'light';
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute('content', '#f4f7fc');
  try {
    localStorage.removeItem('nutriwork-theme');
  } catch {
    // A stale theme preference must never change the forced light mode.
  }
})();`;

export function Head() {
  return <>
    <meta name="theme-color" content="#f4f7fc" />
    <meta name="robots" content="index, follow" />
    <meta property="og:locale" content="pt_BR" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,500;1,600&display=swap" rel="stylesheet" />
    <script dangerouslySetInnerHTML={{ __html: lightThemeBootScript }} />
  </>;
}
