const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface PaytrTokenRequest {
  email: string;
  payment_amount: number; // in TL (will be converted to kuruş on backend)
  merchant_oid: string;
  user_name: string;
  user_address?: string;
  user_phone?: string;
  user_ip: string;
  merchant_ok_url: string;
  merchant_fail_url: string;
}

export interface PaytrTokenResponse {
  status: 'success' | 'error';
  token?: string;
  iframe_url?: string;
  error?: string;
}

export const paytrService = {
  async getToken(data: PaytrTokenRequest): Promise<PaytrTokenResponse> {
    const response = await fetch(`${API_BASE_URL}/api/paytr-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `PayTR hatası: ${response.status}`);
    }

    return response.json();
  },

  getIframeUrl(token: string): string {
    return `https://www.paytr.com/odeme/guvenli/${token}`;
  },

  generateOrderId(prefix: string = 'MR'): string {
    return `${prefix}${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  },

  async getClientIp(): Promise<string> {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return data.ip || '127.0.0.1';
    } catch {
      return '127.0.0.1';
    }
  },
};
