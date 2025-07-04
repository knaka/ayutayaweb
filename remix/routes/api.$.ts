import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/cloudflare'
import { app } from '#/api'

export function loader({ request, context }: LoaderFunctionArgs) {
  return app.fetch(request, context.cloudflare.env)
}

export function action({ request, context }: ActionFunctionArgs) {
  return app.fetch(request, context.cloudflare.env)
}
