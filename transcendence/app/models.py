from django.db import models

class User(models.Model):
    id_api = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=100)
    username = models.CharField(max_length=100, unique=True)
    photo = models.ImageField(upload_to='user_photos/', blank=True, null=True)
    play_time = models.DurationField()
    state = models.CharField(max_length=50)  # Par exemple: online, offline, in-game

    def __str__(self):
        return f"{self.name} - {self.username}"

class Tournament(models.Model):
    name = models.CharField(max_length=100)
    winner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

class Match(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name="matches")
    player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='matches_as_player1')
    player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='matches_as_player2')
    player1_score = models.IntegerField()
    player2_score = models.IntegerField()
    match_duration = models.DurationField()
    winner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='matches_won')

