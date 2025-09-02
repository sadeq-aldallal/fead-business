// n8n webhook endpoint
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface DemoRequestData {
  name: string;
  email: string;
  company: string;
  message: string;
}

// Helper function to call n8n webhook
const callN8nWebhook = async (type: 'contact' | 'demo', formData: ContactFormData | DemoRequestData): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!N8N_WEBHOOK_URL) {
      throw new Error('n8n webhook URL is not configured');
    }

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        formData,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // n8n webhook typically returns success
    return { success: true };
  } catch (error) {
    console.error('Error calling n8n webhook:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
};

// Send contact form email
export const sendContactEmail = async (formData: ContactFormData): Promise<{ success: boolean; error?: string }> => {
  return await callN8nWebhook('contact', formData);
};

// Send demo request email
export const sendDemoRequestEmail = async (formData: DemoRequestData): Promise<{ success: boolean; error?: string }> => {
  return await callN8nWebhook('demo', formData);
};