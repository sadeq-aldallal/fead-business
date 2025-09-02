import React, { useState } from 'react'
import { User, Mail, Calendar, Settings, LogOut, Shield } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '@/components/ui/button';

export const UserProfile: React.FC = () => {
  const { user, signOut, updatePassword } = useAuth()
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    try {
      const { error } = await updatePassword(passwordData.newPassword)
      if (error) {
        setPasswordError(error.message)
      } else {
        setPasswordSuccess('Password updated successfully!')
        setPasswordData({ newPassword: '', confirmPassword: '' })
        setTimeout(() => {
          setIsChangingPassword(false)
          setPasswordSuccess('')
        }, 2000)
      }
    } catch (error) {
      setPasswordError('Failed to update password')
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-foreground">Please sign in to view your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card border border-border rounded-lg p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {user.user_metadata?.full_name || 'User Profile'}
                </h1>
                <p className="text-muted-foreground">Manage your account settings</p>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </Button>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Info */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Information
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-card/50 rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-card/50 rounded-lg">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="text-foreground">
                      {user.user_metadata?.full_name || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-card/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="text-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-card/50 rounded-lg">
                  <Shield className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Account Status</p>
                    <p className="text-green-400">Active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Security Settings
              </h2>

              {!isChangingPassword ? (
                <div className="space-y-4">
                  <div className="p-4 bg-card/50 rounded-lg">
                    <h3 className="text-foreground font-medium mb-2">Password</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Keep your account secure with a strong password
                    </p>
                    <Button
                      onClick={() => setIsChangingPassword(true)}
                      variant="outline"
                      size="sm"
                    >
                      Change Password
                    </Button>
                  </div>

                  <div className="p-4 bg-card/50 rounded-lg">
                    <h3 className="text-foreground font-medium mb-2">Email Verification</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      Your email is verified
                    </p>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-green-400 text-sm">Verified</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-card/50 rounded-lg">
                  <h3 className="text-foreground font-medium mb-4">Change Password</h3>
                  
                  {passwordError && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                      {passwordError}
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
                      {passwordSuccess}
                    </div>
                  )}

                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-3 py-2 bg-card/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter new password"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2 bg-card/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Confirm new password"
                        required
                      />
                    </div>

                    <div className="flex space-x-3">
                      <Button type="submit" size="sm">
                        Update Password
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsChangingPassword(false)
                          setPasswordData({ newPassword: '', confirmPassword: '' })
                          setPasswordError('')
                          setPasswordSuccess('')
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Account Actions */}
          <div className="mt-8 pt-8 border-t border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Account Actions</h2>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" size="sm">
                Download Data
              </Button>
              <Button variant="outline" size="sm" className="text-red-400 border-red-400/30 hover:bg-red-400/10">
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}