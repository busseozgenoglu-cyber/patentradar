export interface SavedCard {
  id: string;
  cardHolder: string;
  cardNumber: string; // Masked: **** **** **** 1234
  expiryMonth: string;
  expiryYear: string;
  cvv: string; // DEMO ONLY — real apps never store CVV
  brand: 'visa' | 'mastercard' | 'amex' | 'troy' | 'unknown';
}

export interface PaymentRecord {
  id: string;
  type: 'analysis' | 'defense';
  amount: number;
  description: string;
  cardId: string;
  cardMask: string;
  createdAt: string;
}

const CARDS_KEY = 'markaradar_cards';
const PAYMENTS_KEY = 'markaradar_payments';
const BALANCE_KEY = 'markaradar_balance';

const PRICE_ANALYSIS = 299;
const PRICE_DEFENSE = 299;

export const paymentService = {
  getPrice(type: 'analysis' | 'defense' = 'analysis'): number {
    return type === 'analysis' ? PRICE_ANALYSIS : PRICE_DEFENSE;
  },

  // Cards
  getCards(): SavedCard[] {
    try {
      const data = localStorage.getItem(CARDS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCard(card: Omit<SavedCard, 'id' | 'brand'>): SavedCard {
    const cards = this.getCards();
    const brand = detectCardBrand(card.cardNumber);
    const masked = maskCard(card.cardNumber);
    const newCard: SavedCard = {
      id: `card_${Date.now()}`,
      cardHolder: card.cardHolder,
      cardNumber: masked,
      expiryMonth: card.expiryMonth,
      expiryYear: card.expiryYear,
      cvv: card.cvv, // DEMO ONLY
      brand,
    };
    cards.push(newCard);
    localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
    return newCard;
  },

  deleteCard(id: string): void {
    const cards = this.getCards().filter(c => c.id !== id);
    localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
  },

  hasCard(): boolean {
    return this.getCards().length > 0;
  },

  getDefaultCard(): SavedCard | null {
    return this.getCards()[0] || null;
  },

  // Payments
  getPayments(): PaymentRecord[] {
    try {
      const data = localStorage.getItem(PAYMENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  recordPayment(type: 'analysis' | 'defense', description: string): PaymentRecord | null {
    const cards = this.getCards();
    if (cards.length === 0) return null;
    const card = cards[0];
    const record: PaymentRecord = {
      id: `pay_${Date.now()}`,
      type,
      amount: this.getPrice(type),
      description,
      cardId: card.id,
      cardMask: card.cardNumber,
      createdAt: new Date().toISOString(),
    };
    const payments = this.getPayments();
    payments.unshift(record);
    if (payments.length > 100) payments.length = 100;
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
    return record;
  },

  // Balance / Credits (optional prepaid model)
  getBalance(): number {
    try {
      const data = localStorage.getItem(BALANCE_KEY);
      return data ? parseInt(data, 10) : 0;
    } catch {
      return 0;
    }
  },

  addBalance(amount: number): void {
    const current = this.getBalance();
    localStorage.setItem(BALANCE_KEY, String(current + amount));
  },

  deductBalance(amount: number): boolean {
    const current = this.getBalance();
    if (current < amount) return false;
    localStorage.setItem(BALANCE_KEY, String(current - amount));
    return true;
  },

  clearAll(): void {
    localStorage.removeItem(CARDS_KEY);
    localStorage.removeItem(PAYMENTS_KEY);
    localStorage.removeItem(BALANCE_KEY);
  },
};

function detectCardBrand(number: string): SavedCard['brand'] {
  const n = number.replace(/\s/g, '');
  if (/^4/.test(n)) return 'visa';
  if (/^5[1-5]/.test(n)) return 'mastercard';
  if (/^3[47]/.test(n)) return 'amex';
  if (/^9792/.test(n)) return 'troy';
  return 'unknown';
}

function maskCard(number: string): string {
  const n = number.replace(/\s/g, '');
  if (n.length < 4) return n;
  return '**** **** **** ' + n.slice(-4);
}
