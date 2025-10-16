import psycopg2
import os

DATABASE_URL = "postgresql://talentpitch:hJjs1ET7rXZCsyzNtx67XmWL787HHcNk@dpg-d3iue0jipnbc73eetf90-a.oregon-postgres.render.com/talentpitch_i4cg"

def clean_likes_table():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        print("Conectado a la base de datos")

        cur.execute("DELETE FROM likes;")
        conn.commit()
        print("Tabla 'likes' limpiada correctamente 🧹")

        cur.execute("ALTER SEQUENCE likes_id_seq RESTART WITH 1;")
        conn.commit()
        print("Secuencia reiniciada")

        cur.close()
        conn.close()
        print("Conexión cerrada")

    except Exception as e:
        print("Error al limpiar la base de datos:", e)

if __name__ == "__main__":
    clean_likes_table()
