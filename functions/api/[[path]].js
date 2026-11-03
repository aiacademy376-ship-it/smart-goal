export async function onRequest(context) {
  const apiOrigin = context.env.API_ORIGIN;
  if (!apiOrigin) {
    return new Response(JSON.stringify({
      success: false,
      message: "API_ORIGIN sozlanmagan."
    }), {
      status: 503,
      headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
    });
  }

  const incoming = new URL(context.request.url);
  const target = new URL(incoming.pathname + incoming.search, apiOrigin);
  const request = new Request(target.toString(), context.request);
  return fetch(request);
}
