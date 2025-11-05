"""
Announcement routes
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app.models import db, User, Announcement

announcements_bp = Blueprint('announcements', __name__, url_prefix='/api/announcements')


def admin_required(fn):
    """Decorator to require admin role"""
    from functools import wraps
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        return fn(*args, **kwargs)
    return wrapper


@announcements_bp.route('', methods=['GET'])
@jwt_required()
def list_announcements():
    """List active announcements for current user"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    # Get active, non-expired announcements
    now = datetime.utcnow()
    query = Announcement.query.filter(
        Announcement.status == 'active'
    ).filter(
        db.or_(
            Announcement.expires_at == None,
            Announcement.expires_at > now
        )
    )
    
    # Filter by target
    announcements = []
    for announcement in query.order_by(Announcement.created_at.desc()).all():
        target = announcement.target
        
        # Check if announcement is for this user
        if target == 'all':
            announcements.append(announcement)
        elif target.startswith('role:') and target.split(':')[1] == user.role:
            announcements.append(announcement)
        elif target.startswith('user:') and int(target.split(':')[1]) == current_user_id:
            announcements.append(announcement)
    
    return jsonify({
        'announcements': [a.to_dict() for a in announcements],
        'count': len(announcements)
    }), 200


@announcements_bp.route('/all', methods=['GET'])
@admin_required
def list_all_announcements():
    """List all announcements (admin only)"""
    status = request.args.get('status')
    
    query = Announcement.query
    
    if status:
        query = query.filter_by(status=status)
    
    announcements = query.order_by(Announcement.created_at.desc()).all()
    
    return jsonify({
        'announcements': [a.to_dict() for a in announcements],
        'count': len(announcements)
    }), 200


@announcements_bp.route('', methods=['POST'])
@admin_required
def create_announcement():
    """Create new announcement (admin only)"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    if not data.get('title') or not data.get('message'):
        return jsonify({'error': 'Title and message required'}), 400
    
    # Create announcement
    announcement = Announcement(
        sender_id=current_user_id,
        title=data['title'],
        message=data['message'],
        priority=data.get('priority', 'info'),
        target=data.get('target', 'all'),
        status='active'
    )
    
    # Set expiration if provided
    if data.get('expires_at'):
        try:
            announcement.expires_at = datetime.fromisoformat(
                data['expires_at'].replace('Z', '+00:00')
            )
        except:
            pass
    
    db.session.add(announcement)
    db.session.commit()
    
    return jsonify({
        'message': 'Announcement created successfully',
        'announcement': announcement.to_dict()
    }), 201


@announcements_bp.route('/<int:announcement_id>', methods=['PUT'])
@admin_required
def update_announcement(announcement_id):
    """Update announcement (admin only)"""
    announcement = Announcement.query.get(announcement_id)
    
    if not announcement:
        return jsonify({'error': 'Announcement not found'}), 404
    
    data = request.get_json()
    
    # Update fields
    if 'title' in data:
        announcement.title = data['title']
    
    if 'message' in data:
        announcement.message = data['message']
    
    if 'priority' in data:
        announcement.priority = data['priority']
    
    if 'target' in data:
        announcement.target = data['target']
    
    if 'status' in data:
        announcement.status = data['status']
    
    if 'expires_at' in data:
        try:
            announcement.expires_at = datetime.fromisoformat(
                data['expires_at'].replace('Z', '+00:00')
            )
        except:
            pass
    
    db.session.commit()
    
    return jsonify({
        'message': 'Announcement updated successfully',
        'announcement': announcement.to_dict()
    }), 200


@announcements_bp.route('/<int:announcement_id>', methods=['DELETE'])
@admin_required
def delete_announcement(announcement_id):
    """Delete announcement (admin only)"""
    announcement = Announcement.query.get(announcement_id)
    
    if not announcement:
        return jsonify({'error': 'Announcement not found'}), 404
    
    # Soft delete (change status)
    announcement.status = 'deleted'
    db.session.commit()
    
    return jsonify({'message': 'Announcement deleted successfully'}), 200
