"""
Task management routes
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app.models import db, User, Task

tasks_bp = Blueprint('tasks', __name__, url_prefix='/api/tasks')


@tasks_bp.route('', methods=['GET'])
@jwt_required()
def list_tasks():
    """List user's tasks"""
    current_user_id = get_jwt_identity()
    
    # Query parameters
    status = request.args.get('status')
    priority = request.args.get('priority')
    source = request.args.get('source')
    
    # Build query
    query = Task.query.filter_by(user_id=current_user_id)
    
    if status:
        query = query.filter_by(status=status)
    
    if priority:
        query = query.filter_by(priority=priority)
    
    if source:
        query = query.filter_by(source=source)
    
    tasks = query.order_by(Task.created_at.desc()).all()
    
    return jsonify({
        'tasks': [task.to_dict() for task in tasks],
        'count': len(tasks)
    }), 200


@tasks_bp.route('/<int:task_id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    """Get specific task"""
    current_user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=current_user_id).first()
    
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    return jsonify({
        'task': task.to_dict()
    }), 200


@tasks_bp.route('', methods=['POST'])
@jwt_required()
def create_task():
    """Create new task"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    if not data.get('title'):
        return jsonify({'error': 'Title required'}), 400
    
    # Create task
    task = Task(
        user_id=current_user_id,
        title=data['title'],
        description=data.get('description', ''),
        status=data.get('status', 'pending'),
        priority=data.get('priority', 'medium'),
        source=data.get('source', 'manual'),
        voice_note_id=data.get('voice_note_id')
    )
    
    # Set due date if provided
    if data.get('due_date'):
        try:
            task.due_date = datetime.fromisoformat(data['due_date'].replace('Z', '+00:00'))
        except:
            pass
    
    db.session.add(task)
    db.session.commit()
    
    return jsonify({
        'message': 'Task created successfully',
        'task': task.to_dict()
    }), 201


@tasks_bp.route('/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    """Update task"""
    current_user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=current_user_id).first()
    
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    data = request.get_json()
    
    # Update fields
    if 'title' in data:
        task.title = data['title']
    
    if 'description' in data:
        task.description = data['description']
    
    if 'status' in data:
        task.status = data['status']
        # Set completed_at if status is completed
        if data['status'] == 'completed' and not task.completed_at:
            task.completed_at = datetime.utcnow()
    
    if 'priority' in data:
        task.priority = data['priority']
    
    if 'due_date' in data:
        try:
            task.due_date = datetime.fromisoformat(data['due_date'].replace('Z', '+00:00'))
        except:
            pass
    
    db.session.commit()
    
    return jsonify({
        'message': 'Task updated successfully',
        'task': task.to_dict()
    }), 200


@tasks_bp.route('/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    """Delete task"""
    current_user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=current_user_id).first()
    
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    db.session.delete(task)
    db.session.commit()
    
    return jsonify({'message': 'Task deleted successfully'}), 200


@tasks_bp.route('/sync', methods=['POST'])
@jwt_required()
def sync_tasks():
    """Sync tasks from mobile (batch create/update)"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data.get('tasks'):
        return jsonify({'error': 'Tasks array required'}), 400
    
    synced_tasks = []
    
    for task_data in data['tasks']:
        # Check if task exists (by voice_note_id or id)
        task = None
        
        if task_data.get('id'):
            task = Task.query.filter_by(id=task_data['id'], user_id=current_user_id).first()
        elif task_data.get('voice_note_id'):
            task = Task.query.filter_by(
                voice_note_id=task_data['voice_note_id'],
                user_id=current_user_id
            ).first()
        
        if task:
            # Update existing task
            if 'title' in task_data:
                task.title = task_data['title']
            if 'description' in task_data:
                task.description = task_data['description']
            if 'status' in task_data:
                task.status = task_data['status']
            if 'priority' in task_data:
                task.priority = task_data['priority']
        else:
            # Create new task
            task = Task(
                user_id=current_user_id,
                title=task_data.get('title', 'Untitled Task'),
                description=task_data.get('description', ''),
                status=task_data.get('status', 'pending'),
                priority=task_data.get('priority', 'medium'),
                source=task_data.get('source', 'voice_note'),
                voice_note_id=task_data.get('voice_note_id')
            )
            db.session.add(task)
        
        synced_tasks.append(task)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Tasks synced successfully',
        'tasks': [task.to_dict() for task in synced_tasks],
        'count': len(synced_tasks)
    }), 200
