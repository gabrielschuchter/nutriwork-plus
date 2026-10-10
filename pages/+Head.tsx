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

const googleTagScript = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-RM40LYCJLG');`;

const metaPixelScript = `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1516307990311398');
fbq('track', 'PageView');`;

export function Head() {
  return <>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-RM40LYCJLG" />
    <script dangerouslySetInnerHTML={{ __html: googleTagScript }} />
    <meta name="theme-color" content="#f4f7fc" />
    <meta name="robots" content="index, follow" />
    <meta property="og:locale" content="pt_BR" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,500;1,600&display=swap" rel="stylesheet" />
    <script dangerouslySetInnerHTML={{ __html: lightThemeBootScript }} />
    <script dangerouslySetInnerHTML={{ __html: metaPixelScript }} />
  </>;
}
