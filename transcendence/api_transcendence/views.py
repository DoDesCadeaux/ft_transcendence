# api/views.py
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from django.db import models
from app.models import User, Match, Tournament, Notifications, Friendship, OxoMatch
from app.serializer import *
from django.shortcuts import get_object_or_404
import ast
from django.db.models import Avg, ExpressionWrapper, F, fields, Sum
from datetime import timedelta

class UserInfoAPIView(generics.ListAPIView):
    serializer_class = UserListSerializer

    def get(self, request, *args, **kwargs):
        current_user = self.request.user
        serializer = self.serializer_class(current_user) 
        return Response(serializer.data)

class UserListAPIView(generics.ListAPIView):
    serializer_class = UserListSerializer

    def list(self, request, *args, **kwargs):
        serialized_users = []
        current_user = self.request.user
        queryset = User.objects.exclude(id=current_user.id)
        
        for user in queryset:
            serializer = self.get_serializer(user)
            serialized_data = serializer.data
            serialized_data['is_friend'] = False
            
            if Friendship.objects.filter(user=current_user, friend=user).exists():
                serialized_data['is_friend'] = True
                
            serialized_users.append(serialized_data)

        return Response(serialized_users)

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
            tournaments_won = 0
            tournaments_participated = Tournament.objects.filter(players=current_player)
            for tournament in tournaments_participated:
                if tournament.winner == current_player:
                    tournaments_won += 1
            response = {'total': tournaments_participated.count(), 'won': tournaments_won}
            return Response(response)
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
                player2 = User.objects.get(username=request.data.get('opponent'))
            except User.DoesNotExist:
                return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
            new_match = Match.objects.create(
                player1=current_player,
                player2=player2,
                tournament_id=request.data.get('tournament')  # Assurez-vous de récupérer ou de passer l'ID du tournoi
            )
            response = {
                "match_id" : new_match.id,
                "player1" : {
                    "username" : new_match.player1.username,
                    "photo" : new_match.player1.photo.url,
                },
                "player2" : {
                    "username" : new_match.player2.username,
                    "photo" : new_match.player2.photo.url,
                }
            }
            player2.state = 'in-game'
            current_player.state = 'in-game'
            player2.save()
            current_player.save()
            return Response(response, status=status.HTTP_201_CREATED)
        elif action == 'finish':
            try:
                match = Match.objects.get(id=request.data.get('id'))
            except Match.DoesNotExist:
                return Response({"detail": "Match not found."}, status=status.HTTP_404_NOT_FOUND)
        
            match.player1_score = request.data.get('player1_score')
            match.player2_score = request.data.get('player2_score')
            timedelta_duration = timedelta(seconds=float(request.data.get('match_duration')))
            match.match_duration = timedelta_duration
            match.winner_id = match.player1_id if match.player1_score > match.player2_score else match.player2_id
            
            # Récupérer les time actuels des joueurs depuis la base de données
            player1_duration = match.player1.play_time if match.player1.play_time else timedelta(seconds=0)
            player2_duration = match.player2.play_time if match.player2.play_time else timedelta(seconds=0)
            
            # Ajouter la durée du match aux durées des joueurs
            match.player1.play_time = player1_duration + match.match_duration
            match.player2.play_time = player2_duration + match.match_duration
            
            #Mise a jour du status
            match.player1.state = 'online'
            match.player2.state = 'online'
            
            # Enregistrer les modifications
            match.player1.save()
            match.player2.save()
            match.save()

            return Response({"message": "Le match a été mis à jour"}, status=status.HTTP_200_OK)
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

            return Response(f"Inscription réussie au tournoi {tournament.name} !",status=status.HTTP_200_OK)
                
# Permet de récupérer les infos globales d'un match ou d'un tournois 
class DataMatchTournamentAPIView(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        game = kwargs.get('game')

        # if game == 'matchs':
        #     print("coucou")
            # return Response(response)
        if game == 'tournaments':
            tournaments = Tournament.objects.all()

            tournament_data = []
            for tournament in tournaments:
                tournament_info = {
                    'id' : tournament.id,
                    'name': tournament.name,
                    'players': UserSerializer(tournament.players.all(), many=True).data,
                    'winners': [None, None, None]
                }
                players = tournament_info['players']

                # # Vérifiez si vous avez au moins 2 joueurs
                if len(players) >= 2:
                    first_two_players = players[:2]

                    winner_demi_first = Match.objects.filter(
                        tournament_id=tournament_info['id'],
                        player1_id__in=[player['id'] for player in first_two_players],
                        player2_id__in=[player['id'] for player in first_two_players]
                    ).values('winner').first()
                    if  winner_demi_first is not None:
                        winner_demi_user = get_object_or_404(User, id=winner_demi_first['winner'])

                    # Utilisez le serializer pour convertir l'utilisateur en données JSON
                    tournament_info['winners'][0] = UserSerializer(winner_demi_user).data if winner_demi_first else None

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
            return Response({'error': 'Opération non prise en charge'})

class FullStatsAPIView(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        params = request.GET.get('list')
        ids = ast.literal_eval(params)
        
        if ids:
            buts_data = []
            duration_data = []
            percent_won_data = []
            percent_won_demi_data = []
            percent_won_final_data = []
        
            for id in ids:
                user = User.objects.get(id=id)
                buts_data.append(self.getButsData(user))
                duration_data.append(self.getDurationData(user))
                percent_won_data.append(self.getPercentWonData(user))
                won_demi , won_final = self.getPercentWonTournyData(user)
                percent_won_demi_data.append(won_demi)
                percent_won_final_data.append(won_final)
            stats_data = {
                'buts': buts_data,
                'duration': duration_data,
                'percentWon': percent_won_data,
                'percentWonDemi': percent_won_demi_data,
                'percentWonFinal': percent_won_final_data
            }
            return Response(stats_data)
        else:
            return Response({'error': 'Opération non prise en charge'})
        
    def getPercentWonData(self, user):
        matches_played = Match.objects.filter(models.Q(player1=user.id) | models.Q(player2=user.id)).count()
        matches_won = Match.objects.filter(winner=user.id).count()

        if matches_played > 0:
            win_percentage = (matches_won * 100) / matches_played
        else:
            win_percentage = 0

        return {
            'label': user.username,
            'data': win_percentage
        }
    
    def getButsData(self, user):
        # Calcul du nombre total de buts marqués par l'utilisateur
        goals_for = Match.objects.filter(models.Q(player1=user) | models.Q(player2=user)).aggregate(total_goals=Sum(models.Case(
            models.When(player1=user, then='player1_score'),
            models.When(player2=user, then='player2_score'),
            default=0
        ))
        )['total_goals'] or 0

        # Calcul du nombre total de buts encaissés par l'utilisateur
        goals_against = Match.objects.filter(models.Q(player1=user) | models.Q(player2=user)).aggregate(total_goals=Sum(models.Case(
            models.When(player1=user, then='player2_score'),
            models.When(player2=user, then='player1_score'),
            default=0
        ))
        )['total_goals'] or 0
        
        return {
            'name': user.username,
            'data': [goals_for, goals_against]
        }
    
    def getDurationData(self, user):
        # Filtrer les matchs où l'utilisateur est soit joueur 1 soit joueur 2
        matches_participated = Match.objects.filter(models.Q(player1=user) | models.Q(player2=user))
        
        # Calculer le temps moyen des matchs auquel l'utilisateur a participé
        average_duration_participated = matches_participated.aggregate(average_duration=Avg(ExpressionWrapper(F('match_duration'), output_field=fields.DurationField())))['average_duration']
        average_duration_participated_minutes = int(average_duration_participated.total_seconds() / 60) if average_duration_participated else 0
        
        # Filtrer les matchs sans ID de tournoi
        matches_without_tournament = matches_participated.filter(tournament=None)
        
        # Calculer le temps moyen des matchs sans ID de tournoi
        average_duration_without_tournament = matches_without_tournament.aggregate(average_duration=Avg(ExpressionWrapper(F('match_duration'), output_field=fields.DurationField())))['average_duration']
        average_duration_without_tournament_minutes = int(average_duration_without_tournament.total_seconds() / 60) if average_duration_without_tournament else 0
        
        # Filtrer les matchs avec ID de tournoi
        matches_with_tournament = matches_participated.exclude(tournament=None)
        
        # Calculer le temps moyen des matchs avec ID de tournoi
        average_duration_with_tournament = matches_with_tournament.aggregate(average_duration=Avg(ExpressionWrapper(F('match_duration'), output_field=fields.DurationField())))['average_duration']
        average_duration_with_tournament_minutes = int(average_duration_with_tournament.total_seconds() / 60) if average_duration_with_tournament else 0
        
        return {
            'name': user.username,
            'data': [average_duration_participated_minutes, average_duration_without_tournament_minutes, average_duration_with_tournament_minutes]
        }
    
    def getPercentWonTournyData(self, user):
        tournaments_participated = Tournament.objects.filter(players=user)
        total_demi = 0
        total_final = 0
        won_demi = 0
        won_final = 0
        # Pour chaque tournoi, récupérer les matchs correspondants
        for tournament in tournaments_participated:
            matches = Match.objects.filter(tournament=tournament)
            if (len(matches) == 1 or len(matches) == 2):
                for match_play in matches:
                    participed = match_play.player1 == user or match_play.player2 == user
                    if participed:
                        total_demi += 1
                    if match_play.winner == user:
                        won_demi += 1
            if(len(matches) == 3):
                participed = matches[3].player1 == user or matches[3].player2 == user
                if participed:
                    total_final += 1
                if matches[3].winner == user:
                    won_final += 1
        
        if total_demi != 0:
            res_demi = (won_demi * 100) / total_demi
        else:
            res_demi = 0
            
        if total_final != 0:
            res_final = (won_final * 100) / total_final
        else:
            res_final = 0

        percent_demi = {'label': user.username, 'data': res_demi}
        percent_final = {'label': user.username, 'data': res_final}  
        
        
        return percent_demi, percent_final
            
class ManageNotifAPIView(generics.GenericAPIView):
    #                                               DATA DOIT CONTENIR :
    #               action = create                         |               action = update
    # {                                                     |  {
    #     opponent : [opponent_username],                         |       id : [id de la notif], 
    #                                                               state : [soit 1, 2 ou 3]
    # }                                                     |  }      
    def post(self, request, *args, **kwargs):
        current_player = self.request.user
        action = kwargs.get('action')
    
        if action == 'create':
            try:
                player2 = User.objects.get(username=request.data.get('opponent'))
            except User.DoesNotExist:
                return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
            new_notification = Notifications.objects.create(
                user_from=current_player,
                user_to=player2,
                state=0,
                type=request.data.get('type')
            )
            return Response({"notification_id": new_notification.id}, status=status.HTTP_201_CREATED)
        elif action == 'update':
            try:
                notification = Notifications.objects.get(id=request.data.get('id'))
            except Notifications.DoesNotExist:
                return Response({"detail": "Notification not found."}, status=status.HTTP_404_NOT_FOUND)
        
            if notification.state == 0:
                notification.state = request.data.get('state')
                notification.save ()

            return Response({"message": "L'état de la notification a été mis a jour"}, status=status.HTTP_200_OK)
        return Response({"detail": "Invalid action."}, status=status.HTTP_404_NOT_FOUND)

class CheckNotifAPIView(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        current_user = self.request.user
        action = kwargs.get('action')
        
        if action == 'received':
            try:
                notification = Notifications.objects.get(user_to=current_user, state=0)
                response = {
                    "id": notification.id,
                    "from": notification.user_from.username,
                    "to": notification.user_to.username,
                    "type" : "Pong" if notification.type == 0 else "Oxo"
                }
                if current_user.state == 'online':
                    return Response(response, status=status.HTTP_200_OK)
                return Response({"detail": "Pas disponible."}, status=status.HTTP_200_OK)
            except Notifications.DoesNotExist:
                return Response({"detail": "Pas de notification en attente."}, status=status.HTTP_404_NOT_FOUND)    
        if action == 'sent':
            try:
                idNotif = request.GET.get('id')
                notification = Notifications.objects.get(id=idNotif)
                response = {
                    "state" : notification.state,
                    "game" : notification.type
                }
                return Response(response, status=status.HTTP_200_OK)
            except Notifications.DoesNotExist:
                return Response({"detail": "La notification n'a pas été trouvée."}, status=status.HTTP_404_NOT_FOUND)
        return Response({"detail": "Action invalide."}, status=status.HTTP_400_BAD_REQUEST) 
        
class UsernameAlreadyExist(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        current_user = self.request.user
        new_username = request.GET.get('username')
        isUserName = User.objects.exclude(id=current_user.id).filter(username=new_username).exists()
        return Response({"result": isUserName}, status=status.HTTP_200_OK) 
           
class ManageFriends(generics.GenericAPIView):
    serializer_class = UserListSerializer
    def get(self, request, *args, **kwargs):
        current_user = self.request.user
        action = kwargs.get('action')
        
        if action == "update":
            params = request.GET.get('list')
            friends = ast.literal_eval(params)
            Friendship.objects.filter(user=current_user).delete()
            liste = []
            
            for friend in friends:
                new_friend = get_object_or_404(User, id=friend)
                new_friendship = Friendship(user=current_user, friend=new_friend)
                new_friendship.save()
                liste.append(new_friend.username) 
                
            response = {"friendList" : liste}
            return Response(response, status=status.HTTP_200_OK)
        return Response({"detail": "Action invalide."}, status=status.HTTP_400_BAD_REQUEST) 
                    
class CreateFinishOxoAPIView(generics.GenericAPIView):
    #                                               DATA DOIT CONTENIR :
    #               action = create                         |               action = finish
    # {                                                     |  {
    #     opponent : [opponent_id],                         |       id : [id du match],
    #                                                       |       player1_score : [score du joueur 1]
    # }                                                     |       player2_score : [score du joueur 2]
    #                                                       |       match_duration: [durée du match format : 00:00:00] 
    #                                                       |  }      
    def post(self, request, *args, **kwargs):
        current_player = self.request.user
        action = kwargs.get('action')
        
        if action == 'create':
            try:
                player2 = User.objects.get(username=request.data.get('opponent'))
            except User.DoesNotExist:
                return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
            new_match = OxoMatch.objects.create(
                player1=current_player,
                player2=player2,
            )
            response = {
                "match_id" : new_match.id,
                "player1" : {
                    "username" : new_match.player1.username,
                    "photo" : new_match.player1.photo.url,
                    "id": new_match.player1.pk,
                },
                "player2" : {
                    "username" : new_match.player2.username,
                    "photo" : new_match.player2.photo.url,
                    "id": new_match.player2.pk,
                    
                }
            }
            player2.state = 'in-game'
            current_player.state = 'in-game'
            player2.save()
            current_player.save()
            return Response(response, status=status.HTTP_201_CREATED)
        elif action == 'finish':
            try:
                match = OxoMatch.objects.get(id=request.data.get('id'))
            except OxoMatch.DoesNotExist:
                return Response({"detail": "Match not found."}, status=status.HTTP_404_NOT_FOUND)
        
            # match.player1_score = request.data.get('player1_score')
            # match.player2_score = request.data.get('player2_score')
            timedelta_duration = timedelta(seconds=float(request.data.get('match_duration')))
            match.match_duration = timedelta_duration
            winner_id = request.data.get('winner')
            
            
            
            
            
            print(winner_id)
            if winner_id:
                winner_id = int(winner_id)
                if winner_id == match.player1_id:
                    winner = match.player1_id
                elif winner_id == match.player2_id:
                    winner = match.player2_id
                match.winner_id = winner
            else:
                match.winner_id = None
            # match.winner_id = match.player1_id if match.player1_score > match.player2_score else match.player2_id
            
            # Récupérer les time actuels des joueurs depuis la base de données
            player1_duration = match.player1.play_time if match.player1.play_time else timedelta(seconds=0)
            player2_duration = match.player2.play_time if match.player2.play_time else timedelta(seconds=0)
            
            # Ajouter la durée du match aux durées des joueurs
            match.player1.play_time = player1_duration + match.match_duration
            match.player2.play_time = player2_duration + match.match_duration
            
            #Mise a jour du status
            match.player1.state = 'online'
            match.player2.state = 'online'
            
            # Enregistrer les modifications
            match.player1.save()
            match.player2.save()
            match.save()

            return Response({"message": "Le match a été mis à jour"}, status=status.HTTP_200_OK)
        return Response({"detail": "Invalid action."}, status=status.HTTP_404_NOT_FOUND)

        
  
        

        
