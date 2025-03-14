export function ensureEndpointPathCorrect(endpointPath: string, filePath: string) {
  const endpointBase = endpointPath.replace(/.*\/([^\/]*)$/, '$1');
  if (filePath.endsWith(`/${endpointBase}.astro`) || filePath.match(new RegExp(`/${endpointBase}.astro.mjs(\\?.*)?$`))) {
    if (filePath.replace(/\.astro(.mjs(\?.*)?)?$/, '').replace(new RegExp(`${endpointPath}$`), '').endsWith('/pages')) {
      return
    }
  } else {
    if (filePath.replace(/\/[^\/]*\.astro(.mjs(\?.*)?)?$/, '').replace(new RegExp(`${endpointPath}$`), '').endsWith('/pages')) {
      return
    }
  }
  throw new Error(`path mismatch: ${filePath} ${endpointPath}`);
}
