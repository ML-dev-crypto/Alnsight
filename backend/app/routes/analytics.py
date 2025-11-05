"""
Analytics routes
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from sqlalchemy import func, and_
from app.models import db, User, Analytics

analytics_bp = Blueprint('analytics', __name__, url_prefix='/api/analytics')


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


@analytics_bp.route('/log', methods=['POST'])
@jwt_required()
def log_analytics():
    """Log analytics event (privacy-safe metadata only)"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    if not data.get('feature'):
        return jsonify({'error': 'Feature required'}), 400
    
    # Create analytics entry
    analytics = Analytics(
        user_id=current_user_id,
        feature=data['feature'],
        device_type=data.get('device_type', 'mobile'),
        timestamp=datetime.utcnow()
    )
    
    # Set metadata (encrypted on client, only metadata here)
    if data.get('metadata'):
        analytics.set_metadata(data['metadata'])
    
    db.session.add(analytics)
    db.session.commit()
    
    return jsonify({
        'message': 'Analytics logged successfully',
        'id': analytics.id
    }), 201


@analytics_bp.route('/summary', methods=['GET'])
@admin_required
def get_summary():
    """Get analytics summary (admin only)"""
    # Date range
    days = request.args.get('days', 30, type=int)
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Total usage count
    total_usage = Analytics.query.filter(
        Analytics.timestamp >= start_date
    ).count()
    
    # Usage by feature
    feature_usage = db.session.query(
        Analytics.feature,
        func.count(Analytics.id).label('count')
    ).filter(
        Analytics.timestamp >= start_date
    ).group_by(Analytics.feature).all()
    
    # Active users
    active_users = db.session.query(
        func.count(func.distinct(Analytics.user_id))
    ).filter(
        Analytics.timestamp >= start_date
    ).scalar()
    
    # Usage by device type
    device_usage = db.session.query(
        Analytics.device_type,
        func.count(Analytics.id).label('count')
    ).filter(
        Analytics.timestamp >= start_date
    ).group_by(Analytics.device_type).all()
    
    # Daily usage trend
    daily_usage = db.session.query(
        func.date(Analytics.timestamp).label('date'),
        func.count(Analytics.id).label('count')
    ).filter(
        Analytics.timestamp >= start_date
    ).group_by(func.date(Analytics.timestamp)).order_by('date').all()
    
    return jsonify({
        'period_days': days,
        'total_usage': total_usage,
        'active_users': active_users,
        'feature_usage': [{'feature': f, 'count': c} for f, c in feature_usage],
        'device_usage': [{'device': d, 'count': c} for d, c in device_usage],
        'daily_usage': [{'date': str(d), 'count': c} for d, c in daily_usage]
    }), 200


@analytics_bp.route('/user/<int:user_id>', methods=['GET'])
@admin_required
def get_user_analytics(user_id):
    """Get analytics for specific user (admin only)"""
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Date range
    days = request.args.get('days', 30, type=int)
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Total usage by user
    total_usage = Analytics.query.filter(
        and_(
            Analytics.user_id == user_id,
            Analytics.timestamp >= start_date
        )
    ).count()
    
    # Usage by feature
    feature_usage = db.session.query(
        Analytics.feature,
        func.count(Analytics.id).label('count')
    ).filter(
        and_(
            Analytics.user_id == user_id,
            Analytics.timestamp >= start_date
        )
    ).group_by(Analytics.feature).all()
    
    # Recent activity
    recent_activity = Analytics.query.filter(
        Analytics.user_id == user_id
    ).order_by(Analytics.timestamp.desc()).limit(50).all()
    
    return jsonify({
        'user': user.to_dict(),
        'period_days': days,
        'total_usage': total_usage,
        'feature_usage': [{'feature': f, 'count': c} for f, c in feature_usage],
        'recent_activity': [a.to_dict() for a in recent_activity]
    }), 200


@analytics_bp.route('/export', methods=['GET'])
@admin_required
def export_analytics():
    """Export analytics data (admin only)"""
    # Date range
    days = request.args.get('days', 30, type=int)
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Get all analytics in range
    analytics = Analytics.query.filter(
        Analytics.timestamp >= start_date
    ).order_by(Analytics.timestamp.desc()).all()
    
    return jsonify({
        'period_days': days,
        'count': len(analytics),
        'data': [a.to_dict() for a in analytics]
    }), 200


@analytics_bp.route('/my-stats', methods=['GET'])
@jwt_required()
def get_my_stats():
    """Get current user's analytics"""
    current_user_id = get_jwt_identity()
    
    # Date range
    days = request.args.get('days', 30, type=int)
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Total usage
    total_usage = Analytics.query.filter(
        and_(
            Analytics.user_id == current_user_id,
            Analytics.timestamp >= start_date
        )
    ).count()
    
    # Usage by feature
    feature_usage = db.session.query(
        Analytics.feature,
        func.count(Analytics.id).label('count')
    ).filter(
        and_(
            Analytics.user_id == current_user_id,
            Analytics.timestamp >= start_date
        )
    ).group_by(Analytics.feature).all()
    
    # Daily usage
    daily_usage = db.session.query(
        func.date(Analytics.timestamp).label('date'),
        func.count(Analytics.id).label('count')
    ).filter(
        and_(
            Analytics.user_id == current_user_id,
            Analytics.timestamp >= start_date
        )
    ).group_by(func.date(Analytics.timestamp)).order_by('date').all()
    
    return jsonify({
        'period_days': days,
        'total_usage': total_usage,
        'feature_usage': [{'feature': f, 'count': c} for f, c in feature_usage],
        'daily_usage': [{'date': str(d), 'count': c} for d, c in daily_usage]
    }), 200
