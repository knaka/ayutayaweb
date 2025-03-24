import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/cloudflare'
import { app } from '#/api'

export function loader({ request }: LoaderFunctionArgs) {
  return app.fetch(request)
}

export function action({ request }: ActionFunctionArgs) {
  return app.fetch(request)
}
