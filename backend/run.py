"""
Run the Flask application
"""
import os
from app import create_app

# Get config from environment
config_name = os.getenv('FLASK_ENV', 'development')

# Create app
app = create_app(config_name)

if __name__ == '__main__':
    host = app.config['HOST']
    port = app.config['PORT']
    debug = app.config['DEBUG']
    
    print(f"Starting AInSight API Server...")
    print(f"Environment: {config_name}")
    print(f"Server: http://{host}:{port}")
    print(f"Debug: {debug}")
    
    app.run(host=host, port=port, debug=debug)
