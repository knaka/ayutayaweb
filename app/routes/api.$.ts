import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/cloudflare'
import { app as honoApp } from '../api'

export function loader(args: LoaderFunctionArgs) {
  return honoApp.fetch(args.request)
}

export function action(args: ActionFunctionArgs) {
  return honoApp.fetch(args.request)
}
