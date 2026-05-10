export default function LinkedCardName({ card, className = "" }) {
  const faviconUrl = getFaviconUrl(card.url);

  return (
    <a
      className={`inline-flex min-w-0 items-center gap-2 font-semibold text-gray-950 underline decoration-gray-300 underline-offset-4 hover:decoration-gray-950 ${className}`}
      href={card.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {faviconUrl ? (
        <img
          className="h-4 w-4 shrink-0 rounded-sm"
          src={faviconUrl}
          alt=""
          aria-hidden="true"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : null}
      <span className="min-w-0 truncate">{card.name}</span>
    </a>
  );
}

function getFaviconUrl(url) {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=32`;
  } catch {
    return "";
  }
}
