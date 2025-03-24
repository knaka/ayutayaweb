import { useState, useEffect } from "react";

import { hc } from 'hono/client';
import type { AppType } from '#ssr/api.js';

const client = hc<AppType>("/");

export default () => {
  const [name, setName] = useState<string>('Nobody');
  const [message, setMessage] = useState<string>('No message');
  useEffect(() => {(async () => {
    const resp = await client.api.hello.$post({json: { name }});
    if (!resp.ok) {
      setMessage(`Error: ${resp.status} ${resp.statusText}`);
      return;
    }
    const body = await resp.json();
    setMessage(body.message);
  })()}, [name]);
  return (
    <>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <p>message: {message}</p>
    </>
  )
}
