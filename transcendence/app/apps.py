from django.apps import AppConfig
from django.db.models.signals import post_migrate

class AppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app'

    def ready(self):
        post_migrate.connect(self.create_ia_user, sender=self)

    @staticmethod
    def create_ia_user(sender, **kwargs):
        from .models import User
        User.create_ia_user()