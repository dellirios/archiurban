import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: 'R$ 0',
    period: '/mês',
    description: 'Para experimentar a plataforma',
    features: [
      { label: 'Até 2 projetos', included: true },
      { label: '1 usuário', included: true },
      { label: 'Chat integrado', included: true },
      { label: 'Templates básicos', included: true },
      { label: 'CRM', included: false },
      { label: 'Relatórios avançados', included: false },
      { label: 'Portfólio premium', included: false },
      { label: 'API de integração', included: false },
      { label: 'White-label', included: false },
    ],
    highlight: false,
    cta: 'Começar grátis',
  },
  {
    name: 'Basic',
    price: 'R$ 97',
    period: '/mês',
    description: 'Para pequenos escritórios',
    features: [
      { label: 'Até 5 projetos', included: true },
      { label: 'Até 3 usuários', included: true },
      { label: 'Chat integrado', included: true },
      { label: 'Templates básicos', included: true },
      { label: 'CRM', included: false },
      { label: 'Relatórios avançados', included: false },
      { label: 'Portfólio premium', included: false },
      { label: 'API de integração', included: false },
      { label: 'White-label', included: false },
    ],
    highlight: false,
    cta: 'Assinar Basic',
  },
  {
    name: 'Pro',
    price: 'R$ 197',
    period: '/mês',
    description: 'Para escritórios em crescimento',
    badge: 'Mais popular',
    features: [
      { label: 'Projetos ilimitados', included: true },
      { label: 'Até 10 usuários', included: true },
      { label: 'Chat integrado', included: true },
      { label: 'Templates avançados', included: true },
      { label: 'CRM completo', included: true },
      { label: 'Relatórios avançados', included: true },
      { label: 'Portfólio premium', included: true },
      { label: 'API de integração', included: false },
      { label: 'White-label', included: false },
    ],
    highlight: true,
    cta: 'Assinar Pro',
  },
  {
    name: 'Premium',
    price: 'R$ 397',
    period: '/mês',
    description: 'Para grandes escritórios e empresas',
    features: [
      { label: 'Projetos ilimitados', included: true },
      { label: 'Usuários ilimitados', included: true },
      { label: 'Chat integrado', included: true },
      { label: 'Templates avançados', included: true },
      { label: 'CRM completo', included: true },
      { label: 'Relatórios avançados', included: true },
      { label: 'Portfólio premium', included: true },
      { label: 'API de integração', included: true },
      { label: 'White-label', included: true },
    ],
    highlight: false,
    cta: 'Assinar Premium',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-6">
          <Link to="/" className="text-xl font-bold text-foreground tracking-tight">
            ArchiUrban
          </Link>
          <Link to="/">
            <Button variant="outline" size="sm">Voltar</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <motion.section
        className="py-20 text-center px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
          Planos e Preços
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Escolha o plano ideal para o seu escritório. Comece grátis e escale conforme sua necessidade.
        </p>
      </motion.section>

      {/* Plans Grid */}
      <section className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Card
                className={cn(
                  'flex flex-col relative h-full transition-shadow duration-300',
                  plan.highlight
                    ? 'border-primary shadow-lg shadow-primary/10'
                    : 'border-border'
                )}
              >
                {plan.badge && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3">
                    {plan.badge}
                  </Badge>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature.label} className="flex items-center gap-2 text-sm">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                        )}
                        <span className={cn(!feature.included && 'text-muted-foreground/50')}>
                          {feature.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.highlight ? 'default' : 'outline'}
                    asChild
                  >
                    <Link to="/">{plan.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Pricing;
