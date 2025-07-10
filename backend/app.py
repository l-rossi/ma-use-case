from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def hello_world():
    return jsonify({"message": "Hello from Flask Backend!"})

if __name__ == '__main__':
    app.run(debug=True)