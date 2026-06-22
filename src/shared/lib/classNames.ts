export type Mods = Record<string, boolean | string | undefined>;

export const classNames = (base: string, mods: Mods = {}, extra: Array<string | undefined> = []): string => {
  return [
    base,
    ...extra.filter(Boolean),
    ...Object.entries(mods)
      .filter(([, v]) => Boolean(v))
      .map(([k]) => k),
  ].join(' ');
}
