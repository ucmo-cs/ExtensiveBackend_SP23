from python.working_files.decorators import database_connect
import json

class Logging:
    @database_connect
    def log_response(self, db, path, body, status):
        try:
            sql = "INSERT INTO log(path, body, status) VALUES('%s', '%s', %s)" % (path, json.dumps(body), int(status[:3]))
            db.execute(sql)
        except Exception as e:
            raise e
