from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.utils import timezone
from django.core.files import File
from django.core.files.images import ImageFile
import os
from datetime import timedelta
from django.core.files.base import ContentFile

class User(AbstractUser):
    id_api = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=100)
    username = models.CharField(max_length=100, unique=True)
    photo = models.ImageField(upload_to='user_photos/', blank=True, null=True)
    play_time = models.DurationField()
    state = models.CharField(max_length=50)
    amis = models.ManyToManyField('self', blank=True)
    game_session = models.DurationField(default=timedelta(minutes=0))
    semi_played = models.PositiveSmallIntegerField(default=0)
    semi_won = models.PositiveSmallIntegerField(default=0)
    final_played = models.PositiveSmallIntegerField(default=0)
    final_won = models.PositiveSmallIntegerField(default=0)
    points = models.IntegerField(default=0) # remplacer points en pong_points
    # Rajouter OXO elo points en oxo_points

    USERNAME_FIELD = 'id_api'
    password = models.CharField(max_length=128, null=True)  # Ajoutez cette ligne

    @classmethod
    def create_ia_user(cls):
        base_dir = '/transcendence/app/static/'
        file_path = os.path.join(base_dir, 'img', 'ia.png')

        # Check if the file exists before attempting to open it
        if os.path.exists(file_path):
            # Read the file content
            with open(file_path, 'rb') as f:
                file_content = f.read()

            # Create a ContentFile object with the file content
            image_file = ContentFile(file_content, name='ia.png')

            # Create the user with the provided default values
            user, created = cls.objects.get_or_create(
                id_api='IA',
                defaults={
                    'name': 'IA',
                    'username': 'IA',
                    'state': 'online',
                    'password': None,
                    'play_time': timezone.timedelta(seconds=0),
                }
            )

            # Set the photo field with the image file
            if created:
                user.photo.save('ia.png', image_file, save=True)
        else:
            # Handle the case where the file doesn't exist
            print("Image file 'ia.png' not found.")

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
    
    def formatted_game_session(self):
        total_seconds = self.game_session.total_seconds()
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
        try:
            existing_user = User.objects.get(pk=self.pk)
            if existing_user.photo and self.photo != existing_user.photo:
                existing_user.photo.delete(save=False)
        except User.DoesNotExist:
            pass

        super().save(*args, **kwargs)


class Tournament(models.Model):
    name = models.CharField(max_length=100)
    winner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    players = models.ManyToManyField(User, through='TournamentPlayer', related_name='tournaments')

    def __str__(self):
        return f"{self.pk} : {self.name}"

class TournamentPlayer(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    player = models.ForeignKey(User, on_delete=models.CASCADE)
    player_username = models.CharField(max_length=25, default="DefaultNickname")
    joined_at = models.DateTimeField(auto_now_add=True)


class Match(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name="matches", null=True)
    player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='matches_as_player1', default=1)
    player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='matches_as_player2', default=2)
    player1_score = models.IntegerField(null=True)
    player2_score = models.IntegerField(null=True)
    match_duration = models.DurationField(null=True)
    winner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='matches_won')
    time_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.pk} : {self.player1} VS {self.player2}"


class OxoMatch(models.Model):
    player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='oxo_matches_as_player1')
    player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='oxo_matches_as_player2')
    winner = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='oxo_matches_won')
    match_duration = models.DurationField(null=True)
    time_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.pk} : {self.player1} VS {self.player2 or 'IA'}"



class Notifications(models.Model):
    user_from = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_notifications')
    user_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_notifications')
    state = models.PositiveSmallIntegerField(choices=((0, 'waiting'), (1, 'accepted'), (2, 'declined'), (3, 'timeout')), default=0)
    type = models.PositiveSmallIntegerField(choices=((0, 'pong'), (1, 'oxo')), default=0)


class Friendship(models.Model):
    user = models.ForeignKey(User, related_name='user_friendships', on_delete=models.CASCADE)
    friend = models.ForeignKey(User, related_name='friend_friendships', on_delete=models.CASCADE)