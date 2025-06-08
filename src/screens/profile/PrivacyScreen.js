import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';

const PrivacyScreen = ({ navigation }) => {
  const privacySections = [
    {
      title: 'Coleta de Informações',
      content: `Coletamos as seguintes informações:

- Dados pessoais (nome, email, telefone)
- Informações dos pacientes (pets)
- Dados de consultas e histórico médico
- Informações de uso do aplicativo
- Dados de dispositivo para melhorar a experiência

Todas as informações são coletadas com seu consentimento explícito.`,
    },
    {
      title: 'Uso das Informações',
      content: `Utilizamos seus dados para:

- Fornecer e melhorar nossos serviços
- Processar e gerenciar consultas
- Enviar notificações e lembretes
- Manter histórico médico dos pacientes
- Suporte técnico e atendimento ao cliente
- Análises estatísticas (dados anonimizados)

Nunca vendemos ou compartilhamos dados pessoais com terceiros sem autorização.`,
    },
    {
      title: 'Armazenamento e Segurança',
      content: `Seus dados são protegidos por:

- Criptografia de ponta a ponta
- Servidores seguros com certificação
- Backup automático e redundância
- Acesso restrito apenas a pessoal autorizado
- Monitoramento contínuo de segurança
- Conformidade com LGPD e GDPR

Os dados são armazenados em datacenters no Brasil, seguindo as leis locais.`,
    },
    {
      title: 'Seus Direitos',
      content: `Você tem o direito de:

- Acessar seus dados pessoais
- Corrigir informações incorretas
- Solicitar exclusão de dados
- Portabilidade dos dados
- Revogar consentimentos
- Ser informado sobre vazamentos
- Contestar decisões automatizadas

Para exercer seus direitos, entre em contato conosco.`,
    },
    {
      title: 'Compartilhamento de Dados',
      content: `Podemos compartilhar dados apenas em casos específicos:

- Com seu consentimento explícito
- Para cumprir obrigações legais
- Para proteger direitos e segurança
- Com prestadores de serviços (sob contrato)
- Em caso de fusão ou aquisição (com aviso prévio)

Nunca compartilhamos dados para fins comerciais ou publicitários.`,
    },
    {
      title: 'Cookies e Tecnologias',
      content: `Utilizamos tecnologias para melhorar a experiência:

- Cookies essenciais para funcionamento
- Analytics para melhorar o serviço
- Preferências de configuração
- Cache para performance

Você pode controlar essas configurações no seu dispositivo.`,
    },
    {
      title: 'Retenção de Dados',
      content: `Mantemos seus dados pelo tempo necessário:

- Dados de conta: enquanto ativa
- Histórico médico: conforme regulamentação veterinária
- Logs de sistema: até 12 meses
- Dados de backup: até 5 anos
- Dados anonimizados: indefinidamente

Você pode solicitar exclusão a qualquer momento.`,
    },
    {
      title: 'Alterações na Política',
      content: `Esta política pode ser atualizada periodicamente:

- Notificaremos sobre mudanças significativas
- Versão atualizada será publicada no app
- Data da última revisão será indicada
- Período de adaptação para mudanças importantes

Recomendamos revisar esta política regularmente.`,
    },
  ];

  const renderSection = (section, index) => (
    <View key={index} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionContent}>{section.content}</Text>
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
          <Text style={styles.headerTitle}>Política de Privacidade</Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Introduction */}
        <View style={styles.introSection}>
          <View style={styles.introCard}>
            <Ionicons name="shield-checkmark" size={32} color={Colors.primary} />
            <Text style={styles.introTitle}>Sua Privacidade é Importante</Text>
            <Text style={styles.introText}>
              Esta política explica como coletamos, usamos e protegemos suas informações pessoais no VetApp. 
              Estamos comprometidos em manter seus dados seguros e privados.
            </Text>
            <Text style={styles.lastUpdated}>
              Última atualização: 01 de Janeiro de 2024
            </Text>
          </View>
        </View>

        {/* Privacy Sections */}
        <View style={styles.sectionsContainer}>
          {privacySections.map(renderSection)}
        </View>

        {/* Contact */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Dúvidas sobre Privacidade?</Text>
          <Text style={styles.contactText}>
            Se você tiver dúvidas sobre esta política ou sobre como tratamos seus dados, 
            entre em contato conosco:
          </Text>
          
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Ionicons name="mail" size={16} color={Colors.primary} />
              <Text style={styles.contactItemText}>privacidade@vetapp.com</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="call" size={16} color={Colors.primary} />
              <Text style={styles.contactItemText}>(11) 9999-9999</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="location" size={16} color={Colors.primary} />
              <Text style={styles.contactItemText}>São Paulo, SP - Brasil</Text>
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
  // Introduction
  introSection: {
    padding: 20,
  },
  introCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  introText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  lastUpdated: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  // Sections
  sectionsContainer: {
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  // Contact Section
  contactSection: {
    padding: 20,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  contactText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  contactInfo: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  contactItemText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 40,
  },
});

export default PrivacyScreen;