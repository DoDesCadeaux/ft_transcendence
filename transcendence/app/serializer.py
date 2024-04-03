from rest_framework import serializers
from .models import User, Match, Friendship

class UserManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'photo']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'photo']

class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'state', 'photo']


class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = '__all__'
    class NewMatch:
        fields = ['player1_id', 'player2_id', 'tournament_id']