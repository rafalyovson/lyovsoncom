const urlRegExp =
  /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}|localhost)(:[0-9]{1,5})?(\/.*)?$/;

export function validateUrl(url: string): boolean {
  return urlRegExp.test(url);
}
