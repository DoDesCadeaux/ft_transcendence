-- Il y aurait 3 tables:
    -- Table user
    -- Table match
    -- Table tournament

    -- 1ere partie du fichier : creation des table et mise a jour des tables
    -- 2eme partie du fichier : versant API pour lien back/front


-------------------------------------------------------
-------------------------------------------------------
-------------------------------------------------------
---------------------PARTIE 1--------------------------
-------------------------------------------------------
-------------------------------------------------------


-------------------------------------------------------
-- TABLE USER --
CREATE TABLE "user"(
    "id" INTEGER NOT NULL,                              -- cle primaire id
    "id_api" BIGINT NOT NULL,                           -- id ou token de l'api 42 (permettra de savoir si c'est un nouvel utilisateur ou non)
    "name" VARCHAR(255) NOT NULL,                       -- le nom (celui de l'api 42)
    "username" VARCHAR(255) NOT NULL DEFAULT name,      -- par default = le name (pas sure de la nomenclature)
    "photo" VARCHAR(255) NOT NULL,                      -- photo de l'api 42
    "playTime" TIMESTAMP(0) WITHOUT TIME ZONE NULL,     -- par default null
    "state_user" INTEGER                                -- 0:offline 1:inline 2:ongame
);
ALTER TABLE
    "user" ADD PRIMARY KEY("id");

-- Lors de la connexion d'un joueur :
    -- On commence par verifier si l'user existe deja dans la table avec a son id_api
        SELECT * FROM user WHERE id_api = 'valeur_id_api_recherchee';
        -- Si le joueur est trouve on met a jour son state
        UPDATE user SET state_user = 1 WHERE id = "valeur de l'id du player retourne par la requete precedente"
        -- Sinon on ajoute un nouveau joueur
        INSERT INTO user ("id_api", "name", "username", "photo", "playTime", "state")
        VALUES ('valeur_id_api', "Nom de l'utilisateur", "Nom d'utilisateur", 'chemin/vers/photo.jpg', NULL, 1);

-- Lors de la deconnexion
    UPDATE user SET state_user = 0 WHERE id = "id du player"

-- Lorsque le joueur est en match
    UPDATE user SET state_user = 2 WHERE id = "id du player"

-- Lorsque le match est finni
    UPDATE user SET state_user = 1 WHERE id = "id du player"

-- Mise a jour du profile
    UPDATE user SET username = "valeur nouvel username", photo = "valeur nouvelle photo" WHERE id = "id du player"
        -- Quid de la sauvegarde de la photo

-------------------------------------------------------
-- FIN TABLE USER --


-------------------------------------------------------
-- TABLE MATCH --

CREATE TABLE "match"(
    "id" INTEGER NOT NULL,                                      -- id unique de match
    "player1_id" INTEGER NOT NULL,                              -- id du joueur 1
    "player2_id" INTEGER NOT NULL,                              -- id du joueur 2
    "player1_score" INTEGER,                                    -- score joueur 1
    "player2_score" INTEGER,                                    -- score joueur 2
    "match_duration" TIMESTAMP(0) WITHOUT TIME ZONE NULL,       -- temps du match (mis a jour a la fin)
    "winner_id" INTEGER NULL                                    -- gagnant (mis a jour a la fin)
);
ALTER TABLE
    "match" ADD PRIMARY KEY("id");

-- Lorsque les deux joueurs sont prets 
    INSERT INTO match ("player1_id", "player2_id", "match_duration", "winner_id")
    VALUES ('id joueur 1', "id joueur 2", NULL, NULL);
        -- Ici on creer juste le match. on va le modifier une fois qu'il serra fini grace au infos de score

-- Lorsque le match est fini
    UPDATE "match"
    SET
        player1_score = "nouveau_score_joueur1",
        player2_score = "nouveau_score_joueur2",
        match_duration = "temps du match"
        winner_id =
            CASE
                WHEN player1_score > player2_score THEN player1_id
                WHEN player1_score < player2_score THEN player2_id
            ELSE NULL  -- En cas d'égalité, le gagnant est nul (on arrivera jamais dans ce cas la)
            END
    WHERE id = "id_du_match";

-------------------------------------------------------
-- FIN TABLE MATCH --
CREATE TABLE "tournament"(
    "id" INTEGER NOT NULL,
    "player1_id" INTEGER ,
    "player2_id" INTEGER ,
    "player3_id" INTEGER ,
    "player4_id" INTEGER ,
    "match00_id" INTEGER ,
    "match01_id" INTEGER ,
    "match1_id" INTEGER 
);
ALTER TABLE
    "tournament" ADD PRIMARY KEY("id");

-- Creation d'un tournois (automatique si il y en a pas deja un en cours)
INSERT INTO match ("player1_id", "player2_id", "player3_id", "player4_id", "match00_id", "match01_id", "match1_id")
    VALUES (NULL, NULL, NULL, NULL, NULL, NULL);

--Pseudo inscription au tournois
    -- ajoute un nouveau player a la premiere place de "libre", si toutes les places sont occupees on ajoute personne
UPDATE tournament
SET
  player1_id = COALESCE(player1_id, "nouvel_id_joueur"),
  player2_id = COALESCE(player2_id, "nouvel_id_joueur"),
  player3_id = COALESCE(player3_id, "nouvel_id_joueur"),
  player4_id = COALESCE(player4_id, "nouvel_id_joueur")
WHERE
  player1_id IS NULL OR
  player2_id IS NULL OR
  player3_id IS NULL OR
  player4_id IS NULL;

-- Creation du premier et du deuxieme match avec la requete ligne 64
-- Lorsque les deux premiers match sont finni creation du dernier avec toujours la meme requete en prenant les id des winner
-- recuperes dans la table match grace au id des 2 premiers match.

-------------------------------------------------------
-- FIN TABLE USER --


-------------------------------------------------------
-------------------------------------------------------
-------------------------------------------------------
---------------------PARTIE 2--------------------------
-------------------------------------------------------
-------------------------------------------------------


-- API user

    -- Get des infos de la personne connectee
    SELECT * FROM user WHERE id = "id de l'user";
        -- Permet de remplir une tres grosse partie du front
    -- Get des username et du statut des tous les users
    SELECT username, state_user FROM user
        -- Permet de remplir la partie droite avec les personnes et leur statut
