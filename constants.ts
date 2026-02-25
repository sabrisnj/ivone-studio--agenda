
import { Service, ServiceCategory, Voucher } from './types';

export const COLORS = {
  primary: '#D99489',
  secondary: '#86BDB1',
  accent: '#8B5E3C',
  background: '#FFF9F8',
  text: '#4A3B39',
};

export const SALON_INFO = {
  whatsapp: '+55 11 99730-8578',
  pixKey: 'ivoneperpetuo13@gmail.com',
  address: 'R. Olinda, 23 - Jardim Nova Pietro, São Bernardo do Campo - SP, 09770-070',
  instagram: '@ivonehairstudio'
};

export const TERMS_TEXT = `📄 Termos de Uso e Política de Privacidade – Ivone Studio

1. Coleta e Uso de Dados
Ao utilizar nossa aplicação de agendamento, o Ivone Studio coleta informações pessoais como nome e telefone.
Finalidade Exclusiva: Esses dados são utilizados para organizar a agenda e segurança.
Proteção de Dados: Seus dados não serão compartilhados fora do ecossistema do Ivone Studio.

2. Comunicações e Notificações
Você autoriza o envio de notificações de agendamento e lembretes via WhatsApp e Push.

3. Consentimento
Ao clicar em "Aceito", você declara estar ciente de que o Ivone Studio atua em conformidade com a LGPD.`;

export const WEEKLY_OFFERS = [
  { 
    day: 2, // Terça
    title: 'Terça-Feira da Beleza',
    offers: [
      { id: '2', name: 'Escova + Hidratação', desc: 'Tratamento de brilho', price: 55 },
      { id: '3', name: 'Manicure + Pedicure', desc: 'Ritual completo', price: 55 },
      { id: '3-m', name: 'Manicure', desc: 'Esmaltação simples', price: 30 }
    ]
  },
  { 
    day: 3, // Quarta
    title: 'Quarta-Feira: Corte & Secagem',
    offers: [
      { id: '5', name: 'Corte Design + Secagem', desc: 'Visagismo e finalização', price: 65 }
    ]
  }
];

export const SERVICES: Service[] = [
  { 
    id: '1', 
    name: 'Coloração Premium', 
    category: ServiceCategory.HAIR, 
    duration: '120 min', 
    price: 0,
    description: 'Tratamento de cor com tecnologia botânica que preserva a saúde da fibra.' 
  },
  { 
    id: '2', 
    name: 'Escova Modelada', 
    category: ServiceCategory.HAIR, 
    duration: '45 min', 
    price: 0,
    description: 'Finalização profissional com movimento natural e brilho intenso.' 
  },
  { 
    id: '3', 
    name: 'Manicure + Pedicure SPA', 
    category: ServiceCategory.NAILS, 
    duration: '90 min', 
    price: 0,
    description: 'Ritual completo com esfoliação de sais marinhos e hidratação.' 
  },
  { 
    id: '4', 
    name: 'Extensão de Cílios', 
    category: ServiceCategory.FACE, 
    duration: '120 min', 
    price: 0,
    description: 'Técnica fio a fio para um olhar marcante e natural.' 
  },
  { 
    id: '5', 
    name: 'Corte Design', 
    category: ServiceCategory.HAIR, 
    duration: '60 min', 
    price: 0,
    description: 'Corte personalizado seguindo visagismo e tendências.' 
  },
  { 
    id: '6', 
    name: 'Massagem Relaxante', 
    category: ServiceCategory.MASSAGE, 
    duration: '60 min', 
    price: 0,
    description: 'Ritual com óleos essenciais para alívio de tensões e relaxamento profundo.' 
  }
];

export const MOCK_VOUCHERS: Voucher[] = [
  { id: 'v1', name: 'Mimo Boas-vindas', description: 'Desconto especial no seu primeiro serviço.', limit: 10, redeemed: 7 },
  { id: 'v2', name: 'Reserva Antecipada', description: 'Spa dos Pés incluso para agendamentos matinais.', limit: 5, redeemed: 4 },
];
