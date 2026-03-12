export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/decode") {
      const token = url.searchParams.get("token") || "";

      if (!token) {
        return new Response(
          JSON.stringify(
            { success: false, error: "Missing token" },
            null,
            2
          ),
          {
            status: 400,
            headers: { "content-type": "application/json; charset=UTF-8" }
          }
        );
      }

      try {
        const decoded = atob(token);
        const json = JSON.parse(decoded);

        return new Response(
          JSON.stringify(
            {
              success: true,
              authorizationFingerprint: json.authorizationFingerprint || null,
              merchantId: json.merchantId || null,
              environment: json.environment || null,
              decoded: json
            },
            null,
            2
          ),
          {
            headers: { "content-type": "application/json; charset=UTF-8" }
          }
        );
      } catch (e) {
        return new Response(
          JSON.stringify(
            { success: false, error: String(e.message || e) },
            null,
            2
          ),
          {
            status: 400,
            headers: { "content-type": "application/json; charset=UTF-8" }
          }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};
