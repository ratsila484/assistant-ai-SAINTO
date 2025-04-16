import { isPlatformBrowser, NgClass } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommandDialogComponent } from '../../dialog/command-dialog/command-dialog.component'
import { ChatMessage, ChatService } from '../../services/chat.service';
import { Observable } from 'rxjs';
import { DialogDevisComponent } from '../../dialog/dialog-devis/dialog-devis.component';
import { DevisMadamaComponent } from '../../dialog/devis-madama/devis-madama.component';
import { FormulaireDialogComponent } from '../../dialog/formulaire-dialog/formulaire-dialog.component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import emailjs, { send } from 'emailjs-com';
import { AllProduitsComponent } from '../../dialog/all-produits/all-produits.component';

@Component({
  selector: 'app-chat-if',
  imports: [
    FormsModule,
    NgClass
  ],
  templateUrl: './chat-if.component.html',
  styleUrl: './chat-if.component.css'
})
export class ChatIfComponent implements OnInit {
  isLoading: boolean = false;
  messages: { text: string, from: 'bot' | 'user' }[] = []
  userInput: string = "";
  message$: any;
  newMessage: string = '';
  demandeConfirmationCommande: boolean = false;
  showDevis: boolean = false;
  devisInfo: any = null;
  articleCommander: ({ nom: string, nb: number })[] = [];
  infoClient: any[] = [];
  totalPrix: number = 0;
  allFunction: boolean = false;

  //historiques commande
  historiqueCommandes: any[] = [];
  commandeEnCours: any = null;
  isNotValide: boolean = false;
  isReconfirmation = false;
  //inactivité
  private inactivityTimer: any;// 5 minutes

  constructor(
    private dialog: MatDialog,
    private chatService: ChatService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.message$ = this.chatService.messages$;
  }

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
  listeArticle = [
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
    { id: 1, nom: "Eau de javel", prix: 2400 },
    { id: 2, nom: "EAU DE JAVEL 1L", prix: 3300 },
    { id: 3, nom: "EAU DE JAVEL EN VRAC", prix: 2400 },
    { id: 4, nom: "D-KRASS vert 1l", prix: 2200 },
    { id: 5, nom: "D-KRASS vert en vrac", prix: 2400 },
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
  ]

  // Nouvelle méthode pour enregistrer l'historique des commandes
  enregistrerCommande(commande: any): void {
    this.historiqueCommandes.push({
      ...commande,
      date: new Date(),
      status: 'En attente de validation'
    });

    // Mise à jour de la commande en cours
    this.commandeEnCours = {
      ...commande,
      reference: `CMD-${Date.now().toString().slice(-6)}`,
      estimationLivraison: this.getEstimationLivraison()
    };

    // Informer l'utilisateur
    this.addBotMessage(`Votre commande ${this.commandeEnCours.reference} a été enregistrée. Vous recevrez une confirmation par email.`);
  }

  // Méthode pour afficher l'état de la commande
  afficherEtatCommande(reference?: string): void {
    if (this.commandeEnCours) {
      this.addBotMessage(`État de votre commande ${this.commandeEnCours.reference}: ${this.commandeEnCours.status}. Livraison prévue le ${this.commandeEnCours.estimationLivraison}.`);
    } else {
      this.addBotMessage("Vous n'avez pas de commande en cours. Souhaitez-vous passer une nouvelle commande?");
    }
  }

  ngOnInit(): void {
    this.messages.push({
      text: `Bonjour , je suis l'assistant commerciale du groupe GAMO/MADO
        Les boutons en haut sont là pour faciliter la communication entre vous et moi😊
      `, from: "bot"
    })

    // Ajouter la gestion de l'inactivité
    // this.resetInactivityTimer();

  }

  // Méthode pour réinitialiser le minuteur d'inactivité
  // private resetInactivityTimer(): void {
  //   clearTimeout(this.inactivityTimer);
  //   this.inactivityTimer = setTimeout(() => {
  //     if (this.messages.length > 1) { // Si une conversation a déjà eu lieu
  //       this.addBotMessage("Êtes-vous toujours là? Je suis disponible pour vous aider.");
  //     }
  //   }, this.INACTIVITY_TIMEOUT);
  // }

  // N'oubliez pas de nettoyer dans ngOnDestroy



  // Ajouter cette méthode
  rechercherProduits(terme: string): any[] {
    if (!terme.trim()) return [];

    terme = terme.toLowerCase().trim();
    return this.listeArticle.filter(article =>
      article.nom.toLowerCase().includes(terme)
    );
  }

  // Ajouter cette méthode pour suggérer des produits similaires
  suggererProduitsSimilaires(produit: string): void {
    const suggestions = this.rechercherProduits(produit).slice(0, 3);

    if (suggestions.length > 0) {
      let message = "Vous pourriez également être intéressé par: ";
      suggestions.forEach((item, index) => {
        message += item.nom;
        if (index < suggestions.length - 1) message += ", ";
      });
      this.addBotMessage(message);
    }
  }

  // Fonction pour gérer les boutons d'action rapide
  handleQuickAction(action: string): void {
    switch (action) {
      case 'commande':
        this.messages.push({
          text: "Commande",
          from: 'user'
        })
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
          this.addBotMessage("Commande en cours ...😁");
        }, 1000);
        this.openCommandeDialog();
        break;
      case 'devis':
        this.messages.push({
          text: "Demande de devis d'un article",
          from: 'user'
        })
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = true;
          this.addBotMessage("Ouverture du demande de devis ...");
        }, 2000);
        setTimeout(() => {
          const dia = this.dialog.open(DevisMadamaComponent);
          dia.afterClosed().subscribe(result => {
            this.isLoading = true;
            setTimeout(() => {
              this.isLoading = false;
              this.addBotMessage(`Demande de devis fermé ...`);
            }, 1000);
            this.isLoading = false;
          })
        }, 3000)
        break;
      case 'apropos':
        this.addBotMessage("MADO/GAMO est votre partenaire de confiance pour tous vos besoins en menuiserie et aménagement. Notre entreprise fondée en 2005 s'engage à fournir des produits de qualité supérieure et un service client exceptionnel. Que puis-je vous dire de plus sur notre entreprise?");
        break;
      case 'produits':
        this.messages.push({
          text: "Demande de catalogues de tous vos produits ",
          from: 'user'
        })
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
          this.addBotMessage("Affichage de tous les catalogues de produits en cours ...👌");
        }, 2000)
        this.isLoading = true
        setTimeout(() => {
          this.isLoading = false;
          this.afficherProduits();
        }, 4000)
        break;
      case 'find':
        this.messages.push({
          text: "Je cherche un produit ...",
          from: 'user'
        })
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
          this.addBotMessage("Ok, dite moi qu'elle produit vous chercher ? (donnez seulement le nom svp🫡)");
        }, 2000)
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
          this.rechercherProduits(this.messages[this.messages.length - 1].text);
        }, 3000)
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
          this.suggererProduitsSimilaires(this.messages[this.messages.length - 1].text);
        }, 1000)

    }
  }

  envoyerMessage() {
    if (this.userInput.trim() === '') return;

    // Ajouter le message de l'utilisateur
    this.messages.push({
      from: 'user',
      text: this.userInput
    });

    const userQuestion = this.userInput;
    this.userInput = ''; // Réinitialiser l'input

    if (this.isReconfirmation) {
      if (userQuestion.toLowerCase() == "oui" ||
        userQuestion.toLowerCase() == "je confirme" ||
        userQuestion.toLowerCase() == "yes" ||
        userQuestion.toLowerCase() == "ok" ||
        userQuestion.toLowerCase() == "eny" ||
        userQuestion.toLowerCase() == "ekena" ||
        userQuestion.toLowerCase() == "manaiky" ||
        userQuestion.toLowerCase() == "👌" ||
        userQuestion.toLowerCase() == "cool" ||
        userQuestion.toLowerCase() == "ekeko" ||
        userQuestion.toLowerCase() == "confirme"
      ) {
        // Envoyer la commande seulement à cette étape finale
        this.envoyerCommande(
          this.articleCommander,
          this.devisInfo.totalHT,
          this.devisInfo.client.nom,
          this.devisInfo.client.email,
          this.devisInfo.client.adresse,
          this.devisInfo.client.telephone
        );
        return;
      }
    }

    if (this.traiterQuestionFrequente(userQuestion)) {
      return;
    }
    //simulation des question du client
    if (userQuestion.toLowerCase() == "bonjour" ||
      userQuestion.toLowerCase() == "salut" ||
      userQuestion.toLowerCase() == "manaona" ||
      userQuestion.toLowerCase() == "kez" ||
      userQuestion.toLowerCase() == "hello" ||
      userQuestion.toLowerCase() == "hi" ||
      userQuestion.toLowerCase() == "bonjour " ||
      userQuestion.toLowerCase() == "salut " ||
      userQuestion.toLowerCase() == "manaona " ||
      userQuestion.toLowerCase() == "kez " ||
      userQuestion.toLowerCase() == "hello " ||
      userQuestion.toLowerCase() == "hi "
    ) {
      this.allFunction = true;
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.addBotMessage(`Bonjour, que puis-faire pour vous 😊?`);
      }, 1000);
      this.isLoading = false;
    }

    //demande de devis ou commande ou nous
    this.demandeOptionHaut(userQuestion);

    if (this.demandeConfirmationCommande) {
      this.allFunction = true;

      if (userQuestion.toLowerCase() == "oui" || userQuestion.toLowerCase() == "je confirme" ||
        userQuestion.toLowerCase() == "confirme" || userQuestion.toLowerCase() == "ok" ||
        userQuestion.toLowerCase() == "yes" || userQuestion.toLowerCase() == "ie" || userQuestion.toLowerCase() == "eny" ||
        userQuestion.toLowerCase() == "eny tompoko" ||
        userQuestion.toLowerCase() == "confirme " || userQuestion.toLowerCase() == "ok " ||
        userQuestion.toLowerCase() == "yes " || userQuestion.toLowerCase() == "ie " || userQuestion.toLowerCase() == "eny " ||
        userQuestion.toLowerCase() == "eny tompoko "
      ) {
        this.isLoading = false;
        setTimeout(() => {
          this.isLoading = true;
          this.addBotMessage(`Ok, generation de votre devis ...`);
        }, 1000);
        this.isLoading = false;
        //demande d'info du client
        setTimeout(() => {
          this.isLoading = true;
          this.addBotMessage(`Demande d'information au client `);
        }, 1000);
        this.isLoading = false;

        //ouverture d'un formulaire
        setTimeout(() => {
          this.isLoading = true;
          if (!this.openFormulaire()) {
          };

        }, 1000);
        this.isLoading = false;


      } else if (userQuestion.toLowerCase() == "non" || userQuestion.toLowerCase() == "je ne confirme pas"
        || userQuestion.toLowerCase() == "confirme pas" ||
        userQuestion.toLowerCase() == "non " || userQuestion.toLowerCase() == "je ne confirme pas "
        || userQuestion.toLowerCase() == "confirme pas "
      ) {
        setTimeout(() => {
          this.isLoading = false;
          this.addBotMessage(`Ok , nous vous remercions pour temps 😊`);
        }, 1000);
        this.isLoading = true;
      } else if (userQuestion.toLowerCase() == "état de commande" ||
        userQuestion.toLowerCase() == "precedent commande"
        || userQuestion.toLowerCase() == "mes commandes") {
        this.afficherEtatCommande();
      }
    } else if (!this.allFunction) {
      setTimeout(() => {
        this.isLoading = false;
        this.addBotMessage(`Veuillez choisir entre les options disponible en haut svp 😊`);
      }, 1000);
      this.isLoading = true;
    }
  }

  // Nouvelle méthode pour traiter les questions fréquentes
  private traiterQuestionFrequente(question: string): boolean {
    // Questions sur la livraison
    if (question.includes('livraison') || question.includes('délai') ||
      question.includes('temps') && question.includes('livré')) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.addBotMessage("Nous livrons généralement sous 48h après validation de votre commande. Pour les zones éloignées, un délai supplémentaire peut s'appliquer.");
      }, 1000);
      return true;
    }

    // Questions sur les moyens de paiement
    if (question.includes('paiement') || question.includes('payer') ||
      question.includes('carte') || question.includes('espèce')) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.addBotMessage("Nous acceptons plusieurs modes de paiement: espèces, cartes bancaires, virements, et mobile money (MVola, Orange Money, Airtel Money).");
      }, 1000);
      this.isLoading = true;
      return true;
    }

    // Questions sur les coordonnées/localisation
    if (question.includes('adresse') || question.includes('où') ||
      question.includes('localisation') || question.includes('situé')) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.addBotMessage("Notre boutique principale est située à Ampasampito, Antananarivo. Vous pouvez nous contacter au +261 34 XX XXX XX pour plus de détails.");
      }, 1000);
      this.isLoading = true;
      return true;
    }

    // Prix des produits spécifiques
    if (question.includes('prix') || question.includes('coûte') || question.includes('tarif')) {
      const produits = this.rechercherProduits(question);
      if (produits.length > 0) {
        this.isLoading = false;
        setTimeout(() => {
          this.isLoading = true;
          let message = "Voici les prix des produits que vous recherchez:\n";
          produits.slice(0, 3).forEach(p => {
            message += `- ${p.nom}: ${p.prix.toLocaleString('fr-FR')} Ar\n`;
          });
          this.addBotMessage(message);
        }, 1000);
        this.isLoading = true;
        return true;
      }
    }

    return false; // Question non traitée
  }
  demandeOptionHaut(questions) {
    let question = questions.toLowerCase();
    if (question.includes('devis')) {
      this.allFunction = true;
      this.isLoading = false;
      setTimeout(() => {
        this.isLoading = false;
        this.addBotMessage(` Patientez un peut svp 😊 ...`);
      }, 3000);
      this.isLoading = true;

      //generation du devis
      const d = this.dialog.open(DevisMadamaComponent)
      d.afterClosed().subscribe(result => {
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
          this.addBotMessage(`Demande de devis fermé ...`);
        }, 1000);
        this.isLoading = true;
      })
    } else if (question.includes('commander') ||
      question.includes('je veux') || question.includes('acheter')
      || question.includes('commande') || question.includes('hividy')
      || question.includes('commandy') || question.includes('kiomandy') ||
      question.includes('hicommandy') ||
      question.includes('je veux ') || question.includes('acheter ')
      || question.includes('commande ') || question.includes('hividy ')
      || question.includes('commandy ') || question.includes('kiomandy ') ||
      question.includes('hicommandy ')
    ) {
      this.allFunction = true;
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.openCommandeDialog();
      }, 2000);
      this.isLoading = true;
    } else if (
      question.includes('produits') ||
      question.includes('produit') ||
      question.includes('catalogues') ||
      question.includes('catalogue') ||
      question.includes('entana') ||
      question.includes('product') ||
      question.includes('goods') ||
      question.includes('marchandises') ||
      question.includes('marchandise') ||
      question.includes('produits ') ||
      question.includes('produit ') ||
      question.includes('catalogues ') ||
      question.includes('catalogue ') ||
      question.includes('entana ') ||
      question.includes('product ') ||
      question.includes('goods ') ||
      question.includes('marchandises ') ||
      question.includes('marchandise ')
    ) {
      this.allFunction = true;
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.afficherProduits();
      }, 1000);
      this.isLoading = true;
    }
    else {
      return;
    }
  }

  // Fonction pour ajouter un message du bot
  addBotMessage(text: string): void {
    this.messages.push({
      from: 'bot',
      text: text
    });



    // Faire défiler vers le bas pour montrer le nouveau message
    setTimeout(() => {
      const chatBox = document.querySelector('.chat-messages');
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }, 100);

  }



  //commande 
  openCommandeDialog() {
    try {
      this.isReconfirmation = false;
      const dialogRef = this.dialog.open(CommandDialogComponent);
      //recuperer la valeur du dialog
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // this.enregistrerCommande(result)
          this.articleCommander = result;
          this.demandeConfirmationCommande = true;
          //transformer le tableau en texte
          let textCommande = "";
          result.forEach(element => {
            textCommande = textCommande + element.nom + " " + element.nb + " unité(s) "
          });
          //ajout au texte du bot
          this.messages.push({
            text: `Commande de ${textCommande}`,
            from: 'user'
          })
          setTimeout(() => {
            this.isLoading = false;
            this.messages.push({
              text: `Vous confirmer votre commande 😊? (création du devis de votre commande)`,
              from: 'bot'
            })
          }, 1000);
          this.isLoading = true;
        } else {
          setTimeout(() => {
            this.isLoading = false;
            this.messages.push({
              text: `Commande annuler 👌`,
              from: 'bot'
            })
          }, 1000);
          this.isLoading = true;
        }
      })
    }
    catch (error) {
      this.handleDialogError('de l\'ouverture du dialogue de commande');
    }
  }

  //devis
  openDevisDialog() {

  }



  // Fonction pour calculer le prix
  private calculerPrix(produit: string, quantite: number): any {
    // Mapping des produits à leurs prix unitaires HT
    const prixUnitaires: { [key: string]: number } = {
      // Produits MADO
      'SAINTO 1.5L': 2291.66 * 6, // Prix par pack (6 bouteilles)
      'SAINTO 1L': 1388.33 * 6,   // Prix par pack (6 bouteilles)
      'SAINTO 0.5L': 1180 * 8, // Prix par pack (8 bouteilles)
      'SAINTO 5L': 4166.66,       // Prix par bouteille
      'Bonbonne 1ère Livraison': 73333.33,
      'Bonbonne Recharge': 30000,
      'ICE TEA pomme 1.5L  ': 6805 * 6, // Prix par pack (6 bouteilles)
      'ICE TEA citron 1.5L  ': 6805 * 6, // Prix par pack (6 bouteilles)
      'ICE TEA pêche 1.5L  ': 6805 * 6, // Prix par pack (6 bouteilles)
      'ICE TEA pomme 0.5L ': 2916.66 * 8,  // Prix par pack (8 bouteilles)
      'ICE TEA citron 0.5L ': 2916.66 * 8,  // Prix par pack (8 bouteilles)
      'ICE TEA pêche 0.5L ': 2916.66 * 8,  // Prix par pack (8 bouteilles)

      // Produits GAMO
      'Eau de javel': 2400,      // Prix en vrac
      'EAU DE JAVEL 1L': 3300,
      'EAU DE JAVEL EN VRAC': 2400,
      'D-KRASS vert 1l': 2200,
      'DK vert en vrac': 2400,
      'Blunett Bleu 1L': 3300,
      'Bnett en vrac': 2200,
      'LAVE-VITRE 1L': 3000,
      'colle blanche ufix 2050 seau de 04 kg': 64000,
      'colle blanche ufix 2050 seau de 500grs': 8800,
      'colle blanche ufix 2050 en vrac': 14700,
      'Colle de bureau UNICOLLE 120 cc': 1600,
      'Colle de bureau UNICOLLE 30 cc': 1000,
      'Colle de bureau UNICOLLE 60 cc': 1300,
      'Colle de bureau UNICOLLE 90 cc': 1500,
      'colle unicolle en vrac': 6900,
      'Encaustique CIRABRIL Acajou 400cc': 8100,
      'Encaustique CIRABRIL Acajou GM': 82300,
      'Encaustique CIRABRIL AP Neutre 400CC': 9200,
      'Encaustique CIRABRIL AP Neutre GM': 77500,
      'Encaustique CIRABRIL Rouge ciment 400C': 8400,
      'Encaustique CIRABRIL Rouge ciment GM': 77400,
      'Encaustique CIRABRIL AP Jaune 400CC': 9200,
      'Encaustique CIRABRIL AP Jaune GM': 77500,
      'Enduitbat sac de 1 kg': 2500,
      'Enduitbat sac de 10 kg': 16700,
      'Enduitbat sac de 2 kg': 4300,
      'Enduitbat sac de 5 kg': 10300
    };

    // Normalisation du nom du produit pour recherche insensible à la casse
    const normalizedProduit = produit.trim().toLowerCase();

    // Trouver le produit correspondant dans le tableau des prix
    let prixProduit = 0;
    let nomProduitExact = '';

    for (const [nom, prix] of Object.entries(prixUnitaires)) {
      if (normalizedProduit.includes(nom.toLowerCase()) || nom.toLowerCase().includes(normalizedProduit)) {
        prixProduit = prix;
        nomProduitExact = nom;
        break;
      }
    }

    // Vérifier si le produit existe
    if (prixProduit === 0) {
      return {
        success: false,
        message: "Produit non reconnu. Veuillez vérifier le nom du produit."
      };
    }

    const prixHT = prixProduit * quantite;
    const prixTTC = prixHT * 1.2; // Ajouter TVA 20%

    return {
      success: true,
      produit: nomProduitExact || produit, // Utiliser le nom exact si trouvé
      quantite: quantite,
      prixUnitaire: prixProduit,
      prixTotal: prixTTC,
      prixHT: prixHT,
      devise: "Ar"
    };
  }

  openFormulaire() {
    let resultat = false;
    const dialogRef = this.dialog.open(FormulaireDialogComponent);
    //recuperation des info du client
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.infoClient = result;
        let prixTotal = 0;
        for (const item of this.articleCommander) {
          const prixCalcule = this.calculerPrix(item.nom, item.nb);
          if (prixCalcule && prixCalcule.success) {
            prixTotal += prixCalcule.prixHT;
          }
        }
        resultat = true;
        this.genererDevis(this.articleCommander, prixTotal, result[0].nom, result[0].email, result[0].adresse, result[0].num);
      }
      else {
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
          this.messages.push({
            text: "Les informations du clients sont importants et Obligatoire chez nous avant d'éffectuer une commande 😥",
            from: 'bot'
          });
          this.isLoading = true;
        }, 100);
      }
    })
    return resultat;

  }


  genererDevis(produits: Array<{ nom: string, nb: number }>, prixTotalHT: number, nomClient: string, email: string, adresse: string, telephone: string) {
    // Calculer prix TTC
    const prixHT = prixTotalHT;
    const tva = prixHT * 0.2;
    const prixTTC = prixHT * 1.2;
    const numeroDevis = `DEV-${Date.now().toString().slice(-6)}`;
    const dateEmission = new Date().toLocaleDateString('fr-FR');
    const dateValidite = new Date();
    dateValidite.setDate(dateValidite.getDate() + 30);

    // Créer les articles du devis
    const articles = produits.map(item => {
      const prixUnitaire = this.getPrixUnitaire(item.nom);
      return {
        designation: item.nom,
        quantite: item.nb,
        prixUnitaireHT: prixUnitaire,
        totalHT: prixUnitaire * item.nb
      };
    });

    // Créer l'objet devis
    this.devisInfo = {
      numeroDevis: numeroDevis,
      dateEmission: dateEmission,
      dateValidite: dateValidite.toLocaleDateString('fr-FR'),
      client: {
        nom: nomClient,
        email: email,
        telephone: telephone,
        adresse: adresse
      },
      articles: articles,
      totalHT: prixHT,
      tva: tva,
      totalTTC: prixTTC,
      conditions: "Livraison sous 48h après validation du devis. Validité du devis : 30 jours."
    };

    // Afficher le devis
    this.showDevis = true;
  }

  //calcule du prix
  private getPrixUnitaire(produit: string): number {
    const prixUnitaires: { [key: string]: number } = {
      // Produits MADO
      'SAINTO 1.5L': 2750 * 6, // Prix par pack (6 bouteilles)
      'SAINTO 1L': 1666 * 6,   // Prix par pack (6 bouteilles)
      'SAINTO 0.5L': 1416 * 8, // Prix par pack (8 bouteilles)
      'SAINTO 5L': 5000,       // Prix par bouteille
      'Bonbonne 1ère Livraison': 88000,
      'Bonbonne Recharge': 36166,
      'ICE TEA pomme 1.5L ': 8166 * 6, // Prix par pack (6 bouteilles)
      'ICE TEA citron 1.5L': 8166 * 6, // Prix par pack (6 bouteilles)
      'ICE TEA pêche   1.5L': 8166 * 6, // Prix par pack (6 bouteilles)
      'ICE TEA pomme 0.5L': 3500 * 8,  // Prix par pack (8 bouteilles)
      'ICE TEA citron 0.5L': 3500 * 8,  // Prix par pack (8 bouteilles)
      'ICE TEA pêche 0.5L': 3500 * 8,   // Prix par pack (8 bouteilles)

      // Produits GAMO
      'Eau de javel': 2400,      // Prix en vrac
      'EAU DE JAVEL 1L': 3300,
      'EAU DE JAVEL EN VRAC': 2400,
      'D-KRASS vert 1l': 2200,
      'DK vert en vrac': 2400,
      'Blunett Bleu 1L': 3300,
      'Bnett en vrac': 2200,
      'LAVE-VITRE 1L': 3000,
      'colle blanche ufix 2050 seau de 04 kg': 64000,
      'colle blanche ufix 2050 seau de 500grs': 8800,
      'colle blanche ufix 2050 en vrac': 14700,
      'Colle de bureau UNICOLLE 120 cc': 1600,
      'Colle de bureau UNICOLLE 30 cc': 1000,
      'Colle de bureau UNICOLLE 60 cc': 1300,
      'Colle de bureau UNICOLLE 90 cc': 1500,
      'colle unicolle en vrac': 6900,
      'Encaustique CIRABRIL Acajou 400cc': 8100,
      'Encaustique CIRABRIL Acajou GM': 82300,
      'Encaustique CIRABRIL AP Neutre 400CC': 9200,
      'Encaustique CIRABRIL AP Neutre GM': 77500,
      'Encaustique CIRABRIL Rouge ciment 400C': 8400,
      'Encaustique CIRABRIL Rouge ciment GM': 77400,
      'Encaustique CIRABRIL AP Jaune 400CC': 9200,
      'Encaustique CIRABRIL AP Jaune GM': 77500,
      'Enduitbat sac de 1 kg': 2500,
      'Enduitbat sac de 10 kg': 16700,
      'Enduitbat sac de 2 kg': 4300,
      'Enduitbat sac de 5 kg': 10300
    };

    // Normalisation du nom du produit pour recherche insensible à la casse
    const normalizedProduit = produit.trim().toLowerCase();
    console.log("normalize : " + normalizedProduit);
    // Trouver le produit correspondant dans le tableau des prix
    for (const [nom, prix] of Object.entries(prixUnitaires)) {
      console.log("tous les prix : " + Object.entries(prixUnitaires))
      if (normalizedProduit.includes(nom.toLowerCase()) || nom.toLowerCase().includes(normalizedProduit)) {
        console.log(nom + " prix : " + prix)
        return prix;
      }
    }
    return 0;
    // Retourne 0 si le produit n'est pas trouvé
  }

  // Fermer le devis
  fermerDevis() {
    this.showDevis = false;



    // Ajouter un message automatique après la fermeture du devis
    this.isLoading = false;
    setTimeout(() => {
      this.isLoading = true;
      this.messages.push({
        text: "Votre devis a été fermé...",
        from: 'bot'
      });

    }, 100);

    this.isLoading = false;
    setTimeout(() => {
      this.isLoading = true;
      this.messages.push({
        text: "Confirmer-vous la commande ? (une dernière fois 😊)",
        from: 'bot'
      });
      this.isReconfirmation = true;

    }, 100);

    this.isLoading = false;
  }

  reconfirmation() {
    this.isLoading = false;
    setTimeout(() => {
      this.isLoading = true;
      this.messages.push({
        text: "Avant d'enregistrer , confirmez-vous cette commande ?",
        from: 'bot'
      });

    }, 1000);

    this.isLoading = true;
  }
  // Modification 5: Mise à jour de la fonction telechargerDevis pour afficher plusieurs lignes
  telechargerDevis() {
    if (!this.devisInfo) return;

    // Créer un nouvel objet jsPDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // En-tête
    doc.setFontSize(22);
    doc.setTextColor(0, 102, 204);
    doc.text("MADO/GAMO", pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("DEVIS", pageWidth / 2, 30, { align: "center" });

    // Informations du devis
    doc.setFontSize(10);
    doc.text(`N° Devis: ${this.devisInfo.numeroDevis}`, 15, 45);
    doc.text(`Date d'émission: ${this.devisInfo.dateEmission}`, 15, 52);
    doc.text(`Date de validité: ${this.devisInfo.dateValidite}`, 15, 59);

    // Informations client
    doc.setFontSize(12);
    doc.text("Informations Client:", 15, 75);
    doc.setFontSize(10);
    doc.text(`Nom: ${this.devisInfo.client.nom}`, 20, 82);
    doc.text(`Email: ${this.devisInfo.client.email}`, 20, 89);
    doc.text(`Téléphone: ${this.devisInfo.client.telephone}`, 20, 96);
    doc.text(`Adresse: ${this.devisInfo.client.adresse}`, 20, 103);

    // Tableau des articles
    doc.setFontSize(12);
    doc.text("Détails de la commande:", 15, 120);

    // En-têtes du tableau
    doc.setFillColor(240, 240, 240);
    doc.rect(15, 125, pageWidth - 30, 10, 'F');
    doc.setFontSize(10);
    doc.text("Désignation", 20, 132);
    doc.text("Quantité", 90, 132);
    doc.text("Prix unitaire HT", 120, 132);
    doc.text("Total HT", 170, 132);

    // Lignes des articles
    let y = 142;
    for (const article of this.devisInfo.articles) {
      doc.text(article.designation, 20, y);
      doc.text(article.quantite.toString(), 90, y);
      doc.text(`${article.prixUnitaireHT.toLocaleString('fr-FR')} Ar`, 120, y);
      doc.text(`${article.totalHT.toLocaleString('fr-FR')} Ar`, 170, y);

      y += 10;
      // Ajouter une ligne de séparation entre chaque article
      doc.setDrawColor(230, 230, 230);
      doc.line(15, y - 3, pageWidth - 15, y - 3);
    }

    // Ligne de séparation plus marquée avant les totaux
    doc.setDrawColor(200, 200, 200);
    doc.line(15, y, pageWidth - 15, y);

    // Total
    y += 15;
    doc.text("Total HT:", 130, y);
    doc.text(`${this.devisInfo.totalHT.toLocaleString('fr-FR')} Ar`, 170, y);

    y += 7;
    doc.text("TVA (20%):", 130, y);
    doc.text(`${this.devisInfo.tva.toLocaleString('fr-FR')} Ar`, 170, y);

    y += 7;
    doc.setFontSize(12);
    doc.setTextColor(0, 102, 204);
    doc.text("Total TTC:", 130, y);
    doc.text(`${this.devisInfo.totalTTC.toLocaleString('fr-FR')} Ar`, 170, y);

    // Conditions
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    y += 20;
    doc.text("Conditions:", 15, y);
    y += 7;
    doc.text(this.devisInfo.conditions, 20, y);

    // Pied de page
    y += 30;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("MADO/GAMO - Ampasampito - Madagascar", pageWidth / 2, y, { align: "center" });
    doc.text("Contacts: tsilavina484@gmail.com", pageWidth / 2, y + 5, { align: "center" });

    // Télécharger le PDF
    doc.save(`devis_${this.devisInfo.numeroDevis}_${this.devisInfo.client.nom}.pdf`);

    // Fermer la modal après téléchargement
    this.showDevis = false;
    // Ajouter un message automatique après la fermeture du devis
    this.isLoading = false;
    setTimeout(() => {
      this.isLoading = true;
      this.messages.push({
        text: "Votre devis a été fermé... ",
        from: 'bot'
      });

    }, 100);
    this.fermerDevis();
    // Créer l'objet devis
  }

  // Obtenir une estimation de date de livraison (48h après)
  private getEstimationLivraison(): string {
    const date = new Date();
    date.setDate(date.getDate() + 2); // +48h
    return date.toLocaleDateString('fr-FR');
  }

  // Nouvelle fonction pour formater la réponse de prix en cas d'erreur avec l'IA
  private formatPrixResponse(response: any): string {
    if (!response.success) {
      return `Désolé, ${response.message}`;
    }

    return `Prix pour ${response.quantite} ${response.produit}:
- Prix unitaire: ${response.prixUnitaire.toLocaleString('fr-FR')} Ar HT
- Prix HT: ${response.prixHT.toLocaleString('fr-FR')} Ar
- Prix total TTC: ${response.prixTotal.toLocaleString('fr-FR')} Ar TTC

Merci de votre intérêt pour nos produits MADO/GAMO!`;
  }


  // Modification 4: Mise à jour de la fonction envoyerCommande pour gérer plusieurs articles
  envoyerCommande(produits: Array<{ nom: string, nb: number }>, prix: number, nom_client: string, email_client: string, adresse_client: string, numero_tel_client: string) {
    // Formatage des produits pour l'email
    let produitsText = '';
    produits.forEach(item => {
      produitsText += `- ${item.nom}: ${item.nb} unité(s)\n`;
    });

    // Formatage sécurisé du prix
    const prixHT = `${prix.toLocaleString('fr-FR')} Ar HT`;
    const prixTTC = `${(prix * 1.2).toLocaleString('fr-FR')} Ar TTC`;

    const templateParams = {
      to: 'tsilavina484@gmail.com',
      subject: 'Nouvelle commande',
      message: `Nouvelle commande :
Articles :
${produitsText}
Prix total HT : ${prixHT}
Prix total TTC : ${prixTTC}
Client : ${nom_client}
Email : ${email_client}
Téléphone : ${numero_tel_client}
Adresse : ${adresse_client}`
    };

    const serviceID = 'service_pphy19i';
    const templateID = 'template_67lb80k';
    const publicKey = 'DErRj_-naJrrIfgqn';

    emailjs.send(serviceID, templateID, templateParams, publicKey)
      .then(() => {
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
          this.messages.push({
            text: "Nous vous remercions pour votre cooperation 🫡, Au plaisir de vous revoir 😊🤩",
            from: 'bot'
          });

        }, 100);
        this.isLoading = true;
      }, (error) => {
        console.error('Erreur lors de l\'envoi de l\'email ❌ : ', error);
      });

    return true;
  }

  //afficher tous les produits
  afficherProduits() {

    const dialogRef = this.dialog.open(AllProduitsComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.messages.push({
          text: "Catalogue fermer ... , on espère que vous avez trouver votre bonheur😁",
          from: 'bot'
        });

      }, 100);
      this.isLoading = true;
    })
  }

  // Ajouter cette méthode pour gérer les erreurs de dialogue
  private handleDialogError(operation: string): void {
    this.isLoading = false;
    this.addBotMessage(`Désolé, une erreur est survenue lors de ${operation}. Veuillez réessayer.`);
    console.error(`Erreur lors de ${operation}`);
  }
}


