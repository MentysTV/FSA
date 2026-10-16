import http.server
import socketserver
import urllib.request
import urllib.parse
import os
import sys

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class DualHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)


    def translate_path(self, path):
        path = path.split('?', 1)[0].split('#', 1)[0]
        rel = urllib.parse.unquote(path).lstrip('/')
        full = os.path.join(DIRECTORY, rel)
        return os.path.normpath(full)

    def do_GET(self):
        # Local proxy helper for direct IP:port if needed
        if self.path.startswith('/api/proxy?'):
            parsed = urllib.parse.urlparse(self.path)
            params = urllib.parse.parse_qs(parsed.query)
            target_url = params.get('url', [None])[0]
            if target_url:
                try:
                    req = urllib.request.Request(target_url, headers={'User-Agent': 'FSD-PRO-Inspector/1.0'})
                    with urllib.request.urlopen(req, timeout=6) as response:
                        content = response.read()
                        self.send_response(response.status)
                        self.send_header('Content-Type', response.headers.get('Content-Type', 'application/json'))
                        self.send_header('Access-Control-Allow-Origin', '*')
                        self.end_headers()
                        self.wfile.write(content)
                        return
                except Exception as e:
                    self.send_response(502)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(f'{{"error": "{str(e)}"}}'.encode('utf-8'))
                    return
        return super().do_GET()

    def end_headers(self):
        # Enable CORS for local testing
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

def run():
    os.chdir(DIRECTORY)
    # Allow port reuse
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), DualHandler) as httpd:
        print(f"========================================================")
        print(f"  FSD PRO Local Server bezi na: http://localhost:{PORT}")
        print(f"  Pripojeno k adresari: {DIRECTORY}")
        print(f"========================================================")
        sys.stdout.flush()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nZastavuji server...")
            httpd.shutdown()

if __name__ == '__main__':
    run()
