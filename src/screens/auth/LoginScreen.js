import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { validateEmail } from '../../utils/validators';
import { formatPhone } from '../../utils/helpers';
import { Colors } from '../../constants/Colors';

const LoginScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    profession: 'Veterinário(a)',
    clinic: '',
    crmv: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, register } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = 'Nome é obrigatório';
      }
      if (!formData.clinic.trim()) {
        newErrors.clinic = 'Clínica é obrigatória';
      }
      if (!formData.crmv.trim()) {
        newErrors.crmv = 'CRMV é obrigatório';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Telefone é obrigatório';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    let result;

    try {
      if (isLogin) {
        console.log('Tentando fazer login...');
        result = await login(formData.email, formData.password);
      } else {
        console.log('Tentando registrar usuário...');
        result = await register(formData);
      }

      if (!result.success) {
        let errorMessage = result.error;
        
        // Tratar diferentes tipos de erro
        if (errorMessage.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos';
        } else if (errorMessage.includes('User already registered')) {
          errorMessage = 'Este email já está cadastrado. Tente fazer login.';
          setIsLogin(true);
        } else if (errorMessage.includes('Password should be at least 6 characters')) {
          errorMessage = 'A senha deve ter pelo menos 6 caracteres';
        } else if (errorMessage.includes('Unable to validate email address')) {
          errorMessage = 'Email inválido';
        } else if (errorMessage.includes('Email not confirmed')) {
          errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.';
        } else if (errorMessage.includes('signup is disabled')) {
          errorMessage = 'Cadastro de novos usuários está temporariamente desabilitado.';
        } else if (errorMessage.includes('permission denied')) {
          errorMessage = 'Erro de permissão. Verifique suas credenciais.';
        } else if (errorMessage.includes('PGRST116')) {
          errorMessage = 'Erro de configuração do perfil. Tente novamente.';
        }
        
        Alert.alert('Erro', errorMessage);
      } else if (!isLogin) {
        // Registro bem-sucedido
        Alert.alert(
          'Cadastro Realizado!', 
          'Sua conta foi criada com sucesso. Você já está logado!',
          [{ text: 'OK' }]
        );
      } else {
        // Login bem-sucedido - não precisa fazer nada, o AuthContext redirecionará
        console.log('Login realizado com sucesso');
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      Alert.alert('Erro', 'Erro inesperado. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    let formattedValue = value;
    
    if (field === 'phone') {
      formattedValue = formatPhone(value);
    } else if (field === 'email') {
      formattedValue = value.toLowerCase().trim();
    } else if (field === 'crmv') {
      formattedValue = value.toUpperCase();
    }
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleTabChange = (newIsLogin) => {
    setIsLogin(newIsLogin);
    setErrors({});
    
    if (newIsLogin) {
      // Limpar campos de registro quando mudar para login
      setFormData(prev => ({
        email: prev.email, // Manter email
        password: prev.password, // Manter senha
        name: '',
        profession: 'Veterinário(a)',
        clinic: '',
        crmv: '',
        phone: ''
      }));
    }
  };

  const fillDemoCredentials = () => {
    updateField('email', 'admin@petcare.com');
    updateField('password', '123456');
  };

  const clearForm = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
      profession: 'Veterinário(a)',
      clinic: '',
      crmv: '',
      phone: ''
    });
    setErrors({});
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.primaryGradient}
        style={styles.gradient}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Logo and Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Image 
                  source={require('../../../assets/logo.png')} 
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.appTitle}>PetCare Pro</Text>
              <Text style={styles.appSubtitle}>
                Sistema Completo para Veterinários
              </Text>
            </View>

            {/* Auth Form */}
            <Card style={styles.authCard}>
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[styles.tab, isLogin && styles.activeTab]}
                  onPress={() => handleTabChange(true)}
                  disabled={loading}
                >
                  <Text style={[styles.tabText, isLogin && styles.activeTabText]}>
                    Entrar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, !isLogin && styles.activeTab]}
                  onPress={() => handleTabChange(false)}
                  disabled={loading}
                >
                  <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>
                    Cadastrar
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Campos de Registro */}
              {!isLogin && (
                <>
                  <Input
                    label="Nome Completo"
                    value={formData.name}
                    onChangeText={(value) => updateField('name', value)}
                    placeholder="Seu nome completo"
                    leftIcon="person"
                    error={errors.name}
                    required
                    editable={!loading}
                  />

                  <Input
                    label="Profissão"
                    value={formData.profession}
                    onChangeText={(value) => updateField('profession', value)}
                    placeholder="Veterinário(a)"
                    leftIcon="medical"
                    editable={!loading}
                  />

                  <Input
                    label="Clínica/Hospital"
                    value={formData.clinic}
                    onChangeText={(value) => updateField('clinic', value)}
                    placeholder="Nome da clínica"
                    leftIcon="business"
                    error={errors.clinic}
                    required
                    editable={!loading}
                  />

                  <Input
                    label="CRMV"
                    value={formData.crmv}
                    onChangeText={(value) => updateField('crmv', value)}
                    placeholder="12345-UF"
                    leftIcon="card"
                    error={errors.crmv}
                    required
                    editable={!loading}
                    autoCapitalize="characters"
                  />

                  <Input
                    label="Telefone"
                    value={formData.phone}
                    onChangeText={(value) => updateField('phone', value)}
                    placeholder="(11) 99999-9999"
                    keyboardType="phone-pad"
                    leftIcon="call"
                    error={errors.phone}
                    required
                    editable={!loading}
                  />
                </>
              )}
              
              {/* Campos Comuns */}
              <Input
                label="Email"
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                leftIcon="mail"
                error={errors.email}
                required
                editable={!loading}
              />

              <Input
                label="Senha"
                value={formData.password}
                onChangeText={(value) => updateField('password', value)}
                placeholder="Sua senha"
                secureTextEntry
                leftIcon="lock-closed"
                error={errors.password}
                required
                editable={!loading}
              />

              {/* Botão Principal */}
              <Button
                title={isLogin ? 'Entrar' : 'Cadastrar'}
                onPress={handleSubmit}
                loading={loading}
                style={styles.authButton}
                fullWidth
              />

              {/* Credenciais Demo - apenas no login */}
              {isLogin && (
                <View style={styles.demoContainer}>
                  <Text style={styles.demoTitle}>Credenciais de Demonstração:</Text>
                  <TouchableOpacity 
                    onPress={fillDemoCredentials}
                    disabled={loading}
                    style={styles.demoCredentials}
                  >
                    <Text style={styles.demoText}>📧 Email: admin@petcare.com</Text>
                    <Text style={styles.demoText}>🔒 Senha: 123456</Text>
                    <Text style={styles.demoHint}>Toque aqui para preencher automaticamente</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Termos de Uso - apenas no cadastro */}
              {!isLogin && (
                <View style={styles.termsContainer}>
                  <Text style={styles.termsText}>
                    Ao cadastrar-se, você concorda com nossos{' '}
                    <Text style={styles.termsLink}>Termos de Uso</Text> e{' '}
                    <Text style={styles.termsLink}>Política de Privacidade</Text>.
                  </Text>
                </View>
              )}

              {/* Link para recuperação de senha - apenas no login */}
              {isLogin && (
                <TouchableOpacity 
                  style={styles.forgotPassword}
                  disabled={loading}
                >
                  <Text style={styles.forgotPasswordText}>
                    Esqueceu sua senha?
                  </Text>
                </TouchableOpacity>
              )}

              {/* Botão para limpar formulário */}
              {!loading && (formData.email || formData.password || formData.name) && (
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={clearForm}
                >
                  <Text style={styles.clearButtonText}>
                    Limpar Formulário
                  </Text>
                </TouchableOpacity>
              )}
            </Card>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                © 2024 PetCare Pro - Desenvolvido com ❤️ para veterinários brasileiros
              </Text>
              <Text style={styles.footerVersion}>
                Versão 1.0.0
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.surface,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  appSubtitle: {
    fontSize: 16,
    color: Colors.surface,
    opacity: 0.9,
    textAlign: 'center',
    maxWidth: 250,
    lineHeight: 22,
  },
  authCard: {
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.surface,
  },
  authButton: {
    marginTop: 8,
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  demoContainer: {
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.info,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  demoCredentials: {
    paddingVertical: 4,
  },
  demoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 2,
  },
  demoHint: {
    fontSize: 12,
    color: Colors.primary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  termsContainer: {
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  termsText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  clearButton: {
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 8,
  },
  clearButtonText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 12,
    color: Colors.surface,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerVersion: {
    fontSize: 10,
    color: Colors.surface,
    opacity: 0.5,
    marginTop: 4,
  },
});

export default LoginScreen;