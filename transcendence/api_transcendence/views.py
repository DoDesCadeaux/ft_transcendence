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

# Permet de récupérer les stats globales joués/gagnés pour les matchs et les tournois   
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
            
        elif action == 'join':
            tournament = get_object_or_404(Tournament, id=request.data.get('id'))
            # Récupérer l'ensemble des joueurs du tournoi
            players_set = tournament.players.all()

            print(players_set)
            
            
            # Obtenir la longueur de l'ensemble des joueurs

            # Vérifier si la longueur est supérieure à 4
            if len(players_set) >= 4:
                return Response( "Le tournoi est complet. Il n'y a plus de place.", status=status.HTTP_400_BAD_REQUEST)

            # Vérifier si le joueur est déjà inscrit
            if current_player in players_set:
                return Response(f"Vous êtes déjà inscrit au tournoi {tournament.name}.", status=status.HTTP_400_BAD_REQUEST)

            # Ajouter le joueur actuel à la liste des joueurs du tournoi
            tournament.players.add(current_player)

            # Sauvegarder les modifications
            tournament.save()
            print(len(players_set))
            
            print(players_set)

            return Response(f"Inscription réussie au tournoi {tournament.name} !",status=status.HTTP_200_OK)
            

        
# Permet de récupérer les infos globales d'un match ou d'un tournois 
class DataMatchTournamentAPIView(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        game = kwargs.get('game')

        if game == 'matchs':
            print("coucou")
            # return Response(response)
        elif game == 'tournaments':
            tournaments = Tournament.objects.all()

            tournament_data = []
            for tournament in tournaments:
                tournament_info = {
                    'id' : tournament.id,
                    'name': tournament.name,
                    'players': UserSerializer(tournament.players.all(), many=True).data,
                    'winners': [None, None, None]
            }
                # Obtenez les joueurs
                players = tournament_info['players']

                # # Vérifiez si vous avez au moins 2 joueurs
                if len(players) >= 2:
                    first_two_players = players[:2]

                    winner_demi_first = Match.objects.filter(
                        tournament_id=tournament_info['id'],
                        player1_id__in=[player['id'] for player in first_two_players],
                        player2_id__in=[player['id'] for player in first_two_players]
                    ).values('winner').first()
                    
                    
                    print(winner_demi_first)
                    
                    if  winner_demi_first is not None:
                        winner_demi_user = get_object_or_404(User, id=winner_demi_first['winner'])
                        
                        
                        

                    # Utilisez le serializer pour convertir l'utilisateur en données JSON
                    winner_demi_serializer = UserSerializer(winner_demi_user)
                    tournament_info['winners'][0] = winner_demi_serializer.data if winner_demi_first else None

                # Vérifiez si vous avez au moins 4 joueurs
                if len(players) >= 4:
                    last_two_players = players[-2:]

                    winner_demi_last = Match.objects.filter(
                        tournament_id=tournament_info['id'],
                        player1_id__in=[player['id'] for player in last_two_players],
                        player2_id__in=[player['id'] for player in last_two_players]
                    ).values('winner').first()
                    
                    
                    winner_demi_user = get_object_or_404(User, id=winner_demi_last['winner'])

                    # Utilisez le serializer pour convertir l'utilisateur en données JSON
                    winner_demi_serializer = UserSerializer(winner_demi_user)
                        # Ajoutez le résultat au tableau winner_demi
                    tournament_info['winners'][1] = winner_demi_serializer.data if winner_demi_last else None
                
                if tournament_info['winners'][0] is not None and tournament_info['winners'][1]  is not None:
                # if len(tournament_info['winner_demi']) == 2:
                    # Recherchez le gagnant du match final
                    winner_final_match = Match.objects.filter(
                        tournament_id=tournament_info['id'],
                        player1_id__in=[player['id'] for player in tournament_info['winners'][:2]],
                        player2_id__in=[player['id'] for player in tournament_info['winners'][:2]],
                    ).values('winner').first()

                    winner_demi_user = get_object_or_404(User, id=winner_demi_last['winner'])

                    # Utilisez le serializer pour convertir l'utilisateur en données JSON
                    winner_demi_serializer = UserSerializer(winner_demi_user)

                    # Ajoutez le résultat au champ winner_final
                    tournament_info['winner'][2] = winner_demi_serializer.data if winner_final_match else None
                tournament_data.append(tournament_info)
            return Response(tournament_data)
        else:
            print("coucou")
            # Gérer d'autres cas ou renvoyer une réponse d'erreur
            # Prout
            return Response({'error': 'Opération non prise en charge'})



# FActorisationfrom django.shortcuts import get_object_or_404
# from rest_framework.response import Response
# from rest_framework import generics
# from django.contrib.auth.models import User
# from .models import Tournament, Match
# from .serializers import UserSerializer

# class DataMatchTournamentAPIView(generics.GenericAPIView):
#     def get(self, request, *args, **kwargs):
#         game = kwargs.get('game')

#         if game == 'matchs':
#             print("coucou")
#             # return Response(response)
#         elif game == 'tournaments':
#             tournaments = Tournament.objects.all()

#             tournament_data = []
#             for tournament in tournaments:
#                 tournament_info = self.get_tournament_info(tournament)
#                 tournament_data.append(tournament_info)

#             return Response(tournament_data)

#         else:
#             print("coucou")
#             # Gérer d'autres cas ou renvoyer une réponse d'erreur
#             # Prout
#             return Response({'error': 'Opération non prise en charge'})

#     def get_tournament_info(self, tournament):
#         players = UserSerializer(tournament.players.all(), many=True).data
#         tournament_info = {
#             'id': tournament.id,
#             'name': tournament.name,
#             'players': players,
#             'winners': [self.get_winner(tournament, players[:2]),
#                         self.get_winner(tournament, players[-2:]),
#                         self.get_winner(tournament, tournament_info['winners'][:2])]
#         }
#         return tournament_info

#     def get_winner
#     (self, tournament, player_list):
#         winner_demi = Match.objects.filter(
#             tournament_id=tournament.id,
#             player1_id__in=[player['id'] for player in player_list],
#             player2_id__in=[player['id'] for player in player_list]
#         ).values('winner').first()

#         if winner_demi:
#             winner_demi_user = get_object_or_404(User, id=winner_demi['winner'])
#             winner_demi_serializer = UserSerializer(winner_demi_user)
#             return winner_demi_serializer.data
#         else:
#             return None
