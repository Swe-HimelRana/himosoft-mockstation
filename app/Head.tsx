// app/head.tsx
export default function Head() {
    return (
      <>
        {/* Favicon */}
        <link rel="icon" href="https://himosoft.com.bd/shortlogo.png" />
        <link rel="shortcut icon" href="https://himosoft.com.bd/shortlogo.png" />
  
        {/* Basic Meta */}
        <meta name="description" content="Test your API and webhooks with ease using HimoSoft MockStation – your powerful and simple API testing tool." />
        <meta name="keywords" content="API testing, webhook mock, mock API, HimoSoft, MockStation, developer tools" />
        <meta name="author" content="HimoSoft" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#111827" />
  
        {/* Open Graph Meta (for Facebook, LinkedIn) */}
        <meta property="og:title" content="HimoSoft MockStation" />
        <meta property="og:description" content="Test your API and webhooks with ease using HimoSoft MockStation." />
        <meta property="og:url" content="https://himosoft.com.bd" />
        <meta property="og:site_name" content="HimoSoft MockStation" />
        <meta property="og:image" content="https://himosoft.com.bd/shortlogo.png" />
        <meta property="og:type" content="website" />
  
        {/* Twitter Card Meta */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HimoSoft MockStation" />
        <meta name="twitter:description" content="Test your API and webhooks with ease using HimoSoft MockStation." />
        <meta name="twitter:image" content="https://himosoft.com.bd/shortlogo.png" />
        <meta name="twitter:site" content="@himosoft" />
      </>
    )
  }
  