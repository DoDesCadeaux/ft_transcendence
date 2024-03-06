# Consommateur websocket qui gère la logique de communication en temps 
# réel entre le frontend et le backend de ton application pour le jeu Pong.

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.contrib.auth.models import User
import jwt                                          # VERIFIER SI TOKEN JWT UTILISE
from asgiref.sync import async_to_sync
import asyncio

all_players = []
FIXED_SECRET_KEY = "secret"

# CONSUMER PONGCONSUMER
class PongConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):            # init variable du jeu
        super().__init__(*args, **kwargs)
        self.canvas_width = 800
        self.canvas_height = 400
        self.paddle_width = 10
        self.paddle_height = 80
        self.ball_size = 10
        self.ball_speed = 2
        self.ball_speed_x = self.ball_speed
        self.ball_speed_y = self.ball_speed
        self.paddle_left_y = self.canvas_height / 2 - self.paddle_height / 2
        self.paddle_right_y = self.canvas_height / 2 - self.paddle_height / 2
        self.score_left = 0
        self.score_right = 0
        self.ball_in_play = False

    # Appellé lors de la connexion d un client au socket
    async def connect(self):
        fixed_token = "test"
        user_token = self.scope['cookie'].get('NOM_DU_COOKIE')              # ICI GERER RECUPERATION TOKEN 42 DANS COOKIE
        if user_token:
            try:
                #payload = jwt.decode(user_token, 'CLE_SECRETE', algorithms=['HS256'])   # RECUPERER CLE JWT DANS ENV
                payload = jwt.decode(fixed_token, FIXED_SECRET_KEY, algorithms=['HS256'])
                user_id = payload['user_id']
                user = User.objects.get(pk=user_id)                         # Obtention 'user' en utilisant l'ID utilisateur
                all_players.append(user.username)                           # Ajout du nom d'utilisateur à la liste all_players

            except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, KeyError, User.DoesNotExist):
                pass                                                        # GERER ERREUR SI TOKEN NON VALIDE

        await self.channel_layer.group_add("pong_game", self.channel_name)  # Rejoint instance de partie
        await self.accept()                                                 # Accepte connexion WebSocket
        await self.update_players_list()                                    # MAJ liste des joueurs pour tous les clients

    async def disconnect(self, close_code):
        
        all_players.remove(self.scope["user"].username)                         # Retire le joueur de la liste des joueurs
        await self.channel_layer.group_discard("pong_game", self.channel_name)  # Quitte instance de partie
        await self.update_players_list()                                        # MAJ liste des joueurs pour tous les clients

    async def receive_json(self, content):
        if content.get("action") == "keydown":
            await self.handle_key_events(content)

    async def update_game_state(self):
        await self.channel_layer.group_send(
            "pong_game",
            {
                "type": "game_state",
                "paddle_left_y": self.paddle_left_y,
                "paddle_right_y": self.paddle_right_y,
                "ball_x": self.ball_x,
                "ball_y": self.ball_y,
                "score_left": self.score_left,
                "score_right": self.score_right,
            },
        )

    # Envoie liste des joueurs à tous les clients
    async def players_list(self, event):
        players = event["players"]
        await self.send_json({
            "type": "players_list",
            "players": players
        })
    
    # Envoie liste des joueurs à tous les clients
    async def update_players_list(self):
        await self.channel_layer.group_send(
            "pong_game",
            {
                "type": "players_list",
                "players": all_players
            }
        )

    async def handle_key_events(self, key_event):
        key = key_event.get("key")
        if key == "w" and self.paddle_left_y > 0:
            self.paddle_left_y -= 10
        elif key == "s" and self.paddle_left_y < self.canvas_height - self.paddle_height:
            self.paddle_left_y += 10
        elif key == "ArrowUp" and self.paddle_right_y > 0:
            self.paddle_right_y -= 10
        elif key == "ArrowDown" and self.paddle_right_y < self.canvas_height - self.paddle_height:
            self.paddle_right_y += 10

        await self.update_game_state()

    async def move_ball(self):
        if self.ball_in_play:
            # Move the ball
            self.ball_x += self.ball_speed_x
            self.ball_y += self.ball_speed_y

            # Ball collision with top and bottom walls
            if self.ball_y <= self.ball_size or self.ball_y >= self.canvas_height - self.ball_size:
                self.ball_speed_y = -self.ball_speed_y

            # Ball collision with paddles (Left & Right)
            if (
                self.ball_x < self.paddle_width + self.ball_size
                and self.ball_y > self.paddle_left_y
                and self.ball_y < self.paddle_left_y + self.paddle_height
            ):
                self.ball_x = self.paddle_width + self.ball_size
                self.ball_speed_x = -self.ball_speed_x
            elif (
                self.ball_x > self.canvas_width - self.paddle_width - self.ball_size
                and self.ball_y > self.paddle_right_y
                and self.ball_y < self.paddle_right_y + self.paddle_height
            ):
                self.ball_x = self.canvas_width - self.paddle_width - self.ball_size
                self.ball_speed_x = -self.ball_speed_x

            # Ball goes off-screen to the left or right
            if self.ball_x < self.ball_size:
                # The ball goes off-screen to the left, so the right player scores a point
                self.score_right += 1
                await self.update_game_state()
                await asyncio.sleep(1)
                self.reset_ball()
            elif self.ball_x > self.canvas_width - self.ball_size:
                # The ball goes off-screen to the right, so the left player scores a point
                self.score_left += 1
                await self.update_game_state()
                await asyncio.sleep(1)
                self.reset_ball()

            await self.update_game_state()

    async def game_state(self, event):
        # Send the current game state to the client
        await self.send_json(
            {
                "paddle_left_y": event["paddle_left_y"],
                "paddle_right_y": event["paddle_right_y"],
                "ball_x": event["ball_x"],
                "ball_y": event["ball_y"],
                "score_left": event["score_left"],
                "score_right": event["score_right"],
            }
        )

    async def reset_game(self):
        # Reset game state to start a new game
        self.score_left = 0
        self.score_right = 0
        self.reset_ball()
        await self.update_game_state()

    async def reset_ball(self):
        # Reset ball position
        self.ball_x = self.canvas_width / 2
        self.ball_y = self.canvas_height / 2
        self.ball_speed_x = self.ball_speed
        self.ball_speed_y = self.ball_speed
        self.ball_in_play = False
        await self.update_game_state()

    

