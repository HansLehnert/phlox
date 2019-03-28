import flask
import os

from sassutils.wsgi import SassMiddleware

from phlox.panel import bp as panel
from phlox.admin import bp as admin
from phlox.api import bp as api


def create_app():
    app = flask.Flask(__name__)
    app.config.from_object('phlox.config.Config')

    # Sass support
    app.wsgi_app = SassMiddleware(
        app.wsgi_app,
        {'phlox': ('static/scss', 'static/css', 'static/css')}
    )

    # Create instance dir
    os.makedirs(app.instance_path, exist_ok=True)

    # Create database
    import phlox.db
    app.db = phlox.db.JsonDict(os.path.join(
        app.instance_path, app.config['DATABASE_FILE']))

    # Blueprints
    app.register_blueprint(panel)
    app.register_blueprint(admin)
    app.register_blueprint(api)

    @app.route('/')
    def index():
        return flask.redirect(flask.url_for('admin.status_selection'))

    return app
