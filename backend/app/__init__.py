"""
Main Flask application
"""
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import config
from app.models import db


def create_app(config_name='default'):
    """Application factory"""
    app = Flask(__name__)
    
    # Load config
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    CORS(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}})
    JWTManager(app)
    db.init_app(app)
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.users import users_bp
    from app.routes.analytics import analytics_bp
    from app.routes.tasks import tasks_bp
    from app.routes.announcements import announcements_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(analytics_bp)
    app.register_blueprint(tasks_bp)
    app.register_blueprint(announcements_bp)
    
    # Create database tables
    with app.app_context():
        db.create_all()
        
        # Create default admin user if not exists
        from app.models import User
        admin = User.query.filter_by(email='admin@ainsight.ai').first()
        if not admin:
            admin = User(
                email='admin@ainsight.ai',
                username='admin',
                full_name='System Administrator',
                role='admin',
                status='active'
            )
            admin.set_password('admin123')  # Change this in production!
            admin.set_permissions({
                'document_summary': True,
                'email_draft': True,
                'code_assist': True,
                'voice_notes': True,
                'chat': True
            })
            db.session.add(admin)
            db.session.commit()
            print("Default admin user created: admin@ainsight.ai / admin123")
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'AInSight API',
            'version': '1.0.0'
        }), 200
    
    # Root endpoint
    @app.route('/', methods=['GET'])
    def root():
        return jsonify({
            'message': 'Welcome to AInSight API',
            'version': '1.0.0',
            'endpoints': {
                'health': '/api/health',
                'auth': '/api/auth/*',
                'users': '/api/users/*',
                'analytics': '/api/analytics/*',
                'tasks': '/api/tasks/*',
                'announcements': '/api/announcements/*'
            }
        }), 200
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    return app
