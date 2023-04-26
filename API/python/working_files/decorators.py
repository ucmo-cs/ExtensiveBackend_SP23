import os
from dotenv import load_dotenv
import pymysql

load_dotenv()


def database_connect(func):
    """
        This decorator makes it so a connection is opened in the wrapped function
        As long as you put the first variable in the function as db
        You can make sql calls without needing to do redundant statements
    """
    def connect(ref, *args, **kwargs):
        conn = pymysql.connect(host='69.247.163.204',
                               user=os.getenv("DB_USER"),
                               password=os.getenv("DB_PASS"),
                               database='new',
                               cursorclass=pymysql.cursors.DictCursor)
        try:
            with conn.cursor() as db:
                func_ret = func(ref, db, *args, **kwargs)
        except Exception as error:
            raise error
        else:
            conn.commit()
        finally:
            conn.close()
        return func_ret

    return connect
