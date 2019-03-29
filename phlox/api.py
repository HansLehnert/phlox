"""REST API for managing the application."""

import flask
from flask import request

bp = flask.Blueprint('api', __name__, url_prefix='/api')


@bp.route('/status', methods=['POST'])
def create_status():
    db = flask.current_app.db
    post_data = request.json

    try:
        new_id = str(max(int(id) for id in db['status']['saved']) + 1)
    except ValueError:
        new_id = '1'

    db['status']['saved'][new_id] = post_data['description']

    response = {
        'status': 'ok',
        'id': new_id,
        'description': db['status']['saved'][new_id]
    }

    return flask.jsonify(response)


@bp.route('/status/selected', methods=['GET', 'POST'])
def selected_status():
    db = flask.current_app.db

    if request.method == 'POST':
        post_data = request.json
        selected_id = post_data['id']
        if selected_id in db['status']['saved'] or selected_id == 'custom':
            db['status']['selected'] = selected_id
        else:
            response = {
                'status': 'fail',
                'error': 'Status id does not exist'
            }

    selected_id = db['status']['selected']
    if selected_id == 'custom':
        description = db['status']['custom']
    else:
        description = db['status']['saved'][selected_id]

    response = {
        'status': 'ok',
        'id': selected_id,
        'description': description,
    }

    return flask.jsonify(response)


@bp.route('/status/custom', methods=['GET', 'POST'])
def custom_status():
    db = flask.current_app.db

    if request.method == 'POST':
        post_data = request.json
        db['status']['custom'] = post_data['description']

    response = {
        'status': 'ok',
        'id': 'custom',
        'description': db['status']['custom']
    }

    return flask.jsonify(response)


@bp.route('/status/<status_id>', methods=['GET', 'POST', 'DELETE'])
def status(status_id):
    db = flask.current_app.db

    if status_id in db['status']['saved']:
        if request.method == 'DELETE':
            del db['status']['saved'][status_id]
            response = {'status': 'ok'}
        else:
            if request.method == 'POST':
                post_data = request.json
                db['status']['saved'][status_id] = post_data['description']

            response = {
                'status': 'ok',
                'id': status_id,
                'description': db['status']['saved'][status_id]
            }
    else:
        print(db['status']['saved'])
        response = {
            'status': 'fail',
            'error': 'Status id does not exist'
        }

    return flask.jsonify(response)
