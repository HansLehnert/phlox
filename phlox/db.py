import collections
import json


class JsonDict(collections.abc.MutableMapping, json.JSONEncoder):
    """A mapping that automatically saves its data into a json file."""
    def __init__(self, filename):
        self.filename = filename

        try:
            with open(self.filename) as backup:
                self.data = json.load(backup)
        except OSError:
            self.data = {}

    def __getitem__(self, key):
        return self.data[key]

    def __setitem__(self, key, value):
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
        with open(self.filename, 'w') as backup:
            json.dump(self.data, backup, indent=4)
