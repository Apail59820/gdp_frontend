export const messages = {
  general: {
    success: (subject?: string, isFeminineNoun?: boolean, isPlural?: boolean): string => {
      if (!subject) return 'Succès !';
      return `${subject} ${isPlural ? 'ont' : 'a'} bien été pris${
        isFeminineNoun ? `e${isPlural ? 's' : ''}` : ''
      } en compte !`;
    },
    error: (context?: string): string => {
      if (!context) return 'Une erreur est survenue. Veuillez tenter ultérieurement ou contacter le support...';
      return `Une erreur est survenue. ${context}`;
    },
  },

  login: {
    success: (appName?: string): string => `Bienvenue ${appName ? `sur ${appName} ` : ''}!`,
    error: {
      general: "Nous n'avons pas réussi à vous identifier...",
      invalid: "L'email et/ou le mot de passe indiqué ne correspond pas aux formats acceptés.",
      inactive:
        "L'email et/ou le mot de passe sont incorrects ou le compte associé est inactif (vérifiez vos mail pour l'activer).",
      server: "Votre compte a été activé mais vos informations n'ont pas pu être sauvegardées...",
      collaborator: 'En tant que collaborateur, vous devez utiliser votre compte Microsoft pour vous connecter.',
    },

    requestEmailValidation: {
      success: "Si l'email possède un compte inactif, un email lui a été envoyé.",
    },
    recoverPasswordRequest: {
      success:
        "Si l'adresse possède un compte, un email lui a été envoyé avec un lien de redirection. N'oubliez pas de vérifier vos Spams !",
      error: "L'email indiqué ne correspond pas aux formats acceptés ou n'est pas associé à un compte.",
    },
    validateEmail: {
      success: 'Votre compte a été activé !',
      error: "Nous n'avons pas réussi à activer votre compte...",
    },
  },
  registration: {
    success: (appName?: string): string =>
      `Bienvenue ${appName ? `sur ${appName} ` : ''}! N'oubliez pas de valider votre email.`,
    error: {
      general: "Les données entrées ne correspondent pas aux formats requis ou l'email est déjà associé à un compte.",
      unmatched: 'Les deux mots de passe ne correspondent pas.',
      cguUnchecked: "La case des Conditions Générales d'Utilisation n'a pas été cochée.",
    },
  },

  form: {
    error: {
      requiredFields: (fields?: string[]): string => {
        if (!fields) return 'Tous les champs sont obligatoires.';
        const plural = fields.length > 1;
        return `Le${plural ? 's' : ''} champ${plural ? 's' : ''} ${fields.join(' et ')} ${
          plural ? 'sont' : 'est'
        } obligatoire${plural ? 's' : ''}.`;
      },
      invalid: (field?: string, acceptedFormat?: string): string => {
        if (!field) return 'Les données indiquées ne correspondent pas aux formats acceptés.';
        return `Le champ ${field} ne respecte pas le bon format${!acceptedFormat ? '.' : ` (${acceptedFormat}).`}`;
      },
    },
  },

  fetchData: {
    error: (subject?: string): string => `Impossible de récupérer ${subject ? subject : 'les données'}...`,
  },

  reminder: {
    success: 'Envoi de relance manuelle enregistré !',
    error: "Échec de l'enregistrement de la relance manuelle.",
  },

  satisfaction: {
    success: 'Merci pour votre réponse !',
  },
};
