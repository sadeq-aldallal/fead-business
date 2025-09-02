import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-8">
          <CardHeader>
            <CardTitle className="text-4xl font-bold mb-8">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                connect your Instagram account, or contact us for support.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Account information (email, name, organization details)</li>
                <li>Instagram account data (username, profile information, messages)</li>
                <li>Usage data and analytics</li>
                <li>Communication records</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide and maintain our AI customer support services</li>
                <li>Process and respond to Instagram messages on your behalf</li>
                <li>Improve our services and develop new features</li>
                <li>Communicate with you about your account and our services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Information Sharing</h2>
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                except as described in this policy:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>With your consent</li>
                <li>To comply with legal requirements</li>
                <li>To protect our rights and safety</li>
                <li>With service providers who assist in our operations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. However, no method of 
                transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and data</li>
                <li>Withdraw consent for data processing</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Instagram Data</h2>
              <p>
                When you connect your Instagram account, we access and process your Instagram data 
                in accordance with Instagram's terms and policies. We only access the minimum data 
                necessary to provide our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@fead.app" className="text-green-400 hover:underline">
                  privacy@fead.app
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any 
                changes by posting the new Privacy Policy on this page and updating the 
                "Last updated" date.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-muted-foreground text-sm">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};