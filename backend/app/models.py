"""
Database models for AInSight
"""
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import json

db = SQLAlchemy()


class User(db.Model):
    """User model for employees and admins"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(120))
    
    # Role: 'admin', 'employee'
    role = db.Column(db.String(20), default='employee', nullable=False)
    
    # Status: 'active', 'inactive', 'suspended'
    status = db.Column(db.String(20), default='active', nullable=False)
    
    # Feature permissions (JSON stored as string)
    permissions = db.Column(db.Text, default='{}')
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    device_id = db.Column(db.String(255))  # For mobile device tracking
    
    # Relationships
    analytics = db.relationship('Analytics', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    tasks = db.relationship('Task', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    announcements_sent = db.relationship('Announcement', backref='sender', lazy='dynamic', foreign_keys='Announcement.sender_id')
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if password matches"""
        return check_password_hash(self.password_hash, password)
    
    def get_permissions(self):
        """Get permissions as dict"""
        try:
            return json.loads(self.permissions) if self.permissions else {}
        except:
            return {}
    
    def set_permissions(self, permissions_dict):
        """Set permissions from dict"""
        self.permissions = json.dumps(permissions_dict)
    
    def has_permission(self, feature):
        """Check if user has permission for a feature"""
        perms = self.get_permissions()
        return perms.get(feature, True)  # Default to True if not specified
    
    def to_dict(self, include_sensitive=False):
        """Convert to dictionary"""
        data = {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'full_name': self.full_name,
            'role': self.role,
            'status': self.status,
            'permissions': self.get_permissions(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
        }
        if include_sensitive:
            data['device_id'] = self.device_id
        return data


class Analytics(db.Model):
    """Analytics model for tracking usage (privacy-safe metadata only)"""
    __tablename__ = 'analytics'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Feature used: 'summarize', 'email_draft', 'code_assist', 'voice_note', 'chat'
    feature = db.Column(db.String(50), nullable=False, index=True)
    
    # Metadata (encrypted, no sensitive data)
    # e.g., {"model": "llama-3-8b", "duration_ms": 1234, "success": true}
    metadata = db.Column(db.Text)
    
    # Timestamp
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    # Device info (optional)
    device_type = db.Column(db.String(50))  # 'mobile', 'web'
    
    def get_metadata(self):
        """Get metadata as dict"""
        try:
            return json.loads(self.metadata) if self.metadata else {}
        except:
            return {}
    
    def set_metadata(self, metadata_dict):
        """Set metadata from dict"""
        self.metadata = json.dumps(metadata_dict)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'feature': self.feature,
            'metadata': self.get_metadata(),
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'device_type': self.device_type
        }


class Task(db.Model):
    """Task model for user tasks"""
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Task details
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    
    # Status: 'pending', 'in_progress', 'completed', 'cancelled'
    status = db.Column(db.String(20), default='pending', nullable=False, index=True)
    
    # Priority: 'low', 'medium', 'high', 'urgent'
    priority = db.Column(db.String(20), default='medium')
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    due_date = db.Column(db.DateTime)
    completed_at = db.Column(db.DateTime)
    
    # Source: 'manual', 'voice_note', 'ai_suggestion'
    source = db.Column(db.String(50), default='manual')
    
    # Voice note reference (if created from voice)
    voice_note_id = db.Column(db.String(255))
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'source': self.source,
            'voice_note_id': self.voice_note_id
        }


class Announcement(db.Model):
    """Announcement model for company-wide messages"""
    __tablename__ = 'announcements'
    
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Announcement content
    title = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    
    # Priority: 'info', 'warning', 'urgent'
    priority = db.Column(db.String(20), default='info')
    
    # Target: 'all', 'role:admin', 'role:employee', 'user:123'
    target = db.Column(db.String(100), default='all')
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    expires_at = db.Column(db.DateTime)
    
    # Status: 'active', 'expired', 'deleted'
    status = db.Column(db.String(20), default='active')
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'sender_id': self.sender_id,
            'sender_name': self.sender.full_name if self.sender else None,
            'title': self.title,
            'message': self.message,
            'priority': self.priority,
            'target': self.target,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None,
            'status': self.status
        }


class ChatMessage(db.Model):
    """Chat message model (encrypted, for P2P chat metadata only)"""
    __tablename__ = 'chat_messages'
    
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Channel/Room ID for group chats
    channel_id = db.Column(db.String(255), nullable=False, index=True)
    
    # Encrypted message (actual content encrypted on client)
    encrypted_content = db.Column(db.Text, nullable=False)
    
    # Encryption metadata
    encryption_method = db.Column(db.String(50), default='AES-256-GCM')
    
    # Timestamp
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    # Status: 'sent', 'delivered', 'read'
    status = db.Column(db.String(20), default='sent')
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'sender_id': self.sender_id,
            'channel_id': self.channel_id,
            'encrypted_content': self.encrypted_content,
            'encryption_method': self.encryption_method,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'status': self.status
        }
