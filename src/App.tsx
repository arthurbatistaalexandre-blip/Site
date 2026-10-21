import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coffee, 
  MapPin, 
  Clock, 
  Phone, 
  ArrowRight, 
  ShoppingBag, 
  Check, 
  Plus, 
  Minus, 
  X, 
  Sparkles, 
  ChevronDown,
  MessageCircle,
  ExternalLink,
  Flame,
  Award
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  category: 'roscas' | 'cafes' | 'bolos' | 'salgados' | 'doces' | 'sucos';
  categoryLabel: string;
  price: number;
  description: string;
  tag?: string;
  image: string;
  featured?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'rosca-rainha',
    name: 'Rosca Colonial Trançada',
    category: 'roscas',
    categoryLabel: 'Roscas & Pães',
    price: 26.0,
    description: 'Massa fofa de fermentação natural com calda cristalizada de leite e toque sutil de canela.',
    tag: 'Fornada Quente',
    image: '/src/assets/images/rosca_trancada_1792459624404.jpg',
    featured: true
  },
  {
    id: 'cafe-coado',
    name: 'Café Coado no Pano',
    category: 'cafes',
    categoryLabel: 'Cafés Especiais',
    price: 9.5,
    description: 'Grãos 100% arábica do cerrado goiano, moídos na hora e passados individualmente à sua mesa.',
    tag: 'Grão Especial',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'bolo-milho',
    name: 'Bolo Cremoso de Milho da Roça',
    category: 'bolos',
    categoryLabel: 'Bolos da Vovó',
    price: 15.0,
    description: 'Feito com espigas frescas colhidas no dia, textura úmida e casquinha delicada.',
    tag: 'Mais Pedido',
    image: '/src/assets/images/bolo_milho_1792459624177.jpg',
    featured: true
  },
  {
    id: 'pao-queijo',
    name: 'Pão de Queijo Canastra',
    category: 'salgados',
    categoryLabel: 'Quitandas & Salgados',
    price: 8.5,
    description: 'Polvilho artesanal e queijo meia-cura da serra. Casquinha crocante e miolo puxa-puxa.',
    tag: 'Tradicional',
    image: '/src/assets/images/pao_queijo_1792459624811.jpg',
    featured: true
  },
  {
    id: 'doce-leite',
    name: 'Doce de Leite em Tacho & Queijo',
    category: 'doces',
    categoryLabel: 'Doces de Tacho',
    price: 18.0,
    description: 'Seis horas de cozimento lento no tacho de cobre com leite fresco da fazenda.',
    image: '/src/assets/images/doce_leite_1792459626273.jpg'
  },
  {
    id: 'suco-laranja',
    name: 'Suco de Laranja da Roça',
    category: 'sucos',
    categoryLabel: 'Sucos & Bebidas',
    price: 12.0,
    description: 'Puro suco de laranjas selecionadas espremido na hora da sua solicitação, sem conservantes.',
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'rosca-coco',
    name: 'Rosca Húngara de Coco & Leite Condensado',
    category: 'roscas',
    categoryLabel: 'Roscas & Pães',
    price: 28.0,
    description: 'Enroladinhos dourados com recheio úmido de coco fresco ralado e calda caramelizada.',
    image: '/src/assets/images/rosca_coco_1792459626544.jpg'
  },
  {
    id: 'cappuccino-estacao',
    name: 'Cappuccino Artesanal da Estação',
    category: 'cafes',
    categoryLabel: 'Cafés Especiais',
    price: 14.0,
    description: 'Espresso encorpado, leite vaporizado aveludado, cacau 70% e pitada aromática de canela.',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bolo-cenoura',
    name: 'Bolo de Cenoura com Ganache Quente',
    category: 'bolos',
    categoryLabel: 'Bolos da Vovó',
    price: 16.0,
    description: 'Fatia generosa com calda vulcão de chocolate belga aplicada na hora de servir.',
    image: '/src/assets/images/bolo_cenoura_1792459626552.jpg'
  },
  {
    id: 'empada-frango',
    name: 'Empada Goiana com Pequi & Frango',
    category: 'salgados',
    categoryLabel: 'Quitandas & Salgados',
    price: 13.0,
    description: 'Massa podre que derrete na boca, recheio úmido de peito desfiado, azeitonas e toque goiano.',
    image: '/src/assets/images/empada_goiana_1792459626495.jpg'
  }
];

const CATEGORIES = [
  { key: 'todos', label: 'Todos os Itens' },
  { key: 'roscas', label: 'Roscas & Pães' },
  { key: 'cafes', label: 'Cafés Especiais' },
  { key: 'bolos', label: 'Bolos da Vovó' },
  { key: 'salgados', label: 'Quitandas' },
  { key: 'doces', label: 'Doces de Tacho' },
  { key: 'sucos', label: 'Sucos Naturais' },
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [formState, setFormState] = useState({
    nome: '',
    assunto: 'Encomenda de Roscas e Pães',
    mensagem: ''
  });
  const [formSent, setFormSent] = useState(false);

  // Check if store is open based on local time (07:00 to 19:00 everyday)
  const isStoreOpen = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= 7 && currentHour < 19;
  }, []);

  const totalCartCount = useMemo(() => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  }, [cart]);

  const totalCartPrice = useMemo(() => {
    return Object.entries(cart).reduce((sum, [id, count]) => {
      const item = MENU_ITEMS.find(m => m.id === id);
      return sum + (item ? item.price * count : 0);
    }, 0);
  }, [cart]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'todos') return MENU_ITEMS;
    return MENU_ITEMS.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);

  const addToCart = (id: string) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const updated = { ...prev };
      if (updated[id] > 1) {
        updated[id] -= 1;
      } else {
        delete updated[id];
      }
      return updated;
    });
  };

  const clearCart = () => setCart({});

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const generateCartWhatsAppUrl = () => {
    if (totalCartCount === 0) {
      return `https://wa.me/5564992711745?text=${encodeURIComponent('Olá! Gostaria de fazer um pedido na Estação do Café.')}`;
    }

    let text = "Olá! Gostaria de fazer um pedido na Estação do Café:\n\n";
    Object.entries(cart).forEach(([id, count]) => {
      const item = MENU_ITEMS.find(m => m.id === id);
      if (item) {
        text += `• ${count}x ${item.name} (${formatPrice(item.price * count)})\n`;
      }
    });
    text += `\n*Valor Total Previsto:* ${formatPrice(totalCartPrice)}\n\nPor favor, confirmem a disponibilidade para retirada ou entrega em Caldas Novas.`;
    return `https://wa.me/5564992711745?text=${encodeURIComponent(text)}`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.nome.trim()) return;

    const messageText = `Olá! Meu nome é ${formState.nome}.\n*Assunto:* ${formState.assunto}\n\n*Mensagem:*\n${formState.mensagem || 'Gostaria de solicitar informações e fazer um pedido com vocês.'}`;
    const url = `https://wa.me/5564992711745?text=${encodeURIComponent(messageText)}`;
    
    setFormSent(true);
    // Direct safe window location or anchor trigger
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 relative selection:bg-[#D4AF37] selection:text-[#0F172A]">
      <div className="film-grain" aria-hidden="true" />

      {/* TOP NOTIFICATION BAR: STATUS & CAFE COLONIAL HIGHLIGHT */}
      <div className="bg-[#141E33] border-b border-[#D4AF37]/25 py-2.5 px-6 text-xs tracking-wider text-slate-300 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <span className="flex items-center gap-1.5 font-medium text-slate-200">
          <span className={`inline-block w-2 h-2 rounded-full ${isStoreOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          {isStoreOpen ? 'Cafeteria aberta agora até 19:00' : 'Abre diariamente às 07:00'}
        </span>
        <span className="text-[#D4AF37]/50 hidden sm:inline">•</span>
        <span className="text-[#D4AF37] font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          <span>Café Colonial: Seg a Qui R$ 34,99 | Sex a Dom R$ 37,99 (07h às 12h30)</span>
        </span>
        <span className="text-[#D4AF37]/50 hidden md:inline">•</span>
        <a 
          href="https://wa.me/5564992711745?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20o%20Caf%C3%A9%20Colonial%20na%20Esta%C3%A7%C3%A3o%20do%20Caf%C3%A9."
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-300 hover:text-[#D4AF37] font-medium transition-colors hidden lg:inline"
        >
          (64) 99271-1745
        </a>
      </div>

      {/* NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#0F172A]/90 backdrop-blur-md border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 md:h-24 flex items-center justify-between">
          
          <a href="#inicio" className="group flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-[#D4AF37]/40 flex items-center justify-center bg-[#141E33] text-[#D4AF37] group-hover:border-[#D4AF37] transition-colors">
              <Coffee className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl md:text-2xl text-white tracking-wide font-normal">
                Estação <span className="italic text-[#D4AF37] font-light">do Café</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 -mt-1 font-sans">
                Caldas Novas
              </span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center space-x-8 text-xs tracking-[0.2em] uppercase font-medium">
            <a href="#inicio" className="text-slate-300 hover:text-[#D4AF37] transition-colors">Início</a>
            <a href="#cafe-colonial" className="text-[#D4AF37] hover:text-[#F3E5AB] font-semibold transition-colors flex items-center gap-1.5 border border-[#D4AF37]/40 px-3 py-1 bg-[#141E33]/70">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>Café Colonial</span>
            </a>
            <a href="#cardapio" className="text-slate-300 hover:text-[#D4AF37] transition-colors">Cardápio</a>
            <a href="#sobre" className="text-slate-300 hover:text-[#D4AF37] transition-colors">Tradição</a>
            <a href="#encomendas" className="text-slate-300 hover:text-[#D4AF37] transition-colors">Encomendas</a>
            <a href="#contato" className="text-slate-300 hover:text-[#D4AF37] transition-colors">Contato</a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Sacola Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded border border-white/10 hover:border-[#D4AF37]/60 text-slate-200 hover:text-[#D4AF37] transition-colors bg-[#141E33]/70"
              title="Ver Sacola de Pedidos"
              aria-label="Ver Sacola de Pedidos"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D4AF37] text-[#0F172A] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Direct WhatsApp CTA */}
            <a 
              href="https://wa.me/5564992711745?text=Ol%C3%A1!%20Gostaria%20de%20fazer%20um%20pedido%20ou%20reservar%20uma%20mesa%20na%20Esta%C3%A7%C3%A3o%20do%20Caf%C3%A9."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#0F172A] font-semibold text-xs tracking-[0.18em] uppercase transition-all duration-300 gold-glow-sm cursor-pointer"
            >
              <span>Entrar em contato</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </header>

      {/* SEÇÃO 1: HERO — PRIMEIRA TELA IMPECÁVEL */}
      <section id="inicio" className="relative min-h-[90vh] md:min-h-screen flex items-center pt-16 pb-20 px-6 md:px-12 border-b border-white/5 overflow-hidden">
        
        {/* Subtle decorative gold circle blur */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Confident, big typography */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 z-10 space-y-8"
          >
            <div className="inline-flex items-center gap-3 text-[#D4AF37] text-xs tracking-[0.25em] uppercase font-semibold">
              <span className="w-8 h-px bg-[#D4AF37]" />
              <span>Cafeteria Colonial · Caldas Novas</span>
            </div>

            <h1 className="font-serif text-white font-normal leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(2.75rem, 6.2vw, 5.8rem)' }}>
              O calor do forno.<br />
              <span className="italic text-[#D4AF37] font-light">A alma</span> do café.
            </h1>

            <p className="text-slate-300 text-base md:text-lg max-w-lg font-light leading-relaxed">
              Roscas coloniais açucaradas saindo quentinhas a toda hora, quitandas com sabor de infância e o tradicional <strong className="text-white font-medium">Café Colonial servido diariamente das 07h às 12h30</strong>.
            </p>

            {/* Direct Highlights for Cafe Colonial Banner */}
            <div className="p-4 bg-[#141E33]/80 border-l-2 border-[#D4AF37] max-w-lg space-y-1 text-xs">
              <div className="flex items-center justify-between font-semibold text-white">
                <span className="text-[#D4AF37] uppercase tracking-wider font-sans">Café Colonial Livre:</span>
                <span className="text-slate-300">07:00 às 12:30</span>
              </div>
              <p className="text-slate-300">
                Segunda a quinta <span className="text-[#D4AF37] font-bold">R$ 34,99</span> • Sexta a domingo <span className="text-[#D4AF37] font-bold">R$ 37,99</span>
              </p>
              <p className="text-slate-400 text-[11px]">
                Crianças de 0 a 3 anos não pagam • 4 a 9 anos apenas R$ 24,99
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a 
                href="#cafe-colonial" 
                className="group inline-flex justify-center items-center px-8 py-4 bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#0F172A] font-semibold text-xs tracking-[0.22em] uppercase transition-all duration-300 gold-glow cursor-pointer"
              >
                <span>Conhecer Café Colonial</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </a>

              <a 
                href="#cardapio" 
                className="inline-flex justify-center items-center px-8 py-4 border border-slate-700 hover:border-[#D4AF37]/60 text-slate-200 hover:text-[#D4AF37] text-xs tracking-[0.22em] uppercase transition-all duration-300 font-medium bg-[#141E33]/30"
              >
                Ver Cardápio Digital
              </a>
            </div>

            {/* Quick trust cues */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 tracking-wider">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#D4AF37]" />
                <span>Fornadas a cada 40 minutos</span>
              </div>
              <span className="text-slate-600">•</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span>Cafeteria aberta até 19:00</span>
              </div>
            </div>

          </motion.div>

          {/* Hero Visual — Large photographic composition */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative w-full aspect-[4/5] rounded-none overflow-hidden border border-[#D4AF37]/30 shadow-2xl bg-[#141E33]">
              <img 
                src="/src/assets/images/rosca_trancada_1792459624404.jpg" 
                alt="Roscas artesanais e pães coloniais quentinhos saindo do forno na Estação do Café" 
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out brightness-95"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-transparent to-transparent pointer-events-none" />
              
              {/* Floating artisan card */}
              <div className="absolute bottom-6 left-6 right-6 p-4 backdrop-blur-md bg-[#0F172A]/85 border border-[#D4AF37]/30">
                <div className="flex items-center gap-2 text-[#D4AF37] text-xs uppercase tracking-widest font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Assado Diariamente</span>
                </div>
                <p className="font-serif text-white text-base">Roscas Trançadas & Pão Colonial</p>
                <p className="text-slate-400 text-xs mt-1 font-light">Receita centenária com manteiga caipira e açúcar cristal.</p>
              </div>
            </div>

            {/* Subtle background frame offset */}
            <div className="hidden sm:block absolute -bottom-4 -right-4 w-full h-full border border-[#D4AF37]/15 -z-10 pointer-events-none" />
          </motion.div>

        </div>

        {/* Scroll invitation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 text-[10px] tracking-[0.25em] uppercase text-slate-500">
          <span>Role para explorar</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37] animate-bounce" />
        </div>

      </section>

      {/* SEÇÃO EM DESTAQUE: CAFÉ COLONIAL COMPLETO */}
      <section id="cafe-colonial" className="py-24 md:py-36 px-6 md:px-12 border-b border-white/5 relative bg-[#121A2D]">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 space-y-4">
            <div className="inline-flex items-center gap-2 text-[#D4AF37] text-xs tracking-[0.25em] uppercase font-semibold border border-[#D4AF37]/30 px-3.5 py-1.5 bg-[#0F172A]/80">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>A Grande Experiência da Estação</span>
            </div>

            <h2 className="font-serif text-3xl md:text-6xl text-white font-normal leading-tight">
              O Tradicional Café Colonial
            </h2>

            <p className="text-slate-300 text-sm md:text-lg font-light leading-relaxed">
              Mesa farta ao estilo das históricas fazendas de Goiás. Mais de 40 delícias artesanais servidas em buffet livre com fornadas quentinhas, quitandas e cafés especiais.
            </p>

            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF37] bg-[#141E33] px-4 py-2 border border-[#D4AF37]/30">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <span>Servido diariamente das 07:00 às 12:30</span>
            </div>
          </div>

          {/* Grand Banquet Picture Banner */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden border border-[#D4AF37]/30 shadow-2xl mb-16">
            <img 
              src="/src/assets/images/cafe_colonial_mesa_1792553602315.jpg" 
              alt="Banquete de Café Colonial na Estação do Café em Caldas Novas" 
              className="w-full h-full object-cover object-center brightness-95"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-6 left-6 right-6 md:left-10 md:bottom-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="bg-[#0F172A]/85 backdrop-blur-md p-4 border border-[#D4AF37]/30 max-w-md">
                <p className="text-xs text-[#D4AF37] uppercase tracking-widest font-semibold">Buffet Livre à Vontade</p>
                <p className="text-white text-sm font-light mt-0.5">Roscas quentes, pães de queijo, broas, bolos, frios, frutas da estação e sucos naturais.</p>
              </div>

              <a 
                href="https://wa.me/5564992711745?text=Ol%C3%A1!%20Gostaria%20de%20reservar%20uma%20mesa%20para%20o%20Caf%C3%A9%20Colonial%20na%20Esta%C3%A7%C3%A3o%20do%20Caf%C3%A9."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#0F172A] font-semibold text-xs tracking-wider uppercase transition-all shadow-xl gold-glow cursor-pointer whitespace-nowrap self-start sm:self-auto"
              >
                <span>Reservar Mesa no WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Pricing & Days Grid — Exact values requested */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Segunda a Quinta */}
            <div className="bg-[#141E33]/70 border border-white/10 hover:border-[#D4AF37]/50 p-8 transition-all flex flex-col justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold block mb-2">
                  Segunda a Quinta-feira
                </span>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="font-serif text-4xl lg:text-5xl text-white font-normal">R$ 34,99</span>
                  <span className="text-xs text-slate-400">/ pessoa</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed font-light mb-6">
                  Comece o seu dia com fartura e tranquilidade. Todo o buffet colonial disponível à vontade.
                </p>
                
                <ul className="space-y-2.5 text-xs text-slate-300 border-t border-white/10 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Buffet completo das 07:00 às 12:30</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Roscas saindo quentinhas do forno</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Cafés passados na hora e quitandas</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10">
                <a
                  href="https://wa.me/5564992711745?text=Ol%C3%A1!%20Gostaria%20de%20visitar%20o%20Caf%C3%A9%20Colonial%20entre%20segunda%20e%20quinta%20(R%24%2034%2C99)."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex justify-center items-center py-3 border border-white/20 hover:border-[#D4AF37] text-slate-200 hover:text-[#D4AF37] text-xs uppercase tracking-widest font-semibold transition-colors"
                >
                  Consultar Disponibilidade
                </a>
              </div>
            </div>

            {/* Card 2: Sexta a Domingo & Feriados (Featured) */}
            <div className="bg-[#141E33] border-2 border-[#D4AF37] p-8 transition-all flex flex-col justify-between relative shadow-2xl gold-glow">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-[#0F172A] text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                Fim de Semana Especial
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold block mb-2">
                  Sexta a Domingo
                </span>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="font-serif text-4xl lg:text-5xl text-[#D4AF37] font-normal">R$ 37,99</span>
                  <span className="text-xs text-slate-300">/ pessoa</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed font-light mb-6">
                  O café da manhã colonial mais procurado de Caldas Novas. Variedade ampliada e fornadas extras a cada 30 minutos.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-200 border-t border-white/10 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Buffet completo das 07:00 às 12:30</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Fornadas especiais de roscas e empadas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Bolos da vovó quentinhos e doces de tacho</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10">
                <a
                  href="https://wa.me/5564992711745?text=Ol%C3%A1!%20Gostaria%20de%20reservar%20uma%20mesa%20para%20o%20Caf%C3%A9%20Colonial%20no%20fim%20de%20semana%20(R%24%2037%2C99)."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex justify-center items-center py-3 bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#0F172A] text-xs uppercase tracking-widest font-semibold transition-colors"
                >
                  Garantir Mesa no Fim de Semana
                </a>
              </div>
            </div>

            {/* Card 3: Crianças e Famílias */}
            <div className="bg-[#141E33]/70 border border-white/10 hover:border-[#D4AF37]/50 p-8 transition-all flex flex-col justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold block mb-2">
                  Crianças & Família
                </span>

                <div className="my-4 space-y-3">
                  <div className="p-3 bg-[#0F172A] border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white">0 a 3 anos</p>
                      <p className="text-[11px] text-slate-400">Cortesia da casa</p>
                    </div>
                    <span className="text-emerald-400 font-serif text-lg font-medium">Não Pagam</span>
                  </div>

                  <div className="p-3 bg-[#0F172A] border border-[#D4AF37]/30 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white">4 a 9 anos</p>
                      <p className="text-[11px] text-slate-400">Valor especial infantil</p>
                    </div>
                    <span className="text-[#D4AF37] font-serif text-lg font-medium">R$ 24,99</span>
                  </div>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed font-light mb-4">
                  A partir de 10 anos aplica-se a tarifa integral do dia correspondente. Traga toda a família para vivenciar essa tradição.
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-white/10">
                <a
                  href="https://wa.me/5564992711745?text=Ol%C3%A1!%20Gostaria%20de%20saber%20sobre%20mesas%20para%20fam%C3%ADlia%20com%20crian%C3%A7as%20no%20Caf%C3%A9%20Colonial."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex justify-center items-center py-3 border border-white/20 hover:border-[#D4AF37] text-slate-200 hover:text-[#D4AF37] text-xs uppercase tracking-widest font-semibold transition-colors"
                >
                  Tirar Dúvidas com Atendente
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SEÇÃO 2: PRODUTOS & CARDÁPIO DIGITAL */}
      <section id="cardapio" className="py-24 md:py-36 px-6 md:px-12 border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16">
            <div>
              <span className="text-[#D4AF37] text-xs tracking-[0.25em] uppercase font-semibold block mb-3">
                Cardápio Digital Colonial
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-white font-normal">
                Sabor que conforta a alma
              </h2>
            </div>
            <p className="text-slate-400 text-sm md:text-base max-w-md mt-4 md:mt-0 font-light leading-relaxed">
              Escolha suas delícias artesanais e monte seu pedido direto no WhatsApp para retirada imediata ou entrega em Caldas Novas.
            </p>
          </div>

          {/* Category Filter Pills with Minimal Luxury Style */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none border-b border-white/10">
            {CATEGORIES.map(cat => {
              const active = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-4 py-2.5 text-xs tracking-wider uppercase font-medium whitespace-nowrap transition-all duration-300 border ${
                    active 
                      ? 'border-[#D4AF37] bg-[#D4AF37] text-[#0F172A] font-semibold' 
                      : 'border-white/10 text-slate-400 hover:text-white hover:border-[#D4AF37]/40 bg-[#141E33]/40'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Products Grid — Asymmetric, High-End Card Presentation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => {
              const countInCart = cart[item.id] || 0;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group bg-[#141E33]/50 border border-white/5 hover:border-[#D4AF37]/40 p-6 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Container with Badges */}
                    <div className="relative aspect-[16/10] overflow-hidden mb-5 bg-[#0F172A]">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-95"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-transparent to-transparent pointer-events-none" />
                      
                      {item.tag && (
                        <span className="absolute top-3 left-3 bg-[#0F172A]/90 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] tracking-wider uppercase font-semibold px-2.5 py-1 backdrop-blur-sm">
                          {item.tag}
                        </span>
                      )}

                      <span className="absolute bottom-3 right-3 text-white font-serif text-lg font-medium px-2 py-0.5 bg-[#0F172A]/85 backdrop-blur-sm border border-white/10">
                        {formatPrice(item.price)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="mb-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/80 font-medium">
                        {item.categoryLabel}
                      </span>
                      <h3 className="font-serif text-xl text-white group-hover:text-[#D4AF37] transition-colors mt-0.5 leading-snug">
                        {item.name}
                      </h3>
                    </div>

                    <p className="text-slate-400 text-xs leading-relaxed font-light mb-6">
                      {item.description}
                    </p>
                  </div>

                  {/* Actions: Add to Order / Counter */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    {countInCart > 0 ? (
                      <div className="flex items-center gap-3 bg-[#0F172A] border border-[#D4AF37]/40 px-2 py-1">
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-slate-300 hover:text-[#D4AF37] transition-colors"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-semibold text-white px-1">{countInCart}</span>
                        <button 
                          onClick={() => addToCart(item.id)}
                          className="p-1 text-slate-300 hover:text-[#D4AF37] transition-colors"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item.id)}
                        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#D4AF37] hover:text-[#F3E5AB] font-semibold transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar à Sacola</span>
                      </button>
                    )}

                    <a 
                      href={`https://wa.me/5564992711745?text=${encodeURIComponent(`Olá! Gostaria de pedir: 1x ${item.name} (${formatPrice(item.price)}) na Estação do Café.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] uppercase tracking-wider text-slate-400 hover:text-[#D4AF37] flex items-center gap-1 transition-colors"
                    >
                      <span>Pedir Avulso</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>

                </motion.div>
              );
            })}
          </div>

          {/* Quick Notice on Freshness */}
          <div className="mt-12 p-6 bg-[#141E33]/30 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
              <span>Deseja um item que não está na lista ou pedido corporativo? Fale diretamente com nossos mestres padeiros.</span>
            </div>
            <a 
              href="https://wa.me/5564992711745?text=Ol%C3%A1!%20Gostaria%20de%20consultar%20outros%20sabores%20do%20dia%20na%20Esta%C3%A7%C3%A3o%20do%20Caf%C3%A9."
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4AF37] font-semibold hover:underline uppercase tracking-wider whitespace-nowrap"
            >
              Consultar Sabores do Dia ↗
            </a>
          </div>

        </div>
      </section>

      {/* SEÇÃO 3: SOBRE & TRADIÇÃO — RITMO EDITORIAL */}
      <section id="sobre" className="py-24 md:py-36 px-6 md:px-12 border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Visual Left */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 relative"
            >
              <div className="relative border border-[#D4AF37]/30 p-2 md:p-3 bg-[#141E33]">
                <img 
                  src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1100&q=85" 
                  alt="Ritual colonial do café coado no bule na Estação do Café" 
                  className="w-full aspect-[4/3] object-cover brightness-90 contrast-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="p-4 bg-[#0F172A] border-t border-white/10 flex items-center justify-between text-xs tracking-widest text-slate-400 uppercase">
                  <span>Caldas Novas · Goiás</span>
                  <span className="text-[#D4AF37] font-medium">Tradição & Amor à Mesa</span>
                </div>
              </div>
            </motion.div>

            {/* Storytelling Right */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 space-y-6"
            >
              <span className="text-[#D4AF37] text-xs tracking-[0.25em] uppercase font-semibold block">
                Nossa Essência
              </span>

              <h2 className="font-serif text-3xl md:text-5xl text-white font-normal leading-tight">
                Aqui, o tempo anda mais devagar.
              </h2>

              <p className="text-slate-300 text-sm md:text-base leading-relaxed font-light">
                A Estação do Café nasceu para reacender o ritual do café colonial das antigas fazendas do interior de Goiás. O bule de esmalte esquentando no fogão, o cheiro de rosca quente perfumando a calçada e o abraço caloroso na chegada.
              </p>

              <p className="text-slate-400 text-sm leading-relaxed font-light">
                Sem misturas prontas, sem conservantes. Cada fornada é acompanhada de perto, respeitando o descanso lento da massa e a torra perfeita do grão.
              </p>

              {/* Minimal Luxury Indicators */}
              <div className="pt-8 border-t border-white/10 grid grid-cols-2 gap-8">
                <div>
                  <p className="font-serif text-3xl md:text-4xl text-[#D4AF37] font-light">100%</p>
                  <p className="text-xs text-slate-300 uppercase tracking-widest mt-1">Artesanal & Diário</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Ingredientes puros da região</p>
                </div>
                <div>
                  <p className="font-serif text-3xl md:text-4xl text-[#D4AF37] font-light">07h às 19h</p>
                  <p className="text-xs text-slate-300 uppercase tracking-widest mt-1">Todos os Dias</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Segunda a domingo ininterrupto</p>
                </div>
              </div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* SEÇÃO 4: ENCOMENDAS — BANNER CINEMATOGRÁFICO */}
      <section id="encomendas" className="py-24 md:py-36 px-6 md:px-12 border-b border-white/5 bg-[#141E33]/40 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-4"
          >
            <span className="text-[#D4AF37] text-xs tracking-[0.25em] uppercase font-semibold block">
              Para Levar ou Celebrar
            </span>

            <h2 className="font-serif text-3xl md:text-6xl text-white font-normal leading-tight">
              O banquete colonial na sua casa ou evento.
            </h2>

            <p className="text-slate-300 text-sm md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
              Preparamos cestas de café colonial, roscas gigantes trançadas, tabuleiros de pão de queijo e bolos inteiros sob medida para pousadas, aniversários ou cafés em família em Caldas Novas.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a 
              href="https://wa.me/5564992711745?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento%20para%20uma%20encomenda%20colonial%20com%20a%20Esta%C3%A7%C3%A3o%20do%20Caf%C3%A9."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-10 py-5 bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#0F172A] font-semibold text-xs tracking-[0.25em] uppercase transition-all duration-300 gold-glow cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              <span>Solicitar Encomenda no WhatsApp</span>
            </a>

            <a 
              href="tel:+5564992711745"
              className="inline-flex items-center justify-center px-8 py-5 border border-slate-700 hover:border-[#D4AF37] text-slate-300 hover:text-[#D4AF37] font-medium text-xs tracking-[0.2em] uppercase transition-colors"
            >
              <Phone className="w-4 h-4 mr-2" />
              <span>(64) 99271-1745</span>
            </a>
          </motion.div>

          <p className="text-xs text-slate-500 tracking-wider">
            Recomendamos antecedência de 24 horas para encomendas grandes.
          </p>

        </div>
      </section>

      {/* SEÇÃO 5: CONTATO & LOCALIZAÇÃO */}
      <section id="contato" className="py-24 md:py-36 px-6 md:px-12 border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-xl mx-auto mb-16 md:mb-20">
            <span className="text-[#D4AF37] text-xs tracking-[0.25em] uppercase font-semibold block mb-3">
              Estamos em Caldas Novas
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-white font-normal">
              Faça-nos uma Visita
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Info Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 bg-[#141E33]/60 border border-white/10 p-8 md:p-12 flex flex-col justify-between"
            >
              <div className="space-y-8">
                
                {/* Endereço */}
                <div>
                  <div className="flex items-center gap-2 text-[#D4AF37] text-xs tracking-widest uppercase font-semibold mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>Endereço</span>
                  </div>
                  <p className="text-white text-base md:text-lg font-light leading-relaxed">
                    R. Machado de Assis - Termal,<br />
                    Caldas Novas - GO, 75680-106
                  </p>
                  <a 
                    href="https://maps.google.com/?q=R.+Machado+de+Assis+-+Termal,+Caldas+Novas+-+GO,+75680-106"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-xs tracking-widest uppercase text-[#D4AF37] hover:underline font-semibold"
                  >
                    <span>Abrir rota no Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Horários */}
                <div className="border-t border-white/10 pt-6">
                  <div className="flex items-center gap-2 text-[#D4AF37] text-xs tracking-widest uppercase font-semibold mb-3">
                    <Clock className="w-4 h-4" />
                    <span>Horários de Funcionamento</span>
                  </div>
                  
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-[#0F172A] border border-[#D4AF37]/35">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white font-semibold flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                          <span>Café Colonial (Buffet Livre)</span>
                        </span>
                        <span className="text-[#D4AF37] font-bold">07:00 – 12:30</span>
                      </div>
                      <p className="text-slate-300 text-[11px]">
                        Seg a Qui: <strong>R$ 34,99</strong> • Sex a Dom: <strong>R$ 37,99</strong>
                      </p>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        0 a 3 anos: Cortesia • 4 a 9 anos: R$ 24,99
                      </p>
                    </div>

                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-slate-300">Cafeteria & Quitandas à la carte</span>
                      <span className="text-white font-medium">07:00 – 19:00</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 italic">
                    Aberto todos os dias sem interrupção de almoço.
                  </p>
                </div>

                {/* Telefone */}
                <div className="border-t border-white/10 pt-6">
                  <div className="flex items-center gap-2 text-[#D4AF37] text-xs tracking-widest uppercase font-semibold mb-2">
                    <Phone className="w-4 h-4" />
                    <span>Telefone & WhatsApp</span>
                  </div>
                  <a 
                    href="tel:+5564992711745"
                    className="text-white text-xl font-serif hover:text-[#D4AF37] transition-colors block"
                  >
                    (64) 99271-1745
                  </a>
                </div>

              </div>

              <div className="pt-8 mt-6">
                <a 
                  href="https://wa.me/5564992711745?text=Ol%C3%A1%2C%20estou%20em%20Caldas%20Novas%20e%20gostaria%20de%20visitar%20a%20Esta%C3%A7%C3%A3o%20do%20Caf%C3%A9."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex justify-center items-center py-4 px-6 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0F172A] transition-all duration-300 text-xs tracking-widest uppercase font-semibold"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span>Conversar no WhatsApp Agora</span>
                </a>
              </div>

            </motion.div>

            {/* Quick Contact Form */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-6 bg-[#141E33]/60 border border-white/10 p-8 md:p-12"
            >
              <h3 className="font-serif text-2xl text-white mb-2">Mensagem Direta</h3>
              <p className="text-slate-400 text-xs mb-8">
                Envie seus dados e o que você precisa. O formulário abre o WhatsApp com tudo prontinho para agilizar seu atendimento.
              </p>

              {formSent ? (
                <div className="p-6 bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
                  <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-white font-serif text-lg">Mensagem Encaminhada!</p>
                  <p className="text-xs text-slate-300">
                    O WhatsApp da Estação do Café foi iniciado. Se não abriu, clique no botão abaixo.
                  </p>
                  <a 
                    href="https://wa.me/5564992711745?text=Ol%C3%A1!%20Gostaria%20de%20falar%20com%20a%20Esta%C3%A7%C3%A3o%20do%20Caf%C3%A9."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-xs uppercase tracking-wider text-[#D4AF37] underline"
                  >
                    Abrir WhatsApp Novamente
                  </a>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="nome" className="block text-[11px] uppercase tracking-widest text-slate-400 mb-2">
                      Seu Nome *
                    </label>
                    <input 
                      type="text" 
                      id="nome" 
                      required 
                      value={formState.nome}
                      onChange={(e) => setFormState(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Como podemos te chamar?" 
                      className="w-full bg-[#0F172A] border border-white/15 px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors placeholder:text-slate-600 rounded-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="assunto" className="block text-[11px] uppercase tracking-widest text-slate-400 mb-2">
                      Assunto
                    </label>
                    <select 
                      id="assunto"
                      value={formState.assunto}
                      onChange={(e) => setFormState(prev => ({ ...prev, assunto: e.target.value }))}
                      className="w-full bg-[#0F172A] border border-white/15 px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors rounded-none"
                    >
                      <option value="Reserva para Café Colonial (07h às 12h30)">Reserva para Café Colonial (07h às 12h30)</option>
                      <option value="Encomenda de Roscas e Pães">Encomenda de Roscas e Pães</option>
                      <option value="Dúvida sobre Cardápio do Dia">Dúvida sobre Cardápio do Dia</option>
                      <option value="Cesta ou Café Colonial para Pousada">Cesta ou Café para Pousada / Hotel</option>
                      <option value="Visita em Grupo ou Confraternização">Visita em Grupo ou Confraternização</option>
                      <option value="Outras Informações">Outras Informações</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="mensagem" className="block text-[11px] uppercase tracking-widest text-slate-400 mb-2">
                      Mensagem ou Detalhes do Pedido
                    </label>
                    <textarea 
                      id="mensagem" 
                      rows={3}
                      value={formState.mensagem}
                      onChange={(e) => setFormState(prev => ({ ...prev, mensagem: e.target.value }))}
                      placeholder="Ex.: Gostaria de 2 roscas quentes e 1 bolo de milho para retirar às 16h..." 
                      className="w-full bg-[#0F172A] border border-white/15 px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors placeholder:text-slate-600 rounded-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#0F172A] py-4 text-xs tracking-[0.22em] uppercase font-semibold transition-all duration-300 gold-glow cursor-pointer"
                  >
                    Enviar Mensagem via WhatsApp
                  </button>
                </form>
              )}

            </motion.div>

          </div>

        </div>
      </section>

      {/* SEÇÃO 6: FOOTER — MINIMAL & ELEGANTE */}
      <footer className="py-12 px-6 md:px-12 bg-[#0F172A] border-t border-white/10 text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
            <span className="font-serif text-lg text-white">
              Estação <span className="italic text-[#D4AF37]">do Café</span>
            </span>
          </div>

          <p className="text-xs text-slate-500 tracking-wider text-center md:text-left">
            R. Machado de Assis - Termal, Caldas Novas - GO · Tel: (64) 99271-1745
          </p>

          <a 
            href="#inicio" 
            className="text-xs uppercase tracking-widest text-slate-400 hover:text-[#D4AF37] transition-colors flex items-center gap-2"
          >
            <span>Voltar ao topo</span>
            <span>↑</span>
          </a>

        </div>
      </footer>

      {/* FLOATING SACOLA DRAWER (CARDÁPIO DIGITAL INTERACTIVE TRAY) */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-full max-w-md h-full bg-[#0F172A] border-l border-[#D4AF37]/30 z-50 p-6 md:p-8 flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                    <h3 className="font-serif text-xl text-white">Sua Sacola Colonial</h3>
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 text-slate-400 hover:text-white"
                    aria-label="Fechar sacola"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {totalCartCount === 0 ? (
                  <div className="py-16 text-center space-y-4">
                    <p className="font-serif text-lg text-slate-300">Sua sacola está vazia.</p>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Explore nosso cardápio e adicione roscas, cafés e quitandas fresquinhas.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 px-6 py-2.5 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0F172A] text-xs uppercase tracking-wider font-semibold transition-colors"
                    >
                      Explorar Cardápio
                    </button>
                  </div>
                ) : (
                  <div className="py-4 space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                    {Object.entries(cart).map(([id, count]) => {
                      const item = MENU_ITEMS.find(m => m.id === id);
                      if (!item) return null;
                      return (
                        <div key={id} className="p-3 bg-[#141E33] border border-white/5 flex items-center justify-between gap-3">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-14 h-14 object-cover border border-white/10 flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-serif text-sm text-white truncate">{item.name}</p>
                            <p className="text-xs text-[#D4AF37]">{formatPrice(item.price * count)}</p>
                          </div>
                          <div className="flex items-center gap-2 border border-white/10 px-2 py-1">
                            <button 
                              onClick={() => removeFromCart(id)} 
                              className="text-slate-400 hover:text-[#D4AF37]"
                              aria-label="Remover um"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-white px-1">{count}</span>
                            <button 
                              onClick={() => addToCart(id)} 
                              className="text-slate-400 hover:text-[#D4AF37]"
                              aria-label="Adicionar um"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    <button 
                      onClick={clearCart}
                      className="text-[11px] text-slate-500 hover:text-red-400 underline uppercase tracking-wider pt-2 block text-right w-full"
                    >
                      Esvaziar sacola
                    </button>
                  </div>
                )}
              </div>

              {totalCartCount > 0 && (
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 uppercase tracking-wider text-xs">Total Estimado</span>
                    <span className="font-serif text-2xl text-[#D4AF37] font-semibold">
                      {formatPrice(totalCartPrice)}
                    </span>
                  </div>

                  <a
                    href={generateCartWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex justify-center items-center py-4 px-6 bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#0F172A] font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-300 gold-glow cursor-pointer"
                  >
                    <span>Finalizar Pedido no WhatsApp</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>

                  <p className="text-[11px] text-center text-slate-500">
                    O pedido é enviado diretamente para nossa equipe em Caldas Novas.
                  </p>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* FLOATING ACTION PILL ON SCROLL (MOBILE QUICK ACCESS) */}
      {totalCartCount > 0 && !isCartOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 px-5 py-3.5 bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#0F172A] font-semibold text-xs tracking-wider uppercase transition-all duration-300 shadow-2xl gold-glow cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Sacola ({totalCartCount}) • {formatPrice(totalCartPrice)}</span>
          </button>
        </motion.div>
      )}

    </div>
  );
}
