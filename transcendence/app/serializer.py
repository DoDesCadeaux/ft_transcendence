from rest_framework import serializers
from .models import User, Match

class UserManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'photo']

class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'state', 'photo']

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = '__all__'