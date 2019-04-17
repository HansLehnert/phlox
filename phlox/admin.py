import flask

bp = flask.Blueprint('admin', __name__, url_prefix='/admin')


@bp.route('/')
def status_selection():
    db = flask.current_app.db

    status = db['status']['saved']
    status = list(status.items())
    status.append(('custom', db['status']['custom']))
    selected = db['status']['selected']

    return flask.render_template(
        'status_list.j2',
        descriptions=status,
        selected=selected,
    )


@bp.route('/config')
def config():
    return flask.render_template('config.j2')

@bp.route('/about')
def about():
    return flask.render_template('about.j2')
