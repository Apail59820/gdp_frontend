export const displayBillingStateText = (state: 'NonReglee' | 'Reglee' | 'RegltPartiel' | undefined) => {
    switch (state) {
        case 'NonReglee':
            return 'Non réglée';
        case 'Reglee':
            return 'Réglée';
        case 'RegltPartiel':
            return 'Partiellement réglée';
        default:
            return 'Etat inconnu';
    }
};