# api/views.py
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from django.db import models
from app.models import User, Match, Tournament
from app.serializer import *
from django.shortcuts import get_object_or_404

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
    # serializer_class = UserManagementSerializer

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
            matches_played = Match.objects.filter(models.Q(player1=current_player.id) | models.Q(player2=current_player.id))

            # Calculer le nombre de matchs gagnés par le joueur actuel
            matches_won = Match.objects.filter(winner=current_player.id)

            # Ajouter le nombre de matchs gagnés à la réponse
            response = {'total': matches_played.count(), 'won': matches_won.count()}
            return Response(response)
        elif game == 'tournaments':
            # Logique pour les tournois
            print("coucou")
        else:
            # Gérer d'autres cas ou renvoyer une réponse d'erreur
            return Response({'error': 'Opération non prise en charge'})
        

class CreateFinishMatchAPIView(generics.GenericAPIView):
    #                                               DATA DOIT CONTENIR :
    #               action = create                         |               action = finish
    # {                                                     |  {
    #     opponent : [opponent_id],                         |       id : [id du match],
    #     tournament : [tournament_id OR null]              |       player1_score : [score du joueur 1]
    # }                                                     |       player2_score : [score du joueur 2]
    #                                                       |       match_duration: [durée du match format : 00:00:00] 
    #                                                       |  }      
    def post(self, request, *args, **kwargs):
        current_player = self.request.user
        action = kwargs.get('action')
        
        if action == 'create':
            try:
                player2 = User.objects.get(id=request.data.get('opponent'))
            except User.DoesNotExist:
                return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
            
            new_match = Match.objects.create(
                player1_id=current_player,
                player2_id=player2,
                tournament_id=request.data.get('tournament')  # Assurez-vous de récupérer ou de passer l'ID du tournoi
            )
            return Response({"match_id": new_match.id}, status=status.HTTP_400_BAD_REQUEST)
        elif action == 'finish':
            try:
                match = Match.objects.get(id=request.data.get('id'))
            except Match.DoesNotExist:
                return Response({"detail": "Match not found."}, status=status.HTTP_404_NOT_FOUND)
        
            match.player1_score = request.data.get('player1_score')
            match.player2_score = request.data.get('player2_score')
            match.match_duration = request.data.get('match_duration')
            match.winner_id = match.player1_id if match.player1_score > match.player2_score else match.player2_id

            return Response({"message": "Le match a été mis à jour"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Invalid action."}, status=status.HTTP_404_NOT_FOUND)


class CreateJoinTournamentAPIView(generics.GenericAPIView):
    #                                               DATA DOIT CONTENIR :
    #               action = create                         |               action = join
    # {                                                     |  {
    #     name : [nom du tournois],                         |       id : [id du tournois],
    # }                                                     |  }     
    def post(self, request, *args, **kwargs):
        current_player = self.request.user
        action = kwargs.get('action')
        
        if action == 'create':
            newTournament = Tournament.objects.create(
                name = request.data.get('name'),
            )
            
            newTournament.players.add(current_player)
            newTournament.save()
            
            
            newTournament.players.add(current_player)
            newTournament.save()

            return Response({"message": "Tournoi créé avec succès"}, status=status.HTTP_201_CREATED)
            
        # elif action == 'join':
        
        