from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

LIKES_DIR = os.path.join(os.getcwd(), 'likes_data')
os.makedirs(LIKES_DIR, exist_ok=True)

@app.route('/api/save-like', methods=['POST'])
def save_like():
    data = request.json
    user_id = data.get('userId', 'unknown')
    algo_id = data.get('algorithmId', 'unknown')
    
    filename = f'likes_{user_id}_algo_{algo_id}.json'
    filepath = os.path.join(LIKES_DIR, filename)
    
    likes_data = {
        'userId': user_id,
        'userName': data.get('userName', 'Unknown'),
        'algorithmId': algo_id,
        'lastUpdated': datetime.now().isoformat(),
        'interactions': data.get('interactions', {})
    }
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(likes_data, f, indent=2, ensure_ascii=False)
    
    print(f'✓ Like guardado: {filename}')
    return jsonify({'success': True, 'file': filename})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)