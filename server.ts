const homeFile = Bun.file("./public/home.html")
const signupFile = Bun.file("./public/signup.html")

function IsLoggedIn(req: Bun.BunRequest): boolean {
    // Get cookie
    const cookie = req.headers.get("cookie")
    if (!cookie) { return false }

    // Get session
    const session = cookie?.includes("session=") ?? false
    if (!session) { return false }

    // Session found // TODO: additional server checks
    return true
}

const server = Bun.serve({
    port: 3000,
    routes: {
        "/": (req: Bun.BunRequest) => {
            const isLoggedIn = IsLoggedIn(req);

            if (isLoggedIn) { return new Response(homeFile) }
            return new Response(signupFile)
        },
    },

    async fetch(req: any, server) {
        const url = new URL(req.url);

        // Helper for MIME types
        function getContentType(path: string) {
            if (path.endsWith(".css")) return "text/css";
            if (path.endsWith(".js")) return "application/javascript";
            if (path.endsWith(".jpg")) return "image/jpg";
            return "application/unknown";
        }

        // Serve static files from /public
        if (url.pathname.startsWith("/styles") ||
            url.pathname.startsWith("/scripts")) {

            const file = Bun.file(`./public${url.pathname}`);
            return new Response(file, {
                headers: {
                    "Content-Type": getContentType(url.pathname),
                },
            });
        }

        return new Response("Not Found", { status: 404 });
    },
});

console.log(`Listening on ${server.url}`);

