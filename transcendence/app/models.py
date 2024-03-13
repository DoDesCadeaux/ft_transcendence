from django.db import models
from django.contrib.auth.models import AbstractUser


#kwargs = keywords arguments -> permet de passer des variable en plus des arguments dans une fonction

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
        return f"{self.name} - {self.username} -  {self.state}"
    

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
    
    def save(self, *args, **kwargs):
        # Vérifier s'il y a une photo existante
        try:
            #pk c'est la primary key, ici on essaye de recuperer l'user pour
            #maj sa photo en ecrasant l'ancienne, si on le recup pas on va dans
            #dans le execept et on fait rien
            existing_user = User.objects.get(pk=self.pk)
            if existing_user.photo and self.photo != existing_user.photo:
                # si il existe on supprime l'ancienne photo avant d'enregistrer la nouvelle
                existing_user.photo.delete(save=False)
        except User.DoesNotExist:
            pass

        #on utilise super pour maj, c'est la class parente par defaut de toutes nos classes
        super().save(*args, **kwargs)
        

class Tournament(models.Model):
    name = models.CharField(max_length=100)
    winner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    players = models.ManyToManyField(User, related_name='tournaments')

    def __str__(self):
        return f"{self.pk} : {self.name}"
    

class Match(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name="matches", null=True)
    player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='matches_as_player1', default=1)
    player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='matches_as_player2', default=2)
    player1_score = models.IntegerField(null=True)
    player2_score = models.IntegerField(null=True)
    match_duration = models.DurationField(null=True)
    winner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='matches_won')

    def __str__(self):
        return f"{self.pk} : {self.player1} VS {self.player2}"


