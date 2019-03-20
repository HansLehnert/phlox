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
