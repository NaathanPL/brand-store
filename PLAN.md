# Brand Store Lansay : DE, ES, NL depuis le modèle FR

Modèle FR : https://www.amazon.fr/stores/page/2F884A82-A229-41EC-8113-9498852F3172 (version "Lansay MAJ FA26")
Territoires : Google Sheet 1HSheiP94xFhEGw5b1fLNUvrf52EjoJkYfQ-CDIrPH4w, onglet CATA ACTIF 2026, col M (UE / FR / FR + BE / FR + BE + NL / FR + BE + DE + NL)

## Méthode visuels
1. ChatGPT (nouveau chat) : "Récupère cette image : <URL FR m.media-amazon> puis génère-la à l'identique en remplaçant uniquement le texte « X » par « Y »..."
   Insertion par execCommand('insertText') dans .ProseMirror puis touche Return. Vérif 1 fois par minute.
2. Récupération : canvas cover-crop aux dimensions cibles, sortie B64START...B64END + padding (forcée en fichier), décodage avec pageaplusamazon/tools/dec.py.
3. Push dans ce repo, dossier <PAYS>/.
4. Builder : `__up(rawUrl, nom)` = fetch + DataTransfer sur input[type=file], puis bouton "Recadrer". Faire Mobile ET PC (onglets de l'éditeur d'image).
   Images FR sans texte et vidéos : le builder peut fetch directement les URL m.media-amazon FR.

## DE, visuels faits (DE/)
neuheiten_banner, tile_kreative_kueche, tile_glitzer, tile_malen, tile_perlen, tile_puppen,
banner_angebote, banner_kreatives_basteln, banner_kreative_kueche, banner_malen, banner_perlen, banner_glitzer, banner_baby, banner_3_5
En cours : bestseller, 6-7, 8+, puppen banner, my first blopens (a4880ae1). Reste : 259a58da (Wal/Zebra/Flugzeug).

## DE, arborescence (fait)
Supprimées : KIDULTS, FABRIKID, GLITTERIZZ, MEGO, TOTEM, SKY DANCERS, KONSTRUKTION, MANUELLEN AKTIVITÄTEN, ACTION-SPIELE, FIGUREN.
Exclus partout (FR/BE only) : Jeux de société (+5 sous-pages), Star Academy, Laser X, Make It Real, Bizzikins, page 5A01. Sky Dancers seulement NL.

## Homepage FR (ordre, ASIN)
Header / Neuheiten banner / video + B0H4WB3FD3 / Mini-Délices (6+ Ans, img 357b2524) B0H4WBP9T5 B0H4W16BD5 B0FH38ZYBT + video /
B0H4WBXNSM B0FX5JJYNP B0FH36HPRJ / Blopens (5+ Ans) B0H4W4P1V5 B0GH8M3X2Z + video, B0H4WDX8QS B0D9HJ4H81 /
Sequins (img 0527c0b1) B0GH8CDPNQ B0GH858VGZ B0H4W4L13C / Hokusai (Dès 14 Ans) B0H4W11WB2 B0H4W323JP B0H4W7XM59 + video /
Decoden (img 54387665) B0H4W4ZKS1 B0H4WDZFHR [B0H4VXFXCG FR only] / [Star Academy retiré] / Pixelo (img 5077cefa) B0GJ744ZWR B07FTP9S8Y B0D9HJFK8V + video / [Jeux de société retiré]

## Méthode API (validée 18/11, remplace le clic à la main)
- Token : `document.querySelector('meta[name="builder-csrf-token"]').content` -> header `anti-csrftoken-a2z`.
- Lecture : POST /builder/api/getPageData?entityId=..&subEntityId=.. (form-urlencoded) `pageId=..&storeId=<rootPageId>&edition=<code>`. Editions : FR FA26 = fy8TF, DE Multi 2023 = ruSFB.
- Écriture brouillon : POST /builder/api/savePageData (JSON) `{pageId, pageData:<objet>, entityId, deleted:false, storeId, parentPageId:"", edition}`.
- Upload visuel : POST /builder/api/assets/uploadAndRegisterAsset (FormData image, assetType=IMAGE, entityId, name, size) -> imageKey/imageUrl/assetId.
- Visuels et vidéos FR (al-eu-726f4d26-7fdb) réutilisables tels quels en DE.
- Les données passent d'un onglet à l'autre via le repo (fichier JSON poussé, puis fetch raw.githubusercontent).
- Recharger le builder après écriture (sinon l'éditeur ouvert peut réécraser).

## Statut DE
- Homepage : FAITE en brouillon (18/11). Header + Neuheiten + 15 rubriques FR (DE/homepage_sections.json). Retirés : Neuheiten FR (doublon), Star Academy, Jeux de société. Grille catégories réduite à Perlen + B0H4W53DQ3. Grille produits filtrée (17 ASIN UE). Tuiles Kreative Küche, Malen, Glitzer, Perlen + bannière Bestseller remplacées par les visuels DE. Lien Decoden (page Yumemi absente en DE) vidé. Sauvegarde homepage avant modif : localStorage `__deHomeBackup_20261118` (onglet advertising.amazon.de).
- Consigne Nathan : pour les autres pages, créer une NOUVELLE page bien nommée et la construire de zéro plutôt que vider l'ancienne.
- Visuel 259a58da (Wal/Zebra) : pas à traduire (petit texte). Ne traduire que bannières et gros textes.
- Builder FR : https://advertising.amazon.fr/builder/store?entityId=ENTITYV7AQV2Q8AH3W&subEntityId=ENTITY336EEXEJUQJM7 (attention, ouvre une vieille version par défaut : choisir "Lansay MAJ FA26").
- Builder DE : https://advertising.amazon.de/builder/store?entityId=ENTITYASTEFSGHUOXZ&subEntityId=ENTITY5KM28XMPR73V (version "Lansay Multi 2023 DE").
