// import { NgClass } from '@angular/common';
// import { Component, ElementRef, ViewChild } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { FunctionDeclaration, GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, SchemaType, Tool } from '@google/generative-ai';
// import emailjs, { send } from 'emailjs-com';
// @Component({
//   selector: 'app-claude',
//   imports: [
//     NgClass,
//     FormsModule
//   ],
//   templateUrl: './claude.component.html',
//   styleUrl: './claude.component.css'
// })
// export class ClaudeComponent {
//   userInput: string = '';
//   messages: { text: string, from: 'user' | 'bot' }[] = [];

//   apiKey: string = 'AIzaSyDBphs9gi7vUDoMZdYMHXCiFxY7Sb8KaRc';
//   chatSession: any;

//   @ViewChild('chatBox') chatBox!: ElementRef;

//   ngOnInit() {
//     this.initializeChat();
//     // Message d'accueil
//     this.messages.push({
//       text: "Bonjour, je suis l'assistant commercial de MADO/GAMO. Comment puis-je vous aider aujourd'hui ?",
//       from: 'bot'
//     });
//   }

//   initializeChat() {
//     const genAI = new GoogleGenerativeAI(this.apiKey);

//     // Définition des fonctions que le modèle peut appeler
//     const passerCommandeFunction: FunctionDeclaration = {
//       name: "passerCommande",
//       description: "Passer une commande de produits SAINTO",
//       parameters: {
//         type: SchemaType.OBJECT,
//         properties: {
//           produit: {
//             type: SchemaType.STRING,
//             description: "Le nom du produit commandé (ex: SAINTO 1.5L, ICE TEA Pêche 0.5L)"
//           },
//           quantite: {
//             type: SchemaType.NUMBER,
//             description: "Nombre de packs ou de bonbonnes commandés"
//           },
//           prix: {
//             type: SchemaType.NUMBER,
//             description: "Prix total de la commande en Ariary"
//           },
//           nomClient: {
//             type: SchemaType.STRING,
//             description: "Nom complet du client"
//           },
//           email: {
//             type: SchemaType.STRING,
//             description: "Adresse email du client pour confirmation"
//           },
//           adresse: {
//             type: SchemaType.STRING,
//             description: "Adresse de livraison"
//           },
//           telephone: {
//             type: SchemaType.STRING,
//             description: "Numéro de téléphone du client"
//           }
//         },
//         required: ["produit", "quantite", "nomClient", "email", "adresse", "telephone"]
//       }
//     };

//     // Nouvelle fonction pour calculer le prix uniquement
//     const calculerPrixFunction: FunctionDeclaration = {
//       name: "calculerPrix",
//       description: "Calculer le prix d'un produit SAINTO sans passer de commande",
//       parameters: {
//         type: SchemaType.OBJECT,
//         properties: {
//           produit: {
//             type: SchemaType.STRING,
//             description: "Le nom du produit (ex: SAINTO 1.5L, ICE TEA Pêche 0.5L)"
//           },
//           quantite: {
//             type: SchemaType.NUMBER,
//             description: "Nombre de packs ou de bonbonnes"
//           }
//         },
//         required: ["produit", "quantite"]
//       }
//     };

//     // Création des outils avec les deux déclarations de fonctions
//     const tools: Tool[] = [
//       {
//         functionDeclarations: [passerCommandeFunction, calculerPrixFunction]
//       }
//     ];

//     // Configuration du modèle avec système d'instruction et outils
//     this.chatSession = genAI.getGenerativeModel({
//       model: 'gemini-1.5-pro',
//       tools: tools,
//       systemInstruction: `Tu es un agent commercial de l'entreprise MADO/GAMO.
// L'entreprise est siégée à Ampasampito qui vend principalement les produits suivants :
//     Les produits MADO (Eau minérale et Ice Tea ...): 
//       - SAINTO 1.5L qui coute 2 750 Ar HT par bouteille
//       - SAINTO 1L qui coute 1 666 Ar HT par bouteille
//       - SAINTO 5L qui coute 5000 Ar par bouteille
//       - SAINTO 0.5L qui coute 1 416 Ar HT par bouteille
//       - Bonbone 1ère Livraison à 88 000 Ar HT
//       - Bonbone recharge qui coute 36 166 Ar HT
//       - FONTAINE GM 
//       - FONTAINE PM 
//       - AQUAVALVE  
//       - POMPE MANUELLE  

//        Dans les produits Mado il y a aussi ICE TEA en plusieurs parfums: Pêche, Pomme, Citron, disponibles en:
//       - ICE TEA 1.5L qui coute 8 166 Ar HT par bouteille
//       - ICE TEA 0.5L qui coute 3 500 Ar HT par bouteille
    
//     Les produis GAMO (Détergent, Lave vitre, Encaustique, Colle...) sont : 
//       colle blanche ufix 2050 seau de 04 kg : 64 000 AR HT
//       colle blanche ufix 2050 seau de 500grs : 8800 AR HT
//       colle blanche ufix 2050 en vrac : 14 700 AR HT
//       Colle de bureau UNICOLLE 120 cc : 1 600 AR HT
//       Colle de bureau UNICOLLE 30 cc : 1 000 AR HT
//       Colle de bureau UNICOLLE 60 cc : 1 300 AR HT
//       Colle de bureau UNICOLLE 90 cc : 1 500 AR HT
//       colle unicolle en vrac : 6 900 AR HT par kilo
//       Eau de javel blanc 2050 en vrac : 2 400 AR HT
//       Encaustique CIRABRIL  Acajou 400cc : 8 100 AR HT
//       Encaustique CIRABRIL  Acajou GM : 82 300 AR HT
//       Encaustique CIRABRIL AP Neutre 400CC : 9 200 AR HT
//       Encaustique CIRABRIL AP Neutre GM : 77 500 AR HT
//       Encaustique CIRABRIL Rouge ciment 400C : 8 400 AR HT
//       Encaustique CIRABRIL Rouge ciment GM : 77 400 AR HT
//       Encaustique CIRABRIL AP Jaune 400CC : 9 200 AR HT
//       Encaustique CIRABRIL AP Jaune GM : 77 500 AR HT
//       Enduitbat sac de 1 kg : 2500 AR HT
//       Enduitbat sac de 10 kg : 16 700 AR HT
//       Enduitbat sac de 2 kg : 4 300 AR HT
//       Enduitbat sac de 5 kg : 10 300 AR HT
//       EAU DE JAVEL EN VRAC : 2 400 AR HT
//       EAU DE JAVEL 1 L : 3 300 AR HT
//       DK vert  en vrac : 2 400 AR HT
//       DK vert 1l Liquide Vaisselle : 2 200 AR HT 
//       Bnett en vrac : 2 200 AR HT
//       Bnett 1Ltr  : 3 300 AR HT
//       LAVE-VITRE 1L : 3 000 AR HT


      
// Règles de vente:
// - Un pack de bouteille 1.5L ou 1L contient 6 bouteilles
// - Un pack de bouteilles 0.5L contient 8 bouteilles
// - SAINTO ne livre que des packs complets, pas de bouteilles individuelles
// - Les livraisons se font 48h après la commande
// -Tous ceux qui sont en VRAC du coté du categories de GAMO sont vendus par kilo 
// -La taxe pour le TTC est 20 %
// IMPORTANT: 
// - Si un client demande simplement de connaitre le prix d'un produit, utilise UNIQUEMENT la fonction calculerPrix.
// - Si un client veut passer une commande complète avec ses coordonnées, utilise UNIQUEMENT la fonction passerCommande.
// - N'utilise jamais la fonction passerCommande pour une simple demande de prix.
// -Si le client demande qu'elle sont les produits que vous vendez , tu reponds simplement qu'on à deux catégorie de produits MADO et GAMO
// -Si le client te demande les produits GAMO tu n'aaffiche pas en une fois tous les produits mais selectionne des petit extrait pour données une idées au client , et tu affiche que c'est encore qu'un petit extrait et si le client te demande les autre produits tu affiche les autres produits
// -Tu ne dois jamais montrer en une fois tous les produits MADO et GAMO ensemble
// -Qaund tu enregistre la commande du client tu dit juste que votre commande a été envoyer et enregistrer avec success chez nous

// Si un client te demande de commander plusieurs articles tu envoie les nom des articles dans le même parametre que produits dans la fonction passerCommandeFonction, et de même pour le nombre de chacun des articles.
// Quand tu réponds aux questions sur les produits, sois précis et poli.`,
//       safetySettings: [
//         {
//           category: HarmCategory.HARM_CATEGORY_HARASSMENT,
//           threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH
//         }
//       ],
//       generationConfig: {
//         temperature: 0.7,
//         topP: 0.95,
//         topK: 40
//       }
//     }).startChat();
//   }

//   async envoyerMessage() {
//     if (!this.userInput.trim()) return;

//     // Ajoute le message utilisateur
//     this.messages.push({ text: this.userInput, from: 'user' });

//     const question = this.userInput;
//     this.userInput = '';

//     try {
//       const result = await this.chatSession.sendMessage(question);
//       const response = result.response;

//       // Vérifier s'il y a un appel de fonction
//       const functionCall = this.extractFunctionCall(response);

//       if (functionCall) {
//         // Traiter l'appel de fonction
//         await this.handleFunctionCall(functionCall, response);
//       } else {
//         // Réponse normale
//         const text = response.text();
//         this.messages.push({ text, from: 'bot' });
//       }

//       // Scroll automatique en bas
//       setTimeout(() => {
//         if (this.chatBox?.nativeElement) {
//           this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
//         }
//       }, 100);
//     } catch (err) {
//       console.error('Erreur:', err);
//       this.messages.push({ text: "Erreur lors de la réponse de l'assistant.", from: 'bot' });
//     }
//   }

//   // Extraire l'appel de fonction de la réponse
//   private extractFunctionCall(response: any): any {
//     try {
//       const candidates = response.candidates;
//       if (candidates && candidates.length > 0) {
//         const parts = candidates[0].content.parts;
//         if (parts && parts.length > 0) {
//           for (const part of parts) {
//             if (part.functionCall) {
//               return part.functionCall;
//             }
//           }
//         }
//       }
//       return null;
//     } catch (error) {
//       console.error("Erreur lors de l'extraction de l'appel de fonction:", error);
//       return null;
//     }
//   }

//   // Gérer l'appel de fonction
//   private async handleFunctionCall(functionCall: any, initialResponse: any) {
//     // const functionName = functionCall.name;
//     // const args = functionCall.args;

//     // let functionResponse: any;

//     // // Exécuter la fonction correspondante
//     // if (functionName === 'passerCommande') {
//     //   functionResponse = this.passerCommande(
//     //     args.produit,
//     //     args.quantite,
//     //     args.prix,
//     //     args.nomClient,
//     //     args.email,
//     //     args.adresse,
//     //     args.telephone
//     //   );

//     //   // Afficher un message sur la commande dans la conversation
//     //   this.messages.push({
//     //     text: `Je traite votre commande de ${args.quantite} ${args.produit} pour ${args.nomClient}...`,
//     //     from: 'bot'
//     //   });
//     // }
//     // else if (functionName === 'calculerPrix') {
//     //   functionResponse = this.calculerPrix(args.produit, args.quantite);

//     //   // Afficher un message sur le calcul de prix dans la conversation
//     //   this.messages.push({
//     //     text: `Je calcule le prix pour ${args.quantite} ${args.produit}...`,
//     //     from: 'bot'
//     //   });
//     // }
//     const functionName = functionCall.name;
//     const args = functionCall.args;

//     let functionResponse: any;

//     // Exécuter la fonction correspondante
//     if (functionName === 'passerCommande') {
//       // Calculer le prix si non fourni
//       let prix = args.prix;
//       if (prix === undefined || prix === null) {
//         try {
//           // Tenter de calculer le prix
//           const prixCalcule = this.calculerPrix(args.produit, args.quantite);
//           if (prixCalcule && prixCalcule.success) {
//             prix = prixCalcule.prixTotal;
//           } else {
//             prix = 0; // Valeur par défaut si le calcul échoue
//           }
//         } catch (e) {
//           prix = 0; // En cas d'erreur
//           console.error("Erreur lors du calcul automatique du prix:", e);
//         }
//       }

//       functionResponse = this.passerCommande(
//         args.produit,
//         args.quantite,
//         prix,
//         args.nomClient,
//         args.email,
//         args.adresse,
//         args.telephone
//       );

//       // Afficher un message sur la commande dans la conversation avec vérification
//       let prixMessage = '';
//       if (prix !== undefined && prix !== null) {
//         prixMessage = ` au prix de ${prix.toLocaleString('fr-FR')} Ar`;
//       }

//       this.messages.push({
//         text: `Je traite votre commande de ${args.quantite} ${args.produit} pour ${args.nomClient}${prixMessage}...`,
//         from: 'bot'
//       });
//     }
//     else if (functionName === 'calculerPrix') {
//       functionResponse = this.calculerPrix(args.produit, args.quantite);

//       // Afficher un message sur le calcul de prix dans la conversation
//       this.messages.push({
//         text: `Je calcule le prix pour ${args.quantite} ${args.produit}...`,
//         from: 'bot'
//       });
//     }

//     // Envoyer le résultat de la fonction au modèle
//     if (functionResponse) {
//       if (functionResponse) {
//         try {
//           // Conversion en chaîne JSON puis analyse pour s'assurer que c'est un objet valide
//           const responseJson = JSON.stringify({
//             functionResponse: {
//               name: functionName,
//               response: functionResponse
//             }
//           });

//           // Envoyer la réponse au modèle sous forme de texte
//           const result = await this.chatSession.sendMessage(responseJson);

//           // Afficher la réponse finale
//           const text = result.response.text();
//           this.messages.push({ text, from: 'bot' });
//         } catch (error) {
//           console.error("Erreur lors de l'envoi de la réponse de fonction:", error);
//           if (functionName === 'passerCommande') {
//             this.messages.push({
//               text: "Demande enregistrée et envoyée vers notre siège, on vous remercie pour votre commande 😊",
//               from: 'bot'
//             });
//           } else {
//             // Pour les erreurs de calcul de prix, afficher le résultat directement
//             try {
//               const prixInfo = this.formatPrixResponse(functionResponse);
//               this.messages.push({
//                 text: prixInfo,
//                 from: 'bot'
//               });
//             } catch (e) {
//               this.messages.push({
//                 text: "Une erreur est survenue lors du calcul du prix. Veuillez réessayer.",
//                 from: 'bot'
//               });
//             }
//           }
//         }
//       }
//     }
//   }

//   // // Fonction pour passer une commande
//   // private passerCommande(produit: string, quantite: number, prix: number, nomClient: string, email: string, adresse: string, telephone: string): any {
//   //   // Envoyer la commande par email
//   //   this.envoyerCommande(produit, quantite, prix, nomClient, email, adresse, telephone);

//   //   // Retourner les informations de la commande
//   //   return {
//   //     success: true,
//   //     numeroCommande: `CMD-${Date.now().toString().slice(-6)}`,
//   //     estimationLivraison: this.getEstimationLivraison(),
//   //     message: "Votre commande a été enregistrée avec succès."
//   //   };
//   // }
//   // Mettez également à jour la signature de la fonction passerCommande pour accepter prix null
//   private passerCommande(produit: string, quantite: number, prix: number | null, nomClient: string, email: string, adresse: string, telephone: string): any {
//     // Envoyer la commande par email avec le prix
//     this.envoyerCommande(produit, quantite, prix, nomClient, email, adresse, telephone);

//     // Retourner les informations de la commande avec vérification du prix
//     return {
//       success: true,
//       numeroCommande: `CMD-${Date.now().toString().slice(-6)}`,
//       estimationLivraison: this.getEstimationLivraison(),
//       prixTotal: prix !== null ? prix : "Non spécifié",
//       message: "Votre commande a été enregistrée avec succès."
//     };
//   }

//   // Fonction pour calculer le prix
//   private calculerPrix(produit: string, quantite: number): any {
//     const prixUnitaires: { [key: string]: number } = {
//       'SAINTO 1.5L': 2750 * 6, // Prix par pack (6 bouteilles)
//       'SAINTO 1L': 1666 * 6,   // Prix par pack (6 bouteilles)
//       'SAINTO 0.5L': 1416 * 8, // Prix par pack (8 bouteilles)
//       'SAINTO 5L': 5000,       // Prix par bouteille
//       'Bonbone 1ere Livraison': 88000,
//       'Bonbone recharge': 36166,
//       'ICE TEA 1.5L': 8166 * 6, // Prix par pack (6 bouteilles)
//       'ICE TEA 0.5L': 3500 * 8  // Prix par pack (8 bouteilles)
//     };

//     // Vérifier si le produit existe
//     if (prixUnitaires[produit] === undefined) {
//       return {
//         success: false,
//         message: "Produit non reconnu. Veuillez vérifier le nom du produit."
//       };
//     }

//     const prixTotal = prixUnitaires[produit] * quantite;

//     return {
//       success: true,
//       produit: produit,
//       quantite: quantite,
//       prixUnitaire: prixUnitaires[produit],
//       prixTotal: prixTotal,
//       devise: "Ar HT"
//     };
//   }

//   // Mettez également à jour la fonction envoyerCommande pour gérer les cas où le prix est null
//   envoyerCommande(nom_article: string, nb_article: number, prix: number | null, nom_client: string, email_client: string, adresse_client: string, numero_tel_client: string) {
//     // Formatage sécurisé du prix
//     let prixFormate = "Non spécifié";
//     if (prix !== undefined && prix !== null) {
//       prixFormate = `${prix.toLocaleString('fr-FR')} Ar`;
//     }

//     const templateParams = {
//       to: 'tsilavina484@gmail.com',
//       subject: 'Nouvelle commande',
//       message: `Nouvelle commande :
// Nom article : ${nom_article}
// Quantité : ${nb_article}
// Prix total : ${prixFormate}
// Client : ${nom_client}
// Email : ${email_client}
// Téléphone : ${numero_tel_client}
// Adresse : ${adresse_client}`
//     };

//     const serviceID = 'service_pphy19i';
//     const templateID = 'template_67lb80k';
//     const publicKey = 'DErRj_-naJrrIfgqn';

//     emailjs.send(serviceID, templateID, templateParams, publicKey)
//       .then(() => {
//         console.log('Commande envoyée par email ✅');
//       }, (error) => {
//         console.error('Erreur lors de l\'envoi de l\'email ❌ : ', error);
//       });

//     return true;
//   }

//   // Obtenir une estimation de date de livraison (48h après)
//   private getEstimationLivraison(): string {
//     const date = new Date();
//     date.setDate(date.getDate() + 2); // +48h
//     return date.toLocaleDateString('fr-FR');
//   }

//   // Nouvelle fonction pour formater la réponse de prix en cas d'erreur avec l'IA
//   private formatPrixResponse(response: any): string {
//     if (!response.success) {
//       return `Désolé, ${response.message}`;
//     }

//     return `Prix pour ${response.quantite} ${response.produit}:
// - Prix unitaire: ${response.prixUnitaire.toLocaleString('fr-FR')} ${response.devise}
// - Prix total: ${response.prixTotal.toLocaleString('fr-FR')} ${response.devise}

// Merci de votre intérêt pour nos produits MADO/GAMO!`;
//   }
// }

import { NgClass } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FunctionDeclaration, GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, SchemaType, Tool } from '@google/generative-ai';
import emailjs, { send } from 'emailjs-com';
@Component({
  selector: 'app-claude',
  imports: [
    NgClass,
    FormsModule
  ],
  templateUrl: './claude.component.html',
  styleUrl: './claude.component.css'
})
export class ClaudeComponent {
  userInput: string = '';
  messages: { text: string, from: 'user' | 'bot' }[] = [];
  showDevis: boolean = false;
  devisInfo: any = null;

  apiKey: string = 'AIzaSyDBphs9gi7vUDoMZdYMHXCiFxY7Sb8KaRc';
  chatSession: any;

  @ViewChild('chatBox') chatBox!: ElementRef;

  ngOnInit() {
    this.initializeChat();
    // Message d'accueil
    this.messages.push({
      text: "Bonjour, je suis l'assistant commercial de MADO/GAMO. Comment puis-je vous aider aujourd'hui ?",
      from: 'bot'
    });
  }

  initializeChat() {
    const genAI = new GoogleGenerativeAI(this.apiKey);

    // Définition des fonctions que le modèle peut appeler
    const passerCommandeFunction: FunctionDeclaration = {
      name: "passerCommande",
      description: "Passer une commande de produits SAINTO",
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          produit: {
            type: SchemaType.STRING,
            description: "Le nom du produit commandé (ex: SAINTO 1.5L, ICE TEA Pêche 0.5L)"
          },
          quantite: {
            type: SchemaType.NUMBER,
            description: "Nombre de packs ou de bonbonnes commandés"
          },
          prix: {
            type: SchemaType.NUMBER,
            description: "Prix total de la commande en Ariary"
          },
          nomClient: {
            type: SchemaType.STRING,
            description: "Nom complet du client"
          },
          email: {
            type: SchemaType.STRING,
            description: "Adresse email du client pour confirmation"
          },
          adresse: {
            type: SchemaType.STRING,
            description: "Adresse de livraison"
          },
          telephone: {
            type: SchemaType.STRING,
            description: "Numéro de téléphone du client"
          }
        },
        required: ["produit", "quantite", "nomClient", "email", "adresse", "telephone"]
      }
    };

    // Nouvelle fonction pour calculer le prix uniquement
    const calculerPrixFunction: FunctionDeclaration = {
      name: "calculerPrix",
      description: "Calculer le prix d'un produit SAINTO sans passer de commande",
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          produit: {
            type: SchemaType.STRING,
            description: "Le nom du produit (ex: SAINTO 1.5L, ICE TEA Pêche 0.5L)"
          },
          quantite: {
            type: SchemaType.NUMBER,
            description: "Nombre de packs ou de bonbonnes"
          }
        },
        required: ["produit", "quantite"]
      }
    };

    // Création des outils avec les deux déclarations de fonctions
    const tools: Tool[] = [
      {
        functionDeclarations: [passerCommandeFunction, calculerPrixFunction]
      }
    ];

    // Configuration du modèle avec système d'instruction et outils
    this.chatSession = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      tools: tools,
      systemInstruction: `Tu es un agent commercial de l'entreprise MADO/GAMO.
L'entreprise est siégée à Ampasampito qui vend principalement les produits suivants :
    Les produits MADO (Eau minérale et Ice Tea ...): 
      - SAINTO 1.5L qui coute 2 750 Ar HT par bouteille
      - SAINTO 1L qui coute 1 666 Ar HT par bouteille
      - SAINTO 5L qui coute 5000 Ar par bouteille
      - SAINTO 0.5L qui coute 1 416 Ar HT par bouteille
      - Bonbone 1ère Livraison à 88 000 Ar HT
      - Bonbone recharge qui coute 36 166 Ar HT
      - FONTAINE GM 
      - FONTAINE PM 
      - AQUAVALVE  
      - POMPE MANUELLE  

       Dans les produits Mado il y a aussi ICE TEA en plusieurs parfums: Pêche, Pomme, Citron, disponibles en:
      - ICE TEA 1.5L qui coute 8 166 Ar HT par bouteille
      - ICE TEA 0.5L qui coute 3 500 Ar HT par bouteille
    
    Les produis GAMO (Détergent, Lave vitre, Encaustique, Colle...) sont : 
      colle blanche ufix 2050 seau de 04 kg : 64 000 AR HT
      colle blanche ufix 2050 seau de 500grs : 8800 AR HT
      colle blanche ufix 2050 en vrac : 14 700 AR HT
      Colle de bureau UNICOLLE 120 cc : 1 600 AR HT
      Colle de bureau UNICOLLE 30 cc : 1 000 AR HT
      Colle de bureau UNICOLLE 60 cc : 1 300 AR HT
      Colle de bureau UNICOLLE 90 cc : 1 500 AR HT
      colle unicolle en vrac : 6 900 AR HT par kilo
      Eau de javel blanc 2050 en vrac : 2 400 AR HT
      Encaustique CIRABRIL  Acajou 400cc : 8 100 AR HT
      Encaustique CIRABRIL  Acajou GM : 82 300 AR HT
      Encaustique CIRABRIL AP Neutre 400CC : 9 200 AR HT
      Encaustique CIRABRIL AP Neutre GM : 77 500 AR HT
      Encaustique CIRABRIL Rouge ciment 400C : 8 400 AR HT
      Encaustique CIRABRIL Rouge ciment GM : 77 400 AR HT
      Encaustique CIRABRIL AP Jaune 400CC : 9 200 AR HT
      Encaustique CIRABRIL AP Jaune GM : 77 500 AR HT
      Enduitbat sac de 1 kg : 2500 AR HT
      Enduitbat sac de 10 kg : 16 700 AR HT
      Enduitbat sac de 2 kg : 4 300 AR HT
      Enduitbat sac de 5 kg : 10 300 AR HT
      EAU DE JAVEL EN VRAC : 2 400 AR HT
      EAU DE JAVEL 1 L : 3 300 AR HT
      DK vert  en vrac : 2 400 AR HT
      DK vert 1l Liquide Vaisselle : 2 200 AR HT 
      Bnett en vrac : 2 200 AR HT
      Bnett 1Ltr  : 3 300 AR HT
      LAVE-VITRE 1L : 3 000 AR HT


      
Règles de vente:
- Un pack de bouteille 1.5L ou 1L contient 6 bouteilles
- Un pack de bouteilles 0.5L contient 8 bouteilles
- SAINTO ne livre que des packs complets, pas de bouteilles individuelles
- Les livraisons se font 48h après la commande
-Tous ceux qui sont en VRAC du coté du categories de GAMO sont vendus par kilo 
-La taxe pour le TTC est 20 %
IMPORTANT: 
- Si un client demande simplement de connaitre le prix d'un produit, utilise UNIQUEMENT la fonction calculerPrix.
- Si un client veut passer une commande complète avec ses coordonnées, utilise UNIQUEMENT la fonction passerCommande.
- N'utilise jamais la fonction passerCommande pour une simple demande de prix.
-Si le client demande qu'elle sont les produits que vous vendez , tu reponds simplement qu'on à deux catégorie de produits MADO et GAMO
-Si le client te demande les produits GAMO tu n'aaffiche pas en une fois tous les produits mais selectionne des petit extrait pour données une idées au client , et tu affiche que c'est encore qu'un petit extrait et si le client te demande les autre produits tu affiche les autres produits
-Tu ne dois jamais montrer en une fois tous les produits MADO et GAMO ensemble
-Qaund tu enregistre la commande du client tu dit juste que votre commande a été envoyer et enregistrer avec success chez nous
-Informe le client qu'un devis détaillé de sa commande s'affichera après l'envoi avec les prix TTC

Si un client te demande de commander plusieurs articles tu envoie les nom des articles dans le même parametre que produits dans la fonction passerCommandeFonction, et de même pour le nombre de chacun des articles.
Quand tu réponds aux questions sur les produits, sois précis et poli.`,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40
      }
    }).startChat();
  }

  async envoyerMessage() {
    if (!this.userInput.trim()) return;

    // Ajoute le message utilisateur
    this.messages.push({ text: this.userInput, from: 'user' });

    const question = this.userInput;
    this.userInput = '';

    try {
      const result = await this.chatSession.sendMessage(question);
      const response = result.response;

      // Vérifier s'il y a un appel de fonction
      const functionCall = this.extractFunctionCall(response);

      if (functionCall) {
        // Traiter l'appel de fonction
        await this.handleFunctionCall(functionCall, response);
      } else {
        // Réponse normale
        const text = response.text();
        this.messages.push({ text, from: 'bot' });
      }

      // Scroll automatique en bas
      setTimeout(() => {
        if (this.chatBox?.nativeElement) {
          this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
        }
      }, 100);
    } catch (err) {
      console.error('Erreur:', err);
      this.messages.push({ text: "Erreur lors de la réponse de l'assistant.", from: 'bot' });
    }
  }

  // Extraire l'appel de fonction de la réponse
  private extractFunctionCall(response: any): any {
    try {
      const candidates = response.candidates;
      if (candidates && candidates.length > 0) {
        const parts = candidates[0].content.parts;
        if (parts && parts.length > 0) {
          for (const part of parts) {
            if (part.functionCall) {
              return part.functionCall;
            }
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Erreur lors de l'extraction de l'appel de fonction:", error);
      return null;
    }
  }

  // Gérer l'appel de fonction
  private async handleFunctionCall(functionCall: any, initialResponse: any) {
    const functionName = functionCall.name;
    const args = functionCall.args;

    let functionResponse: any;

    // Exécuter la fonction correspondante
    if (functionName === 'passerCommande') {
      // Calculer le prix si non fourni
      let prix = args.prix;
      if (prix === undefined || prix === null) {
        try {
          // Tenter de calculer le prix
          const prixCalcule = this.calculerPrix(args.produit, args.quantite);
          if (prixCalcule && prixCalcule.success) {
            prix = prixCalcule.prixTotal;
          } else {
            prix = 0; // Valeur par défaut si le calcul échoue
          }
        } catch (e) {
          prix = 0; // En cas d'erreur
          console.error("Erreur lors du calcul automatique du prix:", e);
        }
      }

      functionResponse = this.passerCommande(
        args.produit,
        args.quantite,
        prix,
        args.nomClient,
        args.email,
        args.adresse,
        args.telephone
      );

      // Afficher un message sur la commande dans la conversation avec vérification
      let prixMessage = '';
      if (prix !== undefined && prix !== null) {
        const prixTTC = prix * 1.2; // Ajouter TVA 20%
        prixMessage = ` au prix de ${prixTTC.toLocaleString('fr-FR')} Ar TTC`;
      }

      this.messages.push({
        text: `Je traite votre commande de ${args.quantite} ${args.produit} pour ${args.nomClient}${prixMessage}...`,
        from: 'bot'
      });

      // Générer et afficher le devis
      this.genererDevis(args.produit, args.quantite, prix || 0, args.nomClient, args.email, args.adresse, args.telephone);
    }
    else if (functionName === 'calculerPrix') {
      functionResponse = this.calculerPrix(args.produit, args.quantite);

      // Afficher un message sur le calcul de prix dans la conversation
      this.messages.push({
        text: `Je calcule le prix pour ${args.quantite} ${args.produit}...`,
        from: 'bot'
      });
    }

    // Envoyer le résultat de la fonction au modèle
    if (functionResponse) {
      try {
        // Conversion en chaîne JSON puis analyse pour s'assurer que c'est un objet valide
        const responseJson = JSON.stringify({
          functionResponse: {
            name: functionName,
            response: functionResponse
          }
        });

        // Envoyer la réponse au modèle sous forme de texte
        const result = await this.chatSession.sendMessage(responseJson);

        // Afficher la réponse finale
        const text = result.response.text();
        this.messages.push({ text, from: 'bot' });
      } catch (error) {
        console.error("Erreur lors de l'envoi de la réponse de fonction:", error);
        if (functionName === 'passerCommande') {
          this.messages.push({
            text: "Demande enregistrée et envoyée vers notre siège, on vous remercie pour votre commande 😊 Votre devis s'affiche maintenant.",
            from: 'bot'
          });
        } else {
          // Pour les erreurs de calcul de prix, afficher le résultat directement
          try {
            const prixInfo = this.formatPrixResponse(functionResponse);
            this.messages.push({
              text: prixInfo,
              from: 'bot'
            });
          } catch (e) {
            this.messages.push({
              text: "Une erreur est survenue lors du calcul du prix. Veuillez réessayer.",
              from: 'bot'
            });
          }
        }
      }
    }
  }

  // Fonction pour passer une commande
  private passerCommande(produit: string, quantite: number, prix: number | null, nomClient: string, email: string, adresse: string, telephone: string): any {
    // Envoyer la commande par email avec le prix
    this.envoyerCommande(produit, quantite, prix, nomClient, email, adresse, telephone);

    // Convertir en TTC si le prix est fourni
    let prixTTC = 0;
    if (prix !== null) {
      prixTTC = prix * 1.2; // Ajouter TVA 20%
    }

    // Retourner les informations de la commande avec vérification du prix
    return {
      success: true,
      numeroCommande: `CMD-${Date.now().toString().slice(-6)}`,
      estimationLivraison: this.getEstimationLivraison(),
      prixTotal: prixTTC !== null ? prixTTC : "Non spécifié",
      message: "Votre commande a été enregistrée avec succès."
    };
  }

  // Fonction pour calculer le prix
  private calculerPrix(produit: string, quantite: number): any {
    const prixUnitaires: { [key: string]: number } = {
      'SAINTO 1.5L': 2750 * 6, // Prix par pack (6 bouteilles)
      'SAINTO 1L': 1666 * 6,   // Prix par pack (6 bouteilles)
      'SAINTO 0.5L': 1416 * 8, // Prix par pack (8 bouteilles)
      'SAINTO 5L': 5000,       // Prix par bouteille
      'Bonbone 1ere Livraison': 88000,
      'Bonbone recharge': 36166,
      'ICE TEA 1.5L': 8166 * 6, // Prix par pack (6 bouteilles)
      'ICE TEA 0.5L': 3500 * 8  // Prix par pack (8 bouteilles)
    };

    // Vérifier si le produit existe
    if (prixUnitaires[produit] === undefined) {
      return {
        success: false,
        message: "Produit non reconnu. Veuillez vérifier le nom du produit."
      };
    }

    const prixHT = prixUnitaires[produit] * quantite;
    const prixTTC = prixHT * 1.2; // Ajouter TVA 20%

    return {
      success: true,
      produit: produit,
      quantite: quantite,
      prixUnitaire: prixUnitaires[produit],
      prixTotal: prixTTC,
      prixHT: prixHT,
      devise: "Ar"
    };
  }

  // Fonction pour envoyer la commande par email
  envoyerCommande(nom_article: string, nb_article: number, prix: number | null, nom_client: string, email_client: string, adresse_client: string, numero_tel_client: string) {
    // Formatage sécurisé du prix
    let prixFormateHT = "Non spécifié";
    let prixFormateTTC = "Non spécifié";
    
    if (prix !== undefined && prix !== null) {
      prixFormateHT = `${prix.toLocaleString('fr-FR')} Ar HT`;
      const prixTTC = prix * 1.2;
      prixFormateTTC = `${prixTTC.toLocaleString('fr-FR')} Ar TTC`;
    }

    const templateParams = {
      to: 'tsilavina484@gmail.com',
      subject: 'Nouvelle commande',
      message: `Nouvelle commande :
Nom article : ${nom_article}
Quantité : ${nb_article}
Prix total HT : ${prixFormateHT}
Prix total TTC : ${prixFormateTTC}
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
        console.log('Commande envoyée par email ✅');
      }, (error) => {
        console.error('Erreur lors de l\'envoi de l\'email ❌ : ', error);
      });

    return true;
  }

  // Fonction pour générer et afficher un devis
  genererDevis(produit: string, quantite: number, prix: number, nomClient: string, email: string, adresse: string, telephone: string) {
    // Calculer prix TTC
    const prixHT = prix;
    const tva = prixHT * 0.2;
    const prixTTC = prixHT * 1.2;
    const numeroDevis = `DEV-${Date.now().toString().slice(-6)}`;
    const dateEmission = new Date().toLocaleDateString('fr-FR');
    const dateValidite = new Date();
    dateValidite.setDate(dateValidite.getDate() + 30);
    
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
      articles: [
        {
          designation: produit,
          quantite: quantite,
          prixUnitaireHT: this.getPrixUnitaire(produit),
          totalHT: prixHT
        }
      ],
      totalHT: prixHT,
      tva: tva,
      totalTTC: prixTTC,
      conditions: "Livraison sous 48h après validation du devis. Validité du devis : 30 jours."
    };

    // Afficher le devis
    this.showDevis = true;
  }

  // Fonction pour récupérer le prix unitaire d'un produit
  private getPrixUnitaire(produit: string): number {
    const prixUnitaires: { [key: string]: number } = {
      'SAINTO 1.5L': 2750 * 6, // Prix par pack (6 bouteilles)
      'SAINTO 1L': 1666 * 6,   // Prix par pack (6 bouteilles)
      'SAINTO 0.5L': 1416 * 8, // Prix par pack (8 bouteilles)
      'SAINTO 5L': 5000,       // Prix par bouteille
      'Bonbone 1ere Livraison': 88000,
      'Bonbone recharge': 36166,
      'ICE TEA 1.5L': 8166 * 6, // Prix par pack (6 bouteilles)
      'ICE TEA 0.5L': 3500 * 8  // Prix par pack (8 bouteilles)
    };

    return prixUnitaires[produit] || 0;
  }

  // Fermer le devis
  fermerDevis() {
    this.showDevis = false;
  }

  // Télécharger le devis (fonction simplifiée qui pourrait être améliorée)
  telechargerDevis() {
    alert("Fonctionnalité de téléchargement en cours de développement. Le devis sera envoyé à votre adresse email.");
    this.showDevis = false;
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
}