from flask import Flask, send_from_directory
from flask_cors import CORS
from routes.carousel import carousel_bp
from routes.navbar import navbar_bp
from routes.services import services_bp
from routes.timeline import timeline_bp
from routes.pageloader import loader_bp
from routes.about import about_bp
from routes.project import project_bp
from routes.websiteProject import websiteproject_bp
from routes.map import map_bp
from routes.footer import footer_bp
from routes.notifications import notifications_bp
import os

app = Flask(__name__)
CORS(app)

app.register_blueprint(carousel_bp)
app.register_blueprint(navbar_bp)
app.register_blueprint(services_bp)
app.register_blueprint(timeline_bp)
app.register_blueprint(loader_bp)
app.register_blueprint(about_bp)
app.register_blueprint(project_bp)
app.register_blueprint(websiteproject_bp)
app.register_blueprint(map_bp)
app.register_blueprint(footer_bp)
app.register_blueprint(notifications_bp)

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(os.path.join(app.root_path, 'static'), filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
