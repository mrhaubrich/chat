export function getCookie(name: string, documentCookie?: string) {
    const docCookie = documentCookie || document.cookie;
    const cookie = docCookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
    return cookie ? cookie.pop() : '';
}