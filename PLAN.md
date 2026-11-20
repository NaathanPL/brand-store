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

## Règle Nathan
- Copier FR au maximum sur chaque pays : toute page ou rubrique sans équivalent FR est supprimée, sans demander.

## Méthode API (validée 18/11, remplace le clic à la main)
- Token : `document.querySelector('meta[name="builder-csrf-token"]').content` -> header `anti-csrftoken-a2z`.
- Lecture : POST /builder/api/getPageData?entityId=..&subEntityId=.. (form-urlencoded) `pageId=..&storeId=<rootPageId>&edition=<code>`. Editions : FR FA26 = fy8TF, DE Multi 2023 = ruSFB.
- Écriture brouillon : POST /builder/api/savePageData (JSON) `{pageId, pageData:<objet>, entityId, deleted:false, storeId, parentPageId:"", edition}`.
- Upload visuel : POST /builder/api/assets/uploadAndRegisterAsset (FormData image, assetType=IMAGE, entityId, name, size) -> imageKey/imageUrl/assetId.
- Visuels et vidéos FR (al-eu-726f4d26-7fdb) réutilisables tels quels en DE.
- Les données passent d'un onglet à l'autre via le repo (fichier JSON poussé, puis fetch raw.githubusercontent).
- Recharger le builder après écriture (sinon l'éditeur ouvert peut réécraser).

## Statut DE
- Toutes les pages FAITES en brouillon (18/11), arborescence calquée sur FR FA26 (DE/pages_fr_fa26.json). Nouvelles pages : ANGEBOTE, et sous NACH MARKE : BEBE CABRIOLES, MINI DELICES, MAGIC LIGN, SHINY POP, YUMEMI. Pages renommées : KREATIVES BASTELN, MALEN & ZEICHNEN, PERLEN & SCHMUCK, GLITZER & PAILLETTEN, NACH ALTER, BESTSELLER. KREATIVE KÜCHE supprimée (pas d'équivalent FR). Marques exclues retirées de NACH MARKE (Sky Dancers, Make It Real, Laser X). Lien Decoden homepage -> YUMEMI. Sauvegarde de toutes les pages DE avant refonte : localStorage `__deAllBackup_20261118`.
- Suite : ES puis NL avec la même méthode (pages_fr_fa26 à refiltrer selon les territoires du pays, visuels à traduire).
- Homepage : FAITE en brouillon (18/11). Header + Neuheiten + 15 rubriques FR (DE/homepage_sections.json). Retirés : Neuheiten FR (doublon), Star Academy, Jeux de société. Grille catégories réduite à Perlen + B0H4W53DQ3. Grille produits filtrée (17 ASIN UE). Tuiles Kreative Küche, Malen, Glitzer, Perlen + bannière Bestseller remplacées par les visuels DE. Lien Decoden (page Yumemi absente en DE) vidé. Sauvegarde homepage avant modif : localStorage `__deHomeBackup_20261118` (onglet advertising.amazon.de).
- Consigne Nathan : pour les autres pages, créer une NOUVELLE page bien nommée et la construire de zéro plutôt que vider l'ancienne.
- Visuel 259a58da (Wal/Zebra) : pas à traduire (petit texte). Ne traduire que bannières et gros textes.
## Statut ES (19/11)
- Builder ES : https://advertising.amazon.es/builder/store?entityId=ENTITY18F9Z4SZY2YGY&subEntityId=ENTITYWO6CHGJJRWZQ, version "Lansay Multi 2023", edition MAMfC, storeId E2D1587C-1752-4201-B799-D94C71EAB192 (le builder ouvre "Blopens" par défaut).
- Sauvegarde avant refonte : localStorage `__esAllBackup_20261119` (onglet advertising.amazon.es).
- Arborescence + homepage FAITES en brouillon : copie du DE via ES/de_recipe.json (sections FR référencées par widgetId + diffs DE), textes traduits en espagnol, "Collection Sequins" non traduit (nom de gamme). Anciennes pages ES supprimées : Glitterizz, Construcción, Sky Dancers, Fabrikid, Cocina creativa, Juegos de acción, Totem, Actividades manuales.
- Visuels ES FAITS (19/11) : 15 visuels traduits (ES/*.jpg, correspondance dans ES/chats.tsv), uploadés et remplacés dans Blopens (homepage), BLOPENS, MANUALIDADES CREATIVAS, POR EDAD. Bannières : ChatGPT renvoie un fichier PNG 3000x600 (bouton « Ouvrir l'aperçu »), pas une image générée.
- DE 19/11 : retirés B0H4W1SZWL (Bizzikins, photo NEUHEITEN), B0D9HJSF5Q, B0D9HKDDDN ; "KOLLEKTION SEQUINS" remis en "COLLECTION SEQUINS".

- Builder FR : https://advertising.amazon.fr/builder/store?entityId=ENTITYV7AQV2Q8AH3W&subEntityId=ENTITY336EEXEJUQJM7 (attention, ouvre une vieille version par défaut : choisir "Lansay MAJ FA26").
- Builder DE : https://advertising.amazon.de/builder/store?entityId=ENTITYASTEFSGHUOXZ&subEntityId=ENTITY5KM28XMPR73V (version "Lansay Multi 2023 DE").

## 19/11 fin de journée
- ES : header homepage (store.widgets.header, image b3ba61db) remis sur toutes les pages ; règle ASIN morts appliquée.
- DE : règle ASIN morts appliquée (brouillon).
- Règle ASIN « Définitivement indisponible » / « Annulé » (CATA ACTIF) : en bas des grilles + includeOutOfStock=false ; tuiles seules : displayOutOfStockASIN=false ; jamais sur la homepage.
- Penser à reprendre store.widgets.header quand on copie un store (NL).

## IT (19/11)
- Builder IT : https://advertising.amazon.it/builder/store?entityId=ENTITYUEHMRCFVY8G9&subEntityId=ENTITY18TAWWT4GMLGQ, version "LANSAY", edition '' , storeId 06A12867-8784-4965-8060-5D20BEE51D46. Sauvegarde : localStorage `__itBackup_20261119`.
- Refait comme ES via tools/build_from_recipe.js (recette DE), puis règle ASIN morts, puis tools/fill_grids.js (terr UE). Pages supprimées : jeux de société (+5), Laser X, Pistole laser, Star Academy, Sky Dancers, Make It Real.
- Visuels IT : IT/*.jpg (IT/chats.tsv), remplacés. "PAILLETTES & SEQUINS" gardé tel quel (nom de page IT existant).
- FR 19/11 : règle ASIN morts + grilles complétées (logique évidente seulement, rien de deviné).
- Headers de pages (store.widgets.header) : un par page, comme en DE (pas le header Lansay partout). tools/set_headers.js. Faits ES + IT le 19/11 (nouveaux visuels : hdr_ofertas/munecas/manualidades, hdr_offerte/bambole/hobby).

## BE (FAIT en brouillon 20/11)
- Territoires autorisés BE : UE, "FR + BE", "FR + BE + NL", "FR + BE + DE + NL" (cata_actif.json, champ t).
- Copier le FR FA26 (textes et visuels FR d'origine), filtrer sur ces territoires, puis : règle ASIN morts, tools/fill_grids.js (map des titres BE, terr ci-dessus), headers par page (tools/set_headers.js ou headers FR), header Lansay root, image « fabrication française » gardée (FR + BE).
- Vérifier d'abord la langue du store BE et la version à modifier ; sauvegarder en localStorage avant toute écriture.
- 20/11 : BE (advertising.amazon.com.be, entity ENTITY38BGWWXLQTH5E / ENTITY2GB5DK1NYMKX8, version "LANSAY" sans date de fin, edition '', storeId 94F4D032-42E5-414F-B5C8-16AC989DAC67, store en FR). Sauvegarde : localStorage `__beAllBackup_20261120`.
- Copie intégrale du FR FA26 (export complet BE/../fr_fa26_all_20261120.json via tools/build_be.py -> BE/be_build.json), IDs BE réutilisés par titre. Supprimées : PISTOLET LASER, LASER X (100% FR only), CUISINE CREATIVE - Mini délices, MON BEBE CABRIOLES (sans équivalent FR). STAR ACADEMY gardée (produits FR + BE sauf le jeu).
- FR only retirés (grilles et tuiles). Homepage : 2 tuiles Hotel -> JUKKO / BAC FLIP (pas de doublon sur la page, sauf grille finale) ; tuile morte Pixelo Stitch retirée. JEUX DE SOCIETE : J'EMME retiré (rangée 8 -> 7), rangée visuel Hotel supprimée. JEUX DE STRATEGIE : rangées Hotel et J'EMME supprimées. JEUX TV : Star Academy retiré. PAR MARQUE : tuile Laser X retirée.
- fill_grids (terr BE) : rien à ajouter. Doublons de tuiles et lien cassé FC2B7F53 (6-7 ANS, homepage) hérités du FR, non modifiés.
- Piège 20/11 : supprimer une page (deleted:true) avec son ANCIEN pageData réinjecte l'ancienne nav -> builder en erreur ('reading nav'). Toujours supprimer avec la NOUVELLE nav, puis resauver root en dernier.
- Piège 20/11 (2) : une NOUVELLE page sauvée avec parentPageId:'' renvoie 200 mais n'existe pas (getPageData 424) -> soumission impossible. Créer les nouvelles pages avec parentPageId = parent dans la nav.
