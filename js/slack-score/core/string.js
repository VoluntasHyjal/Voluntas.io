export const capitalize = (string) => 
  string.charAt(0).toUpperCase() + string.slice(1)

export const slug = (string) =>
  string.toLowerCase().replaceAll(' ', '-').replaceAll('\'', '')
