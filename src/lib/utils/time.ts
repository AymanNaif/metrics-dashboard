export type PresetRange = "30m" | "2h" | "24h" | "custom";

export function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

export function rangeFromPreset(preset: PresetRange): [number, number] {
  const end = nowSeconds();
  switch (preset) {
    case "30m":
      return [end - 30 * 60, end];
    case "2h":
      return [end - 2 * 60 * 60, end];
    case "24h":
      return [end - 24 * 60 * 60, end];
    default:
      return [end - 30 * 60, end];
  }
}

export function toDateTimeLocalInput(value: number): string {
  return new Date(value * 1000).toISOString().slice(0, 16);
}

export function fromDateTimeLocalInput(value: string): number {
  return Math.floor(new Date(value).getTime() / 1000);
}


