# Generated by Django 4.2.9 on 2024-04-10 14:24

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_alter_oxomatch_winner'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='game_session',
            field=models.DurationField(default=datetime.timedelta(0)),
        ),
    ]
