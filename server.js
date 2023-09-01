class Bugs:
    url: str

    def __init__(self, url: str) -> None:
        self.url = url


class Dependencies:
    express: str
    uuid: str
    worker_thread: str

    def __init__(self, express: str, uuid: str, worker_thread: str) -> None:
        self.express = express
        self.uuid = uuid
        self.worker_thread = worker_thread


class Repository:
    type: str
    url: str

    def __init__(self, type: str, url: str) -> None:
        self.type = type
        self.url = url


class Scripts:
    start: str

    def __init__(self, start: str) -> None:
        self.start = start


class Welcome4:
    name: str
    version: str
    description: str
    main: str
    scripts: Scripts
    repository: Repository
    author: str
    license: str
    bugs: Bugs
    homepage: str
    dependencies: Dependencies

    def __init__(self, name: str, version: str, description: str, main: str, scripts: Scripts, repository: Repository, author: str, license: str, bugs: Bugs, homepage: str, dependencies: Dependencies) -> None:
        self.name = name
        self.version = version
        self.description = description
        self.main = main
        self.scripts = scripts
        self.repository = repository
        self.author = author
        self.license = license
        self.bugs = bugs
        self.homepage = homepage
        self.dependencies = dependencies
