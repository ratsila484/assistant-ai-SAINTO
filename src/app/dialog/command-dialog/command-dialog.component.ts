import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ConfirmerDialogComponent } from '../confirmer-dialog/confirmer-dialog.component';

interface Article {
  id: string | number;
  nom: string;
}

interface ArticleCommande {
  nom: string;
  nb: number;
}
@Component({
  selector: 'app-command-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './command-dialog.component.html',
  styleUrl: './command-dialog.component.css'
})



export class CommandDialogComponent implements OnInit {
  articleCommander: string = "";
  nbArticle: number = 0;
  typeArticle = "mado";
  selectedArticleId: string | number = '';
  quantiteNonValide: boolean = false;



  listeArticleMado = [
    {
      id: 1,
      nom: "SAINTO 1.5L",
      prix: 2291.66
    },
    {
      id: 2,
      nom: "SAINTO 1L",
      prix: 1388.33
    },
    {
      id: 3,
      nom: "SAINTO 0.5L",
      prix: 1180
    },
    {
      id: 4,
      nom: "SAINTO 5L",
      prix: 4166.66
    },
    {
      id: 5,
      nom: "Bonbonne 1ère Livraison",
      prix: 73333.33
    },
    {
      id: 6,
      nom: "Bonbonne Recharge",
      prix: 30000
    },
    {
      id: 7,
      nom: "ICE TEA pomme 1.5L",
      prix: 6805
    },
    {
      id: 8,
      nom: "ICE TEA pêche 1.5L",
      prix: 6805
    },
    {
      id: 9,
      nom: "ICE TEA citron 1.5L",
      prix: 6805
    },
    {
      id: 10,
      nom: "ICE TEA pomme 0.5L",
      prix: 2916.66
    },
    {
      id: 11,
      nom: "ICE TEA pêche 0.5L",
      prix: 2916.66
    },
    {
      id: 12,
      nom: "ICE TEA citron 0.5L",
      prix: 2916.66
    },
  ]

  listeArticleGamo = [
    { id: 1, nom: "Eau de javel", prix: 2400 },
    { id: 2, nom: "EAU DE JAVEL 1L", prix: 3300 },
    { id: 4, nom: "D-KRASS vert 1l", prix: 2200 },
    { id: 6, nom: "Blunett Bleu 1L", prix: 3300 },
    { id: 8, nom: "LAVE-VITRE 1L", prix: 3000 },
    { id: 9, nom: "colle blanche ufix 2050 seau de 04 kg", prix: 64000 },
    { id: 10, nom: "colle blanche ufix 2050 seau de 500grs", prix: 8800 },
    { id: 12, nom: "Colle de bureau UNICOLLE 120 cc", prix: 1600 },
    { id: 13, nom: "Colle de bureau UNICOLLE 30 cc", prix: 1000 },
    { id: 14, nom: "Colle de bureau UNICOLLE 60 cc", prix: 1300 },
    { id: 15, nom: "Colle de bureau UNICOLLE 90 cc", prix: 1500 },
    { id: 17, nom: "Encaustique CIRABRIL Acajou 400cc", prix: 8100 },
    { id: 18, nom: "Encaustique CIRABRIL Acajou GM", prix: 82300 },
    { id: 19, nom: "Encaustique CIRABRIL AP Neutre 400CC", prix: 9200 },
    { id: 20, nom: "Encaustique CIRABRIL AP Neutre GM", prix: 77500 },
    { id: 21, nom: "Encaustique CIRABRIL Rouge ciment 400C", prix: 8400 },
    { id: 22, nom: "Encaustique CIRABRIL Rouge ciment GM", prix: 77400 },
    { id: 23, nom: "Encaustique CIRABRIL AP Jaune 400CC", prix: 9200 },
    { id: 24, nom: "Encaustique CIRABRIL AP Jaune GM", prix: 77500 },
    { id: 25, nom: "Enduitbat sac de 1 kg", prix: 2500 },
    { id: 26, nom: "Enduitbat sac de 10 kg", prix: 16700 },
    { id: 27, nom: "Enduitbat sac de 2 kg", prix: 4300 },
    { id: 28, nom: "Enduitbat sac de 5 kg", prix: 10300 }
  ];

  // Liste pour stocker les articles commandés
  listeCommande: ArticleCommande[] = [];

  constructor(
    public dialogRef: MatDialogRef<CommandDialogComponent>,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // Sélectionner le premier article par défaut
    if (this.listeArticleMado.length > 0) {
      this.selectedArticleId = this.listeArticleMado[0].id;
    }
  }

  ajouterArticle(): void {
    // Vérifier si un nombre valide a été entré
    if (this.nbArticle <= 0) {
      this.quantiteNonValide = true;
      return;
    }
    this.quantiteNonValide = false;

    // Récupérer l'article sélectionné
    let articleSelectionne: Article | undefined;
    console.log(this.typeArticle);
    if (this.typeArticle === 'mado') {
      for (let i = 0; i < this.listeArticleMado.length; i++) {
        if (this.listeArticleMado[i].id == this.selectedArticleId) {
          articleSelectionne = this.listeArticleMado[i];
          console.log(articleSelectionne);
          break;
        }
      }
    } else {
      for (let i = 0; i < this.listeArticleGamo.length; i++) {
        if (this.listeArticleGamo[i].id == this.selectedArticleId) {
          articleSelectionne = this.listeArticleGamo[i];
          console.log(articleSelectionne);
          break;
        }
      }
    }

    if (articleSelectionne) {
      // Vérifier si l'article existe déjà dans la liste de commande
      const index = this.listeCommande.findIndex(a => a.nom === articleSelectionne!.nom);

      if (index !== -1) {
        // Si l'article existe déjà, mettre à jour la quantité
        this.listeCommande[index].nb += this.nbArticle;
      } else {
        // Sinon, ajouter le nouvel article à la liste
        this.listeCommande.push({
          nom: articleSelectionne.nom,
          nb: this.nbArticle
        });
      }

      // Réinitialiser le nombre d'articles
      this.nbArticle = 1;
    }

    console.log(this.listeCommande);
  }

  supprimerArticle(index: number): void {
    this.listeCommande.splice(index, 1);
  }

  // Méthode pour finaliser la commande si nécessaire
  validerCommande(): void {
    // Traitement final de la commande
    console.log('Commande validée:', this.listeCommande);
    // Fermer la boîte de dialogue
    this.dialogRef.close(this.listeCommande);
  }

  valider() {

    console.log(this.listeCommande);
    // Vérifier s'il y a des articles dans la commande
    if (this.listeCommande.length === 0) {
      // alert('Veuillez ajouter au moins un article à votre commande');
      return;
    }

    this.dialogRef.close(this.listeCommande);

  }

  fermer() {
    this.dialogRef.close(false);
  }

}
