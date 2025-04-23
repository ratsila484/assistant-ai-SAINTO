import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-all-produits',
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './all-produits.component.html',
  styleUrl: './all-produits.component.css'
})
export class AllProduitsComponent {
  constructor(
    private dialogRef: MatDialogRef<AllProduitsComponent>
  ) { }
  listeArticleMado = [
    {
      id: 1,
      nom: "SAINTO 1.5L",
      prix: 2291.66,
      img: "products/sainto1.5l.webp"
    },
    {
      id: 2,
      nom: "SAINTO 1L",
      prix: 1388.33,
      img: "products/sainto1l.webp"
    },
    {
      id: 3,
      nom: "SAINTO 0.5L",
      prix: 1180,
      img: "products/sainto0.5l.webp"
    },
    {
      id: 4,
      nom: "SAINTO 5L",
      prix: 4166.66,
      img: ""
    },
    {
      id: 5,
      nom: "Bonbonne 1ère Livraison",
      prix: 73333.33,
      img: "products/bbn.webp"
    },
    {
      id: 6,
      nom: "Bonbonne Recharge",
      prix: 30000,
      img: "products/bbn.webp"
    },
    {
      id: 7,
      nom: "ICE TEA pomme 1.5L",
      prix: 6805,
      img: "products/pomme1.5l.webp"
    },
    {
      id: 8,
      nom: "ICE TEA pêche 1.5L",
      prix: 6805,
      img: "products/peche1.5l.webp"
    },
    {
      id: 9,
      nom: "ICE TEA citron 1.5L",
      prix: 6805,
      img: "products/citron1.5l.webp"
    },
    {
      id: 10,
      nom: "ICE TEA pomme 0.5L",
      prix: 2916.66,
      img: "products/pomme0.5l.webp"
    },
    {
      id: 11,
      nom: "ICE TEA pêche 0.5L",
      prix: 2916.66,
      img: "products/peche0.5l.webp"
    },
    {
      id: 12,
      nom: "ICE TEA citron 0.5L",
      prix: 2916.66,
      img: "products/citron0.5l.webp"
    },
  ]

  listeArticleGamo = [
    { id: 1, nom: "Eau de javel", prix: 2400 },
    { id: 2, nom: "EAU DE JAVEL 1L", prix: 3300 },
    { id: 3, nom: "EAU DE JAVEL EN VRAC", prix: 2400 },
    { id: 4, nom: "D-KRASS vert 1l", prix: 2200 },
    { id: 5, nom: "DK vert en vrac", prix: 2400 },
    { id: 6, nom: "Blunett Bleu 1L", prix: 3300 },
    { id: 7, nom: "Bnett en vrac", prix: 2200 },
    { id: 8, nom: "LAVE-VITRE 1L", prix: 3000 },
    { id: 9, nom: "colle blanche ufix 2050 seau de 04 kg", prix: 64000 },
    { id: 10, nom: "colle blanche ufix 2050 seau de 500grs", prix: 8800 },
    { id: 11, nom: "colle blanche ufix 2050 en vrac", prix: 14700 },
    { id: 12, nom: "Colle de bureau UNICOLLE 120 cc", prix: 1600 },
    { id: 13, nom: "Colle de bureau UNICOLLE 30 cc", prix: 1000 },
    { id: 14, nom: "Colle de bureau UNICOLLE 60 cc", prix: 1300 },
    { id: 15, nom: "Colle de bureau UNICOLLE 90 cc", prix: 1500 },
    { id: 16, nom: "colle unicolle en vrac", prix: 6900 },
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

  typeArticle: string = "mado";
  fermer() {
    this.dialogRef.close(false);
  }
}
