export default async function handler(req, res) {
    const targetUrl = req.query.url;

    if (!targetUrl || !targetUrl.includes('live.banyuwangikab.go.id')) {
        return res.status(403).send('Forbidden');
    }

    try {
        const response = await fetch(decodeURIComponent(targetUrl), {
            headers: {
                'Referer': 'https://live.banyuwangikab.go.id/',
                'Origin': 'https://live.banyuwangikab.go.id',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            }
        });

        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        let body = await response.text();

        // Rewrite URL .m3u8
        if (targetUrl.includes('.m3u8')) {
            const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/'));
            const proxyBase = 'https://YOUR-PROJECT.vercel.app/api/proxy?url=';

            body = body.split('\n').map(line => {
                line = line.trim();
                if (!line || line.startsWith('#')) return line;
                const abs = line.startsWith('http') ? line : baseUrl + '/' + line;
                return proxyBase + encodeURIComponent(abs);
            }).join('\n');
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', targetUrl.includes('.m3u8') ? 'no-cache' : 'max-age=30');
        res.status(200).send(body);

    } catch (err) {
        res.status(502).send('Error: ' + err.message);
    }
}
```

---

**Opsi 2 — Iframe (Paling Mudah, Tanpa Proxy)**

Cek dulu apakah mereka punya halaman viewer per kamera. Buka di browser:
```
https://live.banyuwangikab.go.id/
