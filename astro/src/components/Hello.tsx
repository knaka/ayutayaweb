import { useState, useEffect } from "react";
import { hc } from 'hono/client';
import type { AppType } from '#remix/api.js';

const client = hc<AppType>("/");

export const Hello: React.FC<{}> = () => {
  const [name, setName] = useState<string>('Nobody');
  const [debouncedName, setDebouncedName] = useState(name);
  const [message, setMessage] = useState<string>('No message');
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedName(name);
    }, 500);
    return () => clearTimeout(timeout);
  }, [name]);
  useEffect(() => {(async () => {
    if (!debouncedName || debouncedName === '') {
      return;
    }
    const resp = await client.api.hello.$post({ json: { name: debouncedName } });
    if (!resp.ok) {
      setMessage(`Error: ${resp.status} ${resp.statusText}`);
      return;
    }
    const body = await resp.json();
    setMessage(body.message);
  })()}, [debouncedName]);
  return (
    <>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <p>message: {message}</p>
    </>
  )
}
