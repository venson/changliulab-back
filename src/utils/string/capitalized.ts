export function capitalized(s?: string) {
  if (s) {
    const capitalizedFirst = s[0].toUpperCase();
    const rest = s.slice(1).toLowerCase();

    // console.log(capitalizedFirst, rest);
    return capitalizedFirst + rest;
  }
  return '';
}
