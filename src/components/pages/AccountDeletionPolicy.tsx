import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AccountDeletionPolicy: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-8">
          <CardHeader>
            <CardTitle className="text-4xl font-bold mb-8">Account Deletion Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Account Deletion Request</h2>
              <p className="mb-4">
                You can request the deletion of your fead.app account at any time. We provide 
                multiple ways to delete your account:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Through your account settings in the dashboard</li>
                <li>By contacting our support team at <a href="mailto:support@fead.app" className="text-green-400 hover:underline">support@fead.app</a></li>
                <li>By sending a deletion request to <a href="mailto:delete@fead.app" className="text-green-400 hover:underline">delete@fead.app</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. What Gets Deleted</h2>
              <p className="mb-4">When you delete your account, we will permanently remove:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your user profile and account information</li>
                <li>Organization and business data</li>
                <li>Instagram connection data and tokens</li>
                <li>All stored messages and conversation history</li>
                <li>Analytics and usage data</li>
                <li>Any uploaded files or media</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Deletion Timeline</h2>
              <p className="mb-4">Account deletion follows this timeline:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Immediate:</strong> Account access is disabled</li>
                <li><strong>Within 24 hours:</strong> Data removal from active systems begins</li>
                <li><strong>Within 30 days:</strong> Complete data removal from all systems and backups</li>
                <li><strong>Confirmation:</strong> Email confirmation sent when deletion is complete</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Instagram Data</h2>
              <p>
                When you delete your account, we will also:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Revoke all Instagram API access tokens</li>
                <li>Remove Instagram account connections</li>
                <li>Delete any cached Instagram data</li>
                <li>Stop all automated responses and AI interactions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data We May Retain</h2>
              <p className="mb-4">
                For legal and operational reasons, we may retain certain information even after 
                account deletion:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Transaction records for billing and tax purposes (as required by law)</li>
                <li>Anonymized analytics data that cannot be linked to you</li>
                <li>Information necessary to comply with legal obligations</li>
                <li>Data required for fraud prevention and security</li>
              </ul>
              <p className="mt-4">
                This retained data is kept to the minimum necessary and in accordance with 
                applicable data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Before You Delete</h2>
              <p className="mb-4">Before deleting your account, please consider:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Download any data you want to keep</li>
                <li>Cancel any active subscriptions</li>
                <li>Inform team members if you're part of an organization</li>
                <li>Consider deactivating instead of deleting if you might return</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Reactivation</h2>
              <p>
                Once your account is deleted, it cannot be recovered. If you want to use 
                fead.app again, you will need to create a new account and reconnect your 
                Instagram accounts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Contact Us</h2>
              <p>
                If you have questions about account deletion or need assistance with the process, 
                please contact us:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Email: <a href="mailto:support@fead.app" className="text-green-400 hover:underline">support@fead.app</a></li>
                <li>Deletion requests: <a href="mailto:delete@fead.app" className="text-green-400 hover:underline">delete@fead.app</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Policy Updates</h2>
              <p>
                We may update this Account Deletion Policy from time to time. Any changes will 
                be posted on this page with an updated revision date.
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