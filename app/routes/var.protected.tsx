import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async (args) => {
  console.log('Authentication logic here');
  return null;
};
