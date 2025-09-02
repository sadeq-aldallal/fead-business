import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-8">
          <CardHeader>
            <CardTitle className="text-4xl font-bold mb-8">Terms and Conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using fead.app, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, 
                please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Service Description</h2>
              <p className="mb-4">
                fead.app provides AI-powered customer support automation for Instagram accounts. 
                Our services include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Automated response to Instagram messages</li>
                <li>AI-powered customer support</li>
                <li>Business analytics and insights</li>
                <li>Integration with Instagram Business API</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Responsibilities</h2>
              <p className="mb-4">You agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the service in compliance with all applicable laws</li>
                <li>Not use the service for any unlawful or prohibited activities</li>
                <li>Ensure your Instagram account complies with Instagram's terms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Instagram Integration</h2>
              <p>
                To use our services, you must connect a professional Instagram account (Business or Creator). 
                You acknowledge that your use of Instagram through our service is subject to Instagram's 
                terms of service and community guidelines.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Service Availability</h2>
              <p>
                We strive to maintain high service availability, but we do not guarantee uninterrupted 
                access to our services. We may temporarily suspend service for maintenance, updates, 
                or other operational reasons.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Limitation of Liability</h2>
              <p>
                fead.app shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages, including without limitation, loss of profits, data, use, 
                goodwill, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Termination</h2>
              <p>
                We may terminate or suspend your account and access to the service immediately, 
                without prior notice or liability, for any reason whatsoever, including without 
                limitation if you breach the Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Intellectual Property</h2>
              <p>
                The service and its original content, features, and functionality are and will 
                remain the exclusive property of fead.app and its licensors. The service is 
                protected by copyright, trademark, and other laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms 
                at any time. If a revision is material, we will try to provide at least 30 days 
                notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contact Information</h2>
              <p>
                If you have any questions about these Terms and Conditions, please contact us at{' '}
                <a href="mailto:legal@fead.app" className="text-green-400 hover:underline">
                  legal@fead.app
                </a>
              </p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-muted-foreground text-sm">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};