#!/usr/bin/env python3
"""
Simple HTTP server with CORS support for WebLLM
"""
import http.server
import socketserver
from http.server import SimpleHTTPRequestHandler

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

PORT = 8000

with socketserver.TCPServer(("", PORT), CORSRequestHandler) as httpd:
    print(f"✅ Server running at http://localhost:{PORT}/")
    print(f"📁 Serving directory: {httpd.server_address}")
    print(f"🌐 CORS enabled for WebLLM")
    print(f"🔒 Cross-Origin headers set")
    print("\n📋 Access your app:")
    print(f"   Frontend: http://localhost:{PORT}/frontend/")
    print(f"   AI Chat:  http://localhost:{PORT}/frontend/ai-chat.html")
    print("\nPress Ctrl+C to stop the server")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped")
