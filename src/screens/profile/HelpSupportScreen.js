import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';

const HelpSupportScreen = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const supportOptions = [
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      subtitle: 'Suporte via WhatsApp',
      icon: 'logo-whatsapp',
      color: '#25D366',
      onPress: () => openWhatsApp(),
    },
    {
      id: 'email',
      title: 'Email',
      subtitle: 'suporte@vetapp.com',
      icon: 'mail-outline',
      color: Colors.primary,
      onPress: () => openEmail(),
    },
    {
      id: 'phone',
      title: 'Telefone',
      subtitle: '(11) 9999-9999',
      icon: 'call-outline',
      color: Colors.success,
      onPress: () => openPhone(),
    },
    {
      id: 'website',
      title: 'Site',
      subtitle: 'www.vetapp.com',
      icon: 'globe-outline',
      color: Colors.info,
      onPress: () => openWebsite(),
    },
  ];

  const faqItems = [
    {
      question: 'Como agendar uma consulta?',
      answer: 'Toque em "Nova Consulta" na tela inicial, preencha os dados do paciente e escolha data/hora disponível.',
    },
    {
      question: 'Como cadastrar um novo paciente?',
      answer: 'Na tela inicial, toque em "Novo Paciente" ou vá em Pacientes > Adicionar. Preencha as informações básicas do pet.',
    },
    {
      question: 'Como fazer backup dos dados?',
      answer: 'Vá em Perfil > Backup e Restauração > Criar Novo Backup. O backup será salvo localmente no seu dispositivo.',
    },
    {
      question: 'Como ativar notificações?',
      answer: 'Acesse Perfil > Notificações e ative os tipos de lembretes que deseja receber.',
    },
    {
      question: 'Posso usar offline?',
      answer: 'Sim, o app funciona offline. Os dados são sincronizados quando a internet estiver disponível.',
    },
  ];

  const openWhatsApp = () => {
    const phoneNumber = '5511999999999';
    const message = 'Olá! Preciso de ajuda com o VetApp.';
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Erro', 'WhatsApp não está instalado');
      }
    });
  };

  const openEmail = () => {
    const email = 'suporte@vetapp.com';
    const subject = 'Suporte VetApp';
    const body = 'Olá, preciso de ajuda com...';
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o cliente de email');
    });
  };

  const openPhone = () => {
    const phoneNumber = 'tel:+5511999999999';
    Linking.openURL(phoneNumber).catch(() => {
      Alert.alert('Erro', 'Não foi possível fazer a ligação');
    });
  };

  const openWebsite = () => {
    const url = 'https://www.vetapp.com';
    Linking.openURL(url).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o site');
    });
  };

  const sendMessage = async () => {
    if (!message.trim()) {
      Alert.alert('Erro', 'Digite sua mensagem');
      return;
    }

    setSending(true);
    try {
      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Mensagem Enviada',
        'Sua mensagem foi enviada com sucesso! Entraremos em contato em breve.',
        [{ text: 'OK', onPress: () => setMessage('') }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar a mensagem');
    } finally {
      setSending(false);
    }
  };

  const renderSupportOption = (option) => (
    <TouchableOpacity
      key={option.id}
      style={styles.supportOption}
      onPress={option.onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.supportIcon, { backgroundColor: `${option.color}15` }]}>
        <Ionicons name={option.icon} size={24} color={option.color} />
      </View>
      <View style={styles.supportInfo}>
        <Text style={styles.supportTitle}>{option.title}</Text>
        <Text style={styles.supportSubtitle}>{option.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderFAQItem = (item, index) => (
    <View key={index} style={styles.faqItem}>
      <Text style={styles.faqQuestion}>{item.question}</Text>
      <Text style={styles.faqAnswer}>{item.answer}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ajuda e Suporte</Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Support Options */}
        <View style={styles.supportSection}>
          <Text style={styles.sectionTitle}>Canais de Atendimento</Text>
          <View style={styles.supportList}>
            {supportOptions.map(renderSupportOption)}
          </View>
        </View>

        {/* Contact Form */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Envie uma Mensagem</Text>
          <View style={styles.contactForm}>
            <TextInput
              style={styles.messageInput}
              placeholder="Descreva sua dúvida ou problema..."
              placeholderTextColor={Colors.textSecondary}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={sendMessage}
              disabled={sending}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={styles.sendButtonGradient}
              >
                <Ionicons name="send" size={20} color={Colors.surface} />
                <Text style={styles.sendButtonText}>
                  {sending ? 'Enviando...' : 'Enviar Mensagem'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Perguntas Frequentes</Text>
          <View style={styles.faqList}>
            {faqItems.map(renderFAQItem)}
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color={Colors.info} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Horário de Atendimento</Text>
              <Text style={styles.infoText}>
                Segunda a Sexta: 8h às 18h{'\n'}
                Sábado: 8h às 12h{'\n'}
                Suporte por WhatsApp: 24h
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.surface,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  // Support Section
  supportSection: {
    padding: 20,
  },
  supportList: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  supportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: `${Colors.border}30`,
  },
  supportIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  supportInfo: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  supportSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  // Contact Section
  contactSection: {
    padding: 20,
    paddingTop: 0,
  },
  contactForm: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.background,
    minHeight: 120,
    marginBottom: 16,
  },
  sendButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.surface,
  },
  // FAQ Section
  faqSection: {
    padding: 20,
    paddingTop: 0,
  },
  faqList: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  faqItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: `${Colors.border}30`,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  // Info Section
  infoSection: {
    padding: 20,
    paddingTop: 0,
  },
  infoCard: {
    backgroundColor: `${Colors.info}10`,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.info,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 40,
  },
});

export default HelpSupportScreen;