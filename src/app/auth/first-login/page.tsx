"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { validatePasswordStrength } from '@/lib/password-validation';
import { 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Lock,
  User,
  Mail
} from 'lucide-react';

function FirstLoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get('token');

  const [loading, setLoading] = useState(false);
  const [verifyingToken, setVerifyingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);
  
  const [formData, setFormData] = useState({
    tempPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    temp: false,
    new: false,
    confirm: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState({
    isValid: false,
    score: 0,
    feedback: [] as string[]
  });

  useEffect(() => {
    verifyToken();
  }, [token]);

  useEffect(() => {
    if (formData.newPassword) {
      const strength = validatePasswordStrength(formData.newPassword);
      setPasswordStrength(strength);
    }
  }, [formData.newPassword]);

  const verifyToken = async () => {
    if (!token) {
      setTokenValid(false);
      setVerifyingToken(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/verify-first-login-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setTokenValid(true);
        setUserInfo(data.user);
      } else {
        setTokenValid(false);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      setTokenValid(false);
    } finally {
      setVerifyingToken(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tempPassword) {
      newErrors.tempPassword = 'Le mot de passe temporaire est requis';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Le nouveau mot de passe est requis';
    } else if (!passwordStrength.isValid) {
      newErrors.newPassword = 'Le mot de passe ne respecte pas les critères de sécurité';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'La confirmation est requise';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (formData.tempPassword === formData.newPassword) {
      newErrors.newPassword = 'Le nouveau mot de passe doit être différent du temporaire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch('/api/auth/first-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          tempPassword: formData.tempPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Rediriger vers le dashboard après succès
        router.push('/admin/dashboard?first-login=true');
      } else {
        setErrors({ form: data.error || 'Erreur lors de la mise à jour du mot de passe' });
      }
    } catch (error) {
      setErrors({ form: 'Une erreur est survenue. Veuillez réessayer.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const togglePasswordVisibility = (field: 'temp' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const getStrengthColor = (score: number) => {
    if (score <= 2) return 'text-red-600';
    if (score <= 4) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStrengthLabel = (score: number) => {
    if (score <= 2) return 'Faible';
    if (score <= 4) return 'Moyen';
    return 'Fort';
  };

  if (verifyingToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Vérification du lien de première connexion...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Lien invalide ou expiré</h1>
            <p className="text-gray-600 mb-6">
              Ce lien de première connexion n'est pas valide ou a expiré. 
              Contactez votre administrateur pour obtenir un nouveau lien.
            </p>
            <Button 
              onClick={() => router.push('/auth/login')}
              className="w-full"
            >
              Retour à la connexion
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Lock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Première connexion</h1>
          <p className="text-gray-600">Bienvenue ! Créez votre mot de passe sécurisé</p>
        </div>

        {userInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">{userInfo.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700">{userInfo.email}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.form && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {errors.form}
            </div>
          )}

          {/* Mot de passe temporaire */}
          <div className="space-y-2">
            <label htmlFor="tempPassword" className="text-sm font-medium text-gray-700">
              Mot de passe temporaire *
            </label>
            <div className="relative">
              <input
                id="tempPassword"
                type={showPasswords.temp ? 'text' : 'password'}
                value={formData.tempPassword}
                onChange={(e) => handleInputChange('tempPassword', e.target.value)}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.tempPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Saisissez le mot de passe reçu par email"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('temp')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPasswords.temp ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors.tempPassword && (
              <p className="text-sm text-red-600">{errors.tempPassword}</p>
            )}
          </div>

          {/* Nouveau mot de passe */}
          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
              Nouveau mot de passe *
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.newPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Créez un mot de passe sécurisé"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            
            {/* Indicateur de force du mot de passe */}
            {formData.newPassword && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium text-gray-600">Force :</div>
                  <div className={`text-xs font-medium ${getStrengthColor(passwordStrength.score)}`}>
                    {getStrengthLabel(passwordStrength.score)} ({passwordStrength.score}/6)
                  </div>
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <ul className="text-xs text-gray-600 space-y-1">
                    {passwordStrength.feedback.map((feedback, index) => (
                      <li key={index} className="flex items-center gap-1">
                        <XCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                        {feedback}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            
            {errors.newPassword && (
              <p className="text-sm text-red-600">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirmation du mot de passe */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirmer le nouveau mot de passe *
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Confirmez votre nouveau mot de passe"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <CheckCircle className="h-4 w-4" />
                Les mots de passe correspondent
              </div>
            )}
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !passwordStrength.isValid}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Mise à jour...
              </>
            ) : (
              'Confirmer et se connecter'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            En définissant votre mot de passe, vous acceptez de respecter la politique de sécurité de l'entreprise.
          </p>
        </div>
      </Card>
    </div>
  );
}

export default function FirstLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </Card>
      </div>
    }>
      <FirstLoginForm />
    </Suspense>
  );
}