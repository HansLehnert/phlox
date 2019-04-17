"""Self-backuping containers.

List and dictionaries that automatically backup their contents to an external
file upon modification of any of their values or child values.
"""


import collections
import json
import copy
import os


_BASE_SETTINGS = {
    'status': {
        'custom': '',
        'selected': '1',
        'saved': {
            '1': 'Disponible',
            '2': 'No interrumpir',
            '3': 'En laboratorio',
            '4': 'En reunion',
        }
    },
    'show_ip': True,
}


class AutosaveDict(collections.abc.MutableMapping):
    """A mapping that automatically saves its data into a json file.

    By default the data is loaded from the backup pointed by the filename and
    the provided data is used as a fallback if no filename is provided or the
    file doesn't exist yet.
    """

    def __init__(self, data=None, filename=None, parent=None):
        self.filename = filename
        self.parent = parent

        self.data = {}

        if filename is not None and os.path.exists(filename):
            with open(filename) as backup:
                data = json.load(backup)

        if data is not None:
            for key in data:
                self.__setitem__(key, data[key])

    def __getitem__(self, key):
        return self.data[key]

    def __setitem__(self, key, value):
        if isinstance(value, dict):
            self.data[key] = AutosaveDict(data=value, parent=self)
        elif isinstance(value, list):
            self.data[key] = AutosaveList(data=value, parent=self)
        else:
            self.data[key] = value

        self._write_backup()

    def __delitem__(self, key):
        del self.data[key]
        self._write_backup()

    def __len__(self):
        return len(self.data)

    def __iter__(self):
        return self.data.__iter__()

    def _write_backup(self):
        if self.parent is not None:
            return self.parent._write_backup()

        with open(self.filename, 'w') as backup:
            json.dump(self._get_contents(), backup, indent=4)

    def _get_contents(self):
        data = copy.copy(self.data)

        for key in data:
            if (isinstance(data[key], AutosaveDict)
                    or isinstance(data[key], AutosaveList)):
                data[key] = data[key]._get_contents()

        return data


class AutosaveList(collections.abc.MutableSequence):
    """A list that automatically saves it's contents to a json file."""

    def __init__(self, data=None, filename=None, parent=None):
        self.filename = filename
        self.parent = parent

        self.data = []

        if filename is not None and os.path.exists(filename):
            with open(filename) as backup:
                data = json.load(backup)

        elif data is not None:
            for value in data:
                self.insert(len(self.data), value)

    def __getitem__(self, index):
        return self.data[index]

    def __setitem__(self, index, value):
        if isinstance(value, dict):
            self.data[index] = AutosaveDict(data=value, parent=self)
        elif isinstance(value, list):
            self.data[index] = AutosaveList(data=value, parent=self)
        else:
            self.data[index] = value

        self._write_backup()

    def __delitem__(self, index):
        del self.data[index]
        self._write_backup()

    def insert(self, index, value):
        self.data.insert(index, None)
        self.__setitem__(index, value)

    def __len__(self):
        return len(self.data)

    def __iter__(self):
        return self.data.__iter__()

    def _write_backup(self):
        if self.parent is not None:
            return self.parent._write_backup()

        with open(self.filename, 'w') as backup:
            json.dump(self._get_contents(), backup, indent=4)

    def _get_contents(self):
        data = copy.copy(self.data)

        for i in range(len(data)):
            if (isinstance(data[i], AutosaveDict)
                    or isinstance(data[i], AutosaveList)):
                data[i] = data[i]._get_contents()

        return data
