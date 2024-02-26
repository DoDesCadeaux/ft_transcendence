# Dans votre fichier API/user.py
from ..models import User
from datetime import timedelta


def get_user_by_id42(id_42):
    try:
        element = User.objects.get(id_api=id_42)
        return element
    except User.DoesNotExist:
        return None

def create_new_user(name, id42):
    delta = timedelta(minutes=0)
    user = User(id_api=id42, name=name, username=name, play_time=delta, state="online")
    user.save()

def update_status(id42, status):
    user = get_user_by_id42(id42)
    user.state = status
    user.save()
