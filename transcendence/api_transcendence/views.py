# api/views.py
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from django.db import models
from app.models import User, Match
from app.serializer import *

class UserListAPIView(generics.ListAPIView):
    serializer_class = UserListSerializer

    def list(self, request, *args, **kwargs):
        current_user = self.request.user
        queryset = User.objects.exclude(id=current_user.id)
        serializer = self.get_serializer(queryset, many=True)

        # Logique personnalisée pour la liste des utilisateurs
        data = {
            'users': serializer.data
        }

        return Response(data)


class UserUpdateAPIView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserManagementSerializer

    def update(self, request, *args, **kwargs):
        id_api = self.kwargs.get('id_api')
        try:
            user = User.objects.get(id_api=id_api)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        # Mise à jour de l'username
        new_username = request.data.get('username')
        if new_username:
            user.username = new_username

        # Mise à jour de la photo
        new_photo = request.data.get('photo')
        if new_photo:
            user.photo = new_photo

        user.save()
      
        serializer = UserManagementSerializer(user)
        return Response(serializer.data)

    
class ResultsAPIView(generics.GenericAPIView):
    serializer_class = MatchSerializer

    def get(self, request, *args, **kwargs):
        game = kwargs.get('game')
        current_player = self.request.user

        if game == 'matchs':
            queryset = Match.objects.filter(models.Q(player1=current_player.id) | models.Q(player2=current_player.id))

            # Calculer le nombre de matchs gagnés par le joueur actuel
            matches_won = Match.objects.filter(winner=current_player.id).count()

            # Ajouter le nombre de matchs gagnés à la réponse
            response = {'total': queryset.count(), 'won': matches_won}
            return Response(response)
        elif game == 'tournaments':
            # Logique pour la deuxième opération GET
            print("coucou")
            # matches_data = # ... récupérez les données de la deuxième opération GET
        else:
            # Gérer d'autres cas ou renvoyer une réponse d'erreur
            return Response({'error': 'Opération non prise en charge'})

