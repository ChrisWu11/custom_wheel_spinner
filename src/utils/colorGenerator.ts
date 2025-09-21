export const generateColors = (count: number): string[] => {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    const hue = (i * 360) / count;
    const saturation = Math.random() * 30 + 20; // 20-50%
    const lightness = Math.random() * 20 + 65; // 65-85%
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
};