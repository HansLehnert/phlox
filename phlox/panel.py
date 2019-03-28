import flask

bp = flask.Blueprint('panel', __name__, url_prefix='/panel')


@bp.route('/')
def show_panel():
    db = flask.current_app.db

    if db['status']['selected'] == 'custom':
        status = db['status']['custom']
    else:
        status = db['status']['saved'][db['status']['selected']]

    if db['show_ip']:
        address = flask.request.host
    else:
        address = ''

    return flask.render_template(
        'panel.j2',
        status=status,
        address=address,
    )
