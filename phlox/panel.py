import flask

bp = flask.Blueprint('panel', __name__, url_prefix='/panel')


@bp.route('/')
def show_panel():
    status = flask.current_app.db['status']

    if status['selected'] == 'custom':
        status = status['custom']
    else:
        status = status['saved'][status['selected']]

    return flask.render_template('panel.j2', status=status)
