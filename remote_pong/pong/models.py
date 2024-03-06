from django.db import models

#this table will only exists when there are people in room
#once all the users are gone this will be deleted
class PongRoom(models.Model):
    room_name = models.CharField(max_length=30)

    def __str__(self) -> str:
        return self.room_name

class Players(models.Model):
    username =  models.CharField(max_length=30)
    room = models.ForeignKey(PongRoom, on_delete=models.CASCADE)