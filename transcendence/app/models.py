from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    id_api = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=100)
    username = models.CharField(max_length=100, unique=True)
    photo = models.ImageField(upload_to='user_photos/', blank=True, null=True)
    play_time = models.DurationField()
    state = models.CharField(max_length=50)  # Par exemple: online, offline, in-game

    USERNAME_FIELD = 'id_api'
    password = models.CharField(max_length=128, null=True)  # Ajoutez cette ligne

    def __str__(self):
        return f"{self.name} - {self.username}"

    def formatted_play_time(self):
        total_seconds = self.play_time.total_seconds()
        hours, remainder = divmod(total_seconds, 3600)
        minutes, seconds = divmod(remainder, 60)

        if hours > 0:
            return f"{int(hours)}h {int(minutes)}min"
        elif minutes > 0:
            return f"{int(minutes)}min"
        elif seconds > 0:
            return f"{int(seconds)}sec"
        else:
            return "0min"
        

class Tournament(models.Model):
    name = models.CharField(max_length=100)
    winner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.name}"
    

class Match(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name="matches")
    player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='matches_as_player1')
    player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='matches_as_player2')
    player1_score = models.IntegerField()
    player2_score = models.IntegerField()
    match_duration = models.DurationField()
    winner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='matches_won')

    def __str__(self):
        return f"{self.player1} VS {self.player2}"

