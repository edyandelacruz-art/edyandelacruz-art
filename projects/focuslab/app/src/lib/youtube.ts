export interface YouTubeVideoLink {
  videoId: string;
  canonicalUrl: string;
  embedUrl: string;
}

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

function normalizeCandidate(input: string) {
  const value = input.trim();
  if (!value) return '';
  if (/^(youtu\.be|www\.youtube\.com|youtube\.com|m\.youtube\.com|music\.youtube\.com|www\.youtube-nocookie\.com|youtube-nocookie\.com)\//i.test(value)) {
    return `https://${value}`;
  }
  return value;
}

export function parseYouTubeVideo(input: string): YouTubeVideoLink | null {
  const candidate = normalizeCandidate(input);
  if (!candidate) return null;

  try {
    const url = new URL(candidate);
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    let videoId = '';

    if (host === 'youtu.be') {
      videoId = url.pathname.split('/').filter(Boolean)[0] || '';
    } else if (
      host === 'youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'music.youtube.com' ||
      host === 'youtube-nocookie.com'
    ) {
      if (url.pathname === '/watch') {
        videoId = url.searchParams.get('v') || '';
      } else {
        const parts = url.pathname.split('/').filter(Boolean);
        if (['shorts', 'embed', 'live'].includes(parts[0])) videoId = parts[1] || '';
      }
    }

    if (!VIDEO_ID.test(videoId)) return null;

    return {
      videoId,
      canonicalUrl: `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`,
    };
  } catch {
    return null;
  }
}

export function buildYouTubeSearchUrl(query: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query.trim())}`;
}
