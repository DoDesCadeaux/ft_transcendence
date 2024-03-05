from rest_framework import serializers
from .models import User

class UserManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'photo']