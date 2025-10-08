from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

DATABASE_URL = os.environ.get('DATABASE_URL')

def get_db_connection():
    conn = psycopg2.connect(DATABASE_URL)
    return conn

def init_db():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('''
        CREATE TABLE IF NOT EXISTS likes (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            user_name VARCHAR(100),
            algorithm_id INTEGER NOT NULL,
            video_url TEXT NOT NULL,
            liked BOOLEAN NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, algorithm_id, video_url)
        )
    ''')
    conn.commit()
    cur.close()
    conn.close()

@app.route('/api/save-like', methods=['POST', 'OPTIONS'])
def save_like():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response
    
    data = request.json
    user_id = data.get('userId')
    user_name = data.get('userName')
    algorithm_id = data.get('algorithmId')
    interactions = data.get('interactions', {})
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute('DELETE FROM likes WHERE user_id = %s AND algorithm_id = %s', 
                (user_id, algorithm_id))
    
    for video_url, liked in interactions.items():
        cur.execute('''
            INSERT INTO likes (user_id, user_name, algorithm_id, video_url, liked, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (user_id, algorithm_id, video_url) 
            DO UPDATE SET liked = EXCLUDED.liked, updated_at = EXCLUDED.updated_at
        ''', (user_id, user_name, algorithm_id, video_url, liked, datetime.now()))
    
    conn.commit()
    cur.close()
    conn.close()
    
    print(f'✓ Likes guardados para usuario {user_id}, algoritmo {algorithm_id}')
    return jsonify({'success': True})

@app.route('/api/get-likes/<int:user_id>/<int:algorithm_id>', methods=['GET', 'OPTIONS'])
def get_likes(user_id, algorithm_id):
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
        return response
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute('''
        SELECT video_url, liked FROM likes 
        WHERE user_id = %s AND algorithm_id = %s
    ''', (user_id, algorithm_id))
    
    results = cur.fetchall()
    cur.close()
    conn.close()
    
    interactions = {video_url: liked for video_url, liked in results}
    
    return jsonify({
        'userId': user_id,
        'algorithmId': algorithm_id,
        'interactions': interactions
    })

@app.route('/api/admin/all-likes', methods=['GET'])
def get_all_likes():
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute('''
        SELECT user_id, user_name, algorithm_id, video_url, liked, updated_at 
        FROM likes 
        ORDER BY updated_at DESC
    ''')
    
    results = cur.fetchall()
    cur.close()
    conn.close()
    
    likes = []
    for row in results:
        likes.append({
            'userId': row[0],
            'userName': row[1],
            'algorithmId': row[2],
            'videoUrl': row[3],
            'liked': row[4],
            'updatedAt': row[5].isoformat() if row[5] else None
        })
    
    return jsonify({'likes': likes, 'total': len(likes)})

if __name__ == '__main__':
    init_db()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)