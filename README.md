# phlox

Web based signage

## Setup

Packages dependencies are managed with pipenv and python version 3.6 or greater
is needed. Before running the server install the dependencies with the command

```
$ pipenv install --three
```

The application is built using flask. To start the server use the command

```
pipenv run flask run
```

## Usage

The application provides a web configurable sign, to be displayed using a web
browser or HTML renderer. The sign is served on `<base_url>/panel` while the
configuration interface is accessed through `<base_url>/admin`.
