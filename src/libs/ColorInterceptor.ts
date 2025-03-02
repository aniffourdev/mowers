import { ColorPalette } from "@/libs/fetchColors";

class ColorInterceptor {
  private colors: ColorPalette;

  constructor(colors: ColorPalette) {
    this.colors = colors;
  }

  public getColorClass(colorType: keyof ColorPalette): string {
    return this.colors[colorType];
  }
}

export default ColorInterceptor;
