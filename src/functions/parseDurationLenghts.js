export function parseDurationLengths(input) {
  const units = {
    y: 31536000, // year
    mo: 2592000, // month (30 days)
    w: 604800,   // week
    d: 86400,    // day
    h: 3600,     // hour
    m: 60,       // minute
    s: 1         // second
  };

  const pattern = /(\d+)(y|mo|w|d|h|m|s)/g;

  let match;
  let totalSeconds = 0;

  while ((match = pattern.exec(input)) !== null) {
    const value = parseInt(match[1]);
    const unit = match[2];
    if (units[unit]) {
      totalSeconds += value * units[unit];
    }
  }

  if (!input) totalSeconds = 1

  return totalSeconds+'s';
}
