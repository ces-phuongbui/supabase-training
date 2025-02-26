import tinycolor from "tinycolor2"

export function lighten(color: string, amount: number): string {
  return tinycolor(color).lighten(amount * 100).toString()
} 