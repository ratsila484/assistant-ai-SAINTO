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

  apiKey: string = 'AIzaSyDBphs9gi7vUDoMZdYMHXCiFxY7Sb8KaRc';
  chatSession: any;

  @ViewChild('chatBox') chatBox!: ElementRef;

  ngOnInit() {
    this.initializeChat();
    // Message d'accueil
    this.messages.push({
      text: "Bonjour, je suis l'assistant commercial de SAINTO. Comment puis-je vous aider aujourd'hui ?",
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

     // Création des outils avec les déclarations de fonctions
     const tools: Tool[] = [
      {
        functionDeclarations: [passerCommandeFunction]
      }
    ];

    // Configuration du modèle avec système d'instruction et outils
    this.chatSession = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      tools: tools,
      systemInstruction: `Tu es un agent commercial de l'entreprise SAINTO.
L'entreprise est siégée à Ampasampito qui vend principalement des eau minérale :
- SAINTO 1.5L qui coute 2 750 Ar HT par bouteille
- SAINTO 1L qui coute 1 666 Ar HT par bouteille
- SAINTO 5L qui coute 5000 Ar par bouteille
- SAINTO 0.5L qui coute 1 416 Ar HT par bouteille
- Bonbone 1ère Livraison à 88 000 Ar HT
- Bonbone recharge qui coute 36 166 Ar HT

SAINTO vend aussi des ICE TEA en plusieurs parfums: Pêche, Pomme, Citron, disponibles en:
- ICE TEA 1.5L qui coute 8 166 Ar HT par bouteille
- ICE TEA 0.5L qui coute 3 500 Ar HT par bouteille

Règles de vente:
- Un pack de bouteille 1.5L ou 1L contient 6 bouteilles
- Un pack de bouteilles 0.5L contient 8 bouteilles
- SAINTO ne livre que des packs complets, pas de bouteilles individuelles
- Les livraisons se font 48h après la commande

Quand un client veut commander, utilise UNIQUEMENT la fonction passerCommande pour collecter ses informations.
Pour les calculs de prix, utilise UNIQUEMENT la fonction calculerPrix.
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
      functionResponse = this.passerCommande(
        args.produit,
        args.quantite,
        args.nomClient,
        args.email,
        args.adresse,
        args.telephone
      );

      // Afficher un message sur la commande dans la conversation
      this.messages.push({
        text: `Je traite votre commande de ${args.quantite} ${args.produit} pour ${args.nomClient}...`,
        from: 'bot'
      });
    }
    else if (functionName === 'calculerPrix') {
      functionResponse = this.calculerPrix(args.produit, args.quantite);
    }

    // Envoyer le résultat de la fonction au modèle
    if (functionResponse) {
      try {
        const result = await this.chatSession.sendMessage({
          functionResponse: {
            name: functionName,
            response: functionResponse
          }
        });

        // Afficher la réponse finale
        const text = result.response.text();
        this.messages.push({ text, from: 'bot' });
      } catch (error) {
        console.error("Erreur lors de l'envoi de la réponse de fonction:", error);
        this.messages.push({
          text: "Demande enregistrer et envoyer vers notre siège, on vous remercie pour votre commande 😊",
          from: 'bot'
        });
      }
    }
  }

  // Fonction pour passer une commande
  private passerCommande(produit: string, quantite: number, nomClient: string, email: string, adresse: string, telephone: string): any {
    // Envoyer la commande par email
    this.envoyerCommande(produit, quantite, nomClient, email, adresse, telephone);

    // Retourner les informations de la commande
    return {
      success: true,
      numeroCommande: `CMD-${Date.now().toString().slice(-6)}`,
      estimationLivraison: this.getEstimationLivraison(),
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

    const prixTotal = prixUnitaires[produit] * quantite;

    return {
      success: true,
      produit: produit,
      quantite: quantite,
      prixUnitaire: prixUnitaires[produit],
      prixTotal: prixTotal,
      devise: "Ar HT"
    };
  }

  // Fonction pour envoyer un email de commande
  envoyerCommande(nom_article: string, nb_article: number, nom_client: string, email_client: string, adresse_client: string, numero_tel_client: string) {
    const templateParams = {
      to: 'tsilavina484@gmail.com',
      subject: 'Nouvelle commande',
      message: `Nouvelle commande :\nNom article : ${nom_article}\nQuantité : ${nb_article}\nClient : ${nom_client}\nEmail : ${email_client}\nTéléphone : ${numero_tel_client}\nAdresse : ${adresse_client}`
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

  // Obtenir une estimation de date de livraison (48h après)
  private getEstimationLivraison(): string {
    const date = new Date();
    date.setDate(date.getDate() + 2); // +48h
    return date.toLocaleDateString('fr-FR');
  }
}
