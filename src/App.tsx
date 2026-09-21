import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import {
  ArrowRight, Building2, ChevronDown, ChevronUp, Clock3, ConciergeBell, Instagram,
  KeyRound, Landmark, Mail, MapPin, Martini, Menu, MessageCircle, Music,
  PartyPopper, Route, ShieldCheck, Sparkles, Store, X,
  type LucideIcon,
} from 'lucide-react'
import { WhatsAppIcon } from './components/WhatsAppIcon'
import {
  buildCareerMessage, buildQuoteMessage, eloSitesWaLink, serviceMessages, waLink, waMessages,
  type CareerData, type ServiceKey,
} from './whatsapp'
import './styles.css'

const formValue = (data: FormData, key: string) => {
  const value = data.get(key)
  return typeof value === 'string' ? value : ''
}

const clients = [
  'Jund-Trafo', 'Clube Uirapuru', 'JC Kids', 'Azul Linhas Aéreas Brasileiras',
  'Jundiaí Shopping', 'Shopping Iguatemi Campinas',
]

type Service = { icon: LucideIcon; title: ServiceKey; text: string }

const services: Service[] = [
  { icon: ShieldCheck, title: 'Segurança para eventos', text: 'Organização de entradas e saídas, controle de público e prevenção de incidentes.' },
  { icon: Building2, title: 'Condomínios', text: 'Portaria, controle de acesso, acompanhamento de áreas comuns e rondas preventivas.' },
  { icon: KeyRound, title: 'Controle de acesso', text: 'Acesso de visitantes e colaboradores, autorização, registro e monitoramento.' },
  { icon: ConciergeBell, title: 'Portaria', text: 'Controle de entradas e saídas, visitantes, entregas, apoio básico e organização da rotina.' },
  { icon: Landmark, title: 'Segurança patrimonial', text: 'Atuação preventiva voltada à proteção do patrimônio, com postura profissional e foco na prevenção.' },
  { icon: Route, title: 'Ronda preventiva', text: 'Presença preventiva constante, com rondas a pé e motorizadas por motocicleta.' },
  { icon: Store, title: 'Estabelecimentos comerciais', text: 'Segurança e controle de acesso para lojas, empresas e estabelecimentos comerciais.' },
  { icon: PartyPopper, title: 'Festas particulares', text: 'Controle de entrada, segurança e prevenção para festas e comemorações.' },
  { icon: Music, title: 'Shows', text: 'Organização de entrada e de público e prevenção de incidentes em shows.' },
  { icon: Martini, title: 'Bares e restaurantes', text: 'Controle de acesso, segurança preventiva e organização do ambiente.' },
]

const differentials = [
  ['01', 'Equipe treinada', 'Profissionais preparados para atuar com responsabilidade e postura profissional.'],
  ['02', 'Pontualidade e disciplina', 'Compromisso com horários, procedimentos e organização da operação.'],
  ['03', 'Supervisão próxima', 'Acompanhamento constante para manter o padrão de atendimento e execução.'],
]

const processSteps = [
  ['01', 'Conversa inicial', 'Entendemos o local, o evento ou a necessidade do cliente.'],
  ['02', 'Planejamento', 'Definimos a estrutura adequada para a operação.'],
  ['03', 'Execução', 'Profissionais atuam com disciplina, presença e foco na prevenção.'],
  ['04', 'Acompanhamento', 'Supervisão próxima durante todo o serviço.'],
]

const faqs = [
  ['Quais serviços a Toledo oferece?', 'Atuamos com segurança para eventos, condomínios, portaria, controle de acesso e rondas preventivas, entre outras soluções compatíveis com cada operação.'],
  ['Onde a Toledo atende?', 'A Toledo atua em Jundiaí e região, avaliando a necessidade de cada cliente e de cada operação.'],
  ['A Toledo atende eventos?', 'Sim. Atuamos em eventos, festas, shows e outros formatos, com foco em controle de entrada, organização do público e prevenção de incidentes.'],
  ['A Toledo possui segurança armada?', 'Não. A Toledo não realiza segurança armada. O trabalho é voltado a portaria, controle de acesso, eventos em geral e atuação preventiva.'],
  ['Como solicitar um orçamento?', 'Entre em contato pelo WhatsApp ou e-mail. A equipe entende a necessidade e orienta os próximos passos.'],
  ['A Toledo contrata profissionais?', 'Sim. Mantemos um canal permanente de cadastro para profissionais que desejam atuar em eventos, portaria e demais operações.'],
]

const interestAreas = [
  'Segurança para eventos', 'Portaria', 'Controle de acesso', 'Rondas preventivas',
  'Condomínios', 'Estabelecimentos comerciais', 'Outros',
]

const navItems = [
  ['sobre', 'A Toledo'],
  ['servicos', 'Serviços'],
  ['atuacao', 'Atuação'],
  ['clientes', 'Clientes'],
  ['trabalhe', 'Trabalhe conosco'],
  ['faq', 'Perguntas frequentes'],
  ['contato', 'Contato'],
] as const

const navSectionIds = navItems.map(([id]) => id)

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [careerSent, setCareerSent] = useState(false)
  const [quoteSent, setQuoteSent] = useState(false)
  const [bubbleOpen, setBubbleOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    const handleResize = () => {
      if (window.innerWidth > 980) setMenuOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    window.addEventListener('resize', handleResize)
    return () => {
      document.removeEventListener('keydown', handleKey)
      window.removeEventListener('resize', handleResize)
    }
  }, [menuOpen])

  useEffect(() => {
    let ticking = false
    const updateActive = () => {
      ticking = false
      const headerOffset = window.innerWidth <= 720 ? 72 : 82
      const threshold = headerOffset + 12
      let current = ''
      navSectionIds.forEach(id => {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top <= threshold) current = id
      })
      const reachedBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (reachedBottom && navSectionIds.length > 0) current = navSectionIds[navSectionIds.length - 1]
      setActiveSection(prev => (prev === current ? prev : current))
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100)) : 0
      setScrollProgress(progress)
    }
    const handleScroll = () => {
      if (!ticking) {
        ticking = true
        window.requestAnimationFrame(updateActive)
      }
    }
    updateActive()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.reveal, .section-fade'))
    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('in'))
      return
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' })
    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const closeMenu = () => setMenuOpen(false)
  const revealDelay = (i: number, step = 80) => ({ transitionDelay: `${(i % 3) * step}ms` })

  const scrollToTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  const clearBubbleTimer = useCallback(() => {
    if (bubbleTimer.current !== null) {
      clearTimeout(bubbleTimer.current)
      bubbleTimer.current = null
    }
  }, [])

  const scheduleBubble = useCallback((delay: number) => {
    clearBubbleTimer()
    bubbleTimer.current = setTimeout(() => {
      bubbleTimer.current = null
      setBubbleOpen(true)
    }, delay)
  }, [clearBubbleTimer])

  useEffect(() => {
    scheduleBubble(30000)
    return clearBubbleTimer
  }, [scheduleBubble, clearBubbleTimer])

  const closeBubble = useCallback(() => {
    setBubbleOpen(false)
    scheduleBubble(60000)
  }, [scheduleBubble])

  useEffect(() => {
    if (!bubbleOpen) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeBubble()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [bubbleOpen, closeBubble])

  const handleCareer = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const career: CareerData = {
      name: formValue(data, 'name'),
      phone: formValue(data, 'phone'),
      email: formValue(data, 'email'),
      city: formValue(data, 'city'),
      area: formValue(data, 'area'),
      message: formValue(data, 'message'),
    }
    window.open(waLink(buildCareerMessage(career)), '_blank', 'noopener,noreferrer')
    setCareerSent(true)
  }

  const handleQuote = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const message = buildQuoteMessage({
      name: formValue(data, 'name'),
      phone: formValue(data, 'phone'),
      email: formValue(data, 'email'),
      service: formValue(data, 'service'),
      city: formValue(data, 'city'),
      message: formValue(data, 'message'),
    })
    window.open(waLink(message), '_blank', 'noopener,noreferrer')
    setQuoteSent(true)
  }

  return (
    <div className="site">
      <div
        className={scrollProgress > 0.5 ? 'scroll-progress active' : 'scroll-progress'}
        role="progressbar"
        aria-label="Progresso de navegação na página"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{ width: `${scrollProgress}%` }}
      />
      <header className={menuOpen ? 'header menu-open' : 'header'}>
        <a className="brand" href="#inicio" onClick={closeMenu} aria-label="Toledo Segurança — início">
          <img src="/assets/brand/toledo-logo.png" alt="Toledo Segurança" width="1377" height="950" fetchPriority="high" decoding="async" />
        </a>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav id="primary-nav" className={menuOpen ? 'nav open' : 'nav'} aria-label="Navegação principal">
          {navItems.map(([id, label]) => {
            const isActive = activeSection === id
            return (
              <a
                key={id}
                href={`#${id}`}
                className={isActive ? 'active' : undefined}
                aria-current={isActive ? 'true' : undefined}
                onClick={closeMenu}
              >
                {label}
              </a>
            )
          })}
          <a className="nav-cta" href={waLink(waMessages.menu)} target="_blank" rel="noreferrer" onClick={closeMenu}>
            Falar no WhatsApp <WhatsAppIcon size={16} aria-hidden="true" /> <ArrowRight size={16} />
          </a>
        </nav>

        <a className="header-cta" href={waLink(waMessages.header)} target="_blank" rel="noreferrer">
          Solicitar orçamento <WhatsAppIcon size={16} aria-hidden="true" /> <ArrowRight size={16} />
        </a>
      </header>

      {menuOpen && <button className="menu-backdrop" type="button" aria-label="Fechar menu" onClick={closeMenu} />}

      <main>
        <section id="inicio" className="hero section-dark section-fade in" aria-label="Apresentação">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-skull" aria-hidden="true"><img src="/assets/brand/toledo-skull.png" alt="" /></div>
          <div className="hero-content reveal">
            <p className="eyebrow"><span /> Jundiaí e região</p>
            <h1>Segurança que<br /><em>protege</em> o que importa.</h1>
            <p className="hero-lead">Segurança profissional para eventos e controle de acesso, com profissionais treinados, disciplina e presença constante em Jundiaí e região.</p>
            <div className="hero-actions">
              <a className="btn btn-gold" href={waLink(waMessages.hero)} target="_blank" rel="noreferrer">Solicitar orçamento <WhatsAppIcon size={18} aria-hidden="true" /> <ArrowRight size={18} /></a>
              <a className="text-link" href="#servicos">Conheça os serviços <ArrowRight size={17} /></a>
            </div>
          </div>
          <div className="hero-proof">
            <div><strong>Desde 2019</strong><span>experiência no setor</span></div>
            <div><strong>Jundiaí + região</strong><span>atendimento regional</span></div>
            <div><strong>Disciplina</strong><span>supervisão próxima</span></div>
          </div>
        </section>

        <section id="sobre" className="about section-light section-fade" aria-labelledby="sobre-title">
          <div className="section-wrap split">
            <div className="section-heading reveal">
              <p className="eyebrow dark"><span /> Quem somos</p>
              <h2 id="sobre-title">Presença, prevenção<br /><strong>e confiança.</strong></h2>
              <p className="about-positioning">Segurança que protege o que importa. Atendimento especializado em segurança para eventos e controle de acesso, com profissionais treinados e presença constante.</p>
            </div>
            <div className="about-copy reveal">
              <p className="lead">A Toledo Eventos iniciou suas atividades em 2019 atuando com segurança para eventos e portaria.</p>
              <p>Com o tempo, ampliou sua atuação para condomínios, empresas e estabelecimentos comerciais, mantendo foco em segurança, controle de acesso e apoio operacional.</p>
              <div className="mission">
                <ShieldCheck size={22} aria-hidden="true" />
                <div>
                  <strong>Nossa missão</strong>
                  <p>Oferecer serviços de segurança e controle de acesso com profissionalismo, disciplina e foco na prevenção, contribuindo para ambientes mais seguros e organizados.</p>
                </div>
              </div>
              <div className="values">
                <span>Ética</span><span>Responsabilidade</span><span>Respeito</span>
              </div>
            </div>
          </div>
        </section>

        <section id="servicos" className="services section-dark section-fade" aria-labelledby="servicos-title">
          <div className="section-wrap">
            <div className="section-heading centered reveal">
              <p className="eyebrow"><span /> Serviços</p>
              <h2 id="servicos-title">Segurança pensada para<br /><em>cada operação.</em></h2>
              <p>Serviços estruturados de acordo com a necessidade do ambiente, do evento ou da rotina do cliente.</p>
            </div>
            <div className="service-grid">
              {services.map(({ icon: Icon, title, text }, i) => (
                <article className="service-card reveal" key={title} style={revealDelay(i)}>
                  <div className="service-icon"><Icon size={23} strokeWidth={1.7} aria-hidden="true" /></div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <a
                    className="card-cta"
                    href={waLink(serviceMessages[title])}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Solicitar orçamento de ${title} pelo WhatsApp`}
                  >
                    Solicitar orçamento <WhatsAppIcon size={15} aria-hidden="true" /> <ArrowRight size={15} aria-hidden="true" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="atuacao" className="coverage section-light section-fade" aria-labelledby="atuacao-title">
          <div className="section-wrap coverage-inner">
            <div className="coverage-mark" aria-hidden="true"><img src="/assets/brand/toledo-skull.png" alt="" /></div>
            <div className="reveal">
              <p className="eyebrow dark"><span /> Área de atuação</p>
              <h2 id="atuacao-title">Jundiaí<br /><strong>e região.</strong></h2>
              <p>Atendimento regional para condomínios, eventos, empresas e estabelecimentos comerciais, com operações dimensionadas para cada necessidade.</p>
            </div>
            <div className="coverage-list reveal">
              <div><MapPin size={19} aria-hidden="true" /> Jundiaí e região</div>
              <div><ShieldCheck size={19} aria-hidden="true" /> Operações sob medida</div>
              <div><Clock3 size={19} aria-hidden="true" /> Atendimento comercial</div>
            </div>
          </div>
        </section>

        <section className="differentials section-dark section-fade" aria-labelledby="diferenciais-title">
          <div className="section-wrap">
            <div className="section-heading reveal">
              <p className="eyebrow"><span /> Diferenciais</p>
              <h2 id="diferenciais-title">Profissionalismo<br /><em>na prática.</em></h2>
            </div>
            <div className="diff-grid">
              {differentials.map(([n, title, text], i) => (
                <div className="diff-item reveal" key={n} style={revealDelay(i)}>
                  <b>{n}</b><h3>{title}</h3><p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="clientes" className="clients section-light section-fade" aria-labelledby="clientes-title">
          <div className="section-wrap">
            <div className="section-heading centered reveal">
              <p className="eyebrow dark"><span /> Empresas atendidas</p>
              <h2 id="clientes-title">Marcas que já<br /><strong>contaram com a Toledo.</strong></h2>
              <p>Empresas e organizações atendidas, apresentadas com autorização. Os logotipos oficiais serão adicionados conforme liberação dos clientes.</p>
            </div>
            <div className="client-grid">
              {clients.map((name, i) => (
                <div className="client-logo reveal" key={name} style={revealDelay(i)}><span>{name}</span></div>
              ))}
            </div>
          </div>
        </section>

        <section className="process section-dark section-fade" aria-labelledby="processo-title">
          <div className="section-wrap">
            <div className="section-heading centered reveal">
              <p className="eyebrow"><span /> Como funciona</p>
              <h2 id="processo-title">Do primeiro contato<br /><em>à operação.</em></h2>
            </div>
            <div className="process-grid">
              {processSteps.map(([n, title, text], i) => (
                <div className="process-item reveal" key={n} style={revealDelay(i)}>
                  <span>{n}</span><h3>{title}</h3><p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="trabalhe" className="career section-light section-fade" aria-labelledby="trabalhe-title">
          <div className="section-wrap career-inner">
            <div className="section-heading reveal">
              <p className="eyebrow dark"><span /> Trabalhe conosco</p>
              <h2 id="trabalhe-title">Quer fazer parte<br /><strong>da Toledo?</strong></h2>
              <p>Estamos em busca de profissionais comprometidos, responsáveis e preparados para atuar em eventos e demais operações.</p>
              <div className="career-note"><Sparkles size={19} aria-hidden="true" /> Cadastro para futuras oportunidades e escalas.</div>
            </div>
            <form className="career-form reveal" onSubmit={handleCareer}>
              <div className="form-row">
                <label>Nome completo<input required name="name" autoComplete="name" placeholder="Seu nome" /></label>
                <label>WhatsApp<input required type="tel" inputMode="tel" name="phone" autoComplete="tel" placeholder="(11) 99999-9999" /></label>
              </div>
              <div className="form-row">
                <label>E-mail<input required type="email" name="email" autoComplete="email" placeholder="seu@email.com" /></label>
                <label>Cidade<input required name="city" autoComplete="address-level2" placeholder="Jundiaí" /></label>
              </div>
              <label>
                Área de interesse
                <select required name="area" defaultValue="">
                  <option value="" disabled>Selecione uma área</option>
                  {interestAreas.map(area => <option key={area} value={area}>{area}</option>)}
                </select>
              </label>
              <label>Breve apresentação<textarea name="message" rows={3} placeholder="Conte brevemente sobre você e sua experiência." /></label>
              <label className="file-input">
                Currículo <span>PDF, DOC ou DOCX</span>
                <input type="file" name="resume" accept=".pdf,.doc,.docx" />
              </label>
              <label className="consent">
                <input type="checkbox" required />
                <span>Autorizo o uso dos dados pessoais e do currículo enviados exclusivamente para fins de recrutamento e seleção, podendo solicitar a exclusão a qualquer momento.</span>
              </label>
              <button className="btn btn-dark" type="submit">{careerSent ? 'Dados validados' : 'Enviar candidatura'} <ArrowRight size={18} /></button>
              {careerSent && (
                <p className="form-status" role="status">
                  Abrimos o WhatsApp com seus dados. Anexe seu currículo diretamente na conversa para concluir.
                </p>
              )}
            </form>
          </div>
        </section>

        <section id="faq" className="faq section-light section-fade" aria-labelledby="faq-title">
          <div className="section-wrap faq-inner">
            <div className="section-heading reveal">
              <p className="eyebrow dark"><span /> Dúvidas</p>
              <h2 id="faq-title">Perguntas<br /><strong>frequentes.</strong></h2>
            </div>
            <div className="faq-list reveal">
              {faqs.map(([q, a], i) => (
                <div className="faq-item" key={q}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    aria-controls={`faq-answer-${i}`}
                  >
                    <span>{q}</span><ChevronDown className={openFaq === i ? 'rotated' : ''} aria-hidden="true" />
                  </button>
                  {openFaq === i && <div className="faq-answer" id={`faq-answer-${i}`}><p>{a}</p></div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="orcamento" className="quote section-dark section-fade" aria-labelledby="orcamento-title">
          <div className="section-wrap quote-inner">
            <div className="section-heading reveal">
              <p className="eyebrow"><span /> Solicite orçamento</p>
              <h2 id="orcamento-title">Conte o que você<br /><em>precisa proteger.</em></h2>
              <p>Preencha os dados abaixo e envie diretamente pelo WhatsApp. Assim, a equipe já entende a sua necessidade e responde com mais agilidade.</p>
              <ul className="quote-list">
                <li><ShieldCheck size={18} aria-hidden="true" /> Atendimento em Jundiaí e região</li>
                <li><Clock3 size={18} aria-hidden="true" /> Resposta em horário comercial</li>
                <li><MessageCircle size={18} aria-hidden="true" /> Contato direto pelo WhatsApp</li>
              </ul>
            </div>
            <form className="quote-form reveal" onSubmit={handleQuote}>
              <div className="form-row">
                <label>Nome<input required name="name" autoComplete="name" placeholder="Seu nome" /></label>
                <label>WhatsApp<input required type="tel" inputMode="tel" name="phone" autoComplete="tel" placeholder="(11) 99999-9999" /></label>
              </div>
              <div className="form-row">
                <label>E-mail (opcional)<input type="email" name="email" autoComplete="email" placeholder="seu@email.com" /></label>
                <label>Cidade / local<input name="city" placeholder="Jundiaí" /></label>
              </div>
              <label>
                Serviço de interesse
                <select name="service" defaultValue="">
                  <option value="" disabled>Selecione um serviço</option>
                  {services.map(service => <option key={service.title} value={service.title}>{service.title}</option>)}
                </select>
              </label>
              <label>Mensagem<textarea name="message" rows={3} placeholder="Descreva o evento, o local ou a necessidade." /></label>
              <button className="btn btn-gold" type="submit"><WhatsAppIcon size={18} aria-hidden="true" /> Enviar pelo WhatsApp</button>
              <p className="quote-note" role="status">
                {quoteSent
                  ? 'Abrimos o WhatsApp com os dados preenchidos. Se a janela não abrir, use o botão de WhatsApp no canto da tela.'
                  : 'Ao enviar, você será direcionado ao WhatsApp com os dados preenchidos. Nenhuma informação é armazenada neste site.'}
              </p>
            </form>
          </div>
        </section>

        <section id="contato" className="contact section-dark section-fade" aria-labelledby="contato-title">
          <div className="contact-glow" aria-hidden="true" />
          <div className="section-wrap contact-inner reveal">
            <div>
              <p className="eyebrow"><span /> Contato</p>
              <h2 id="contato-title">Vamos conversar sobre<br /><em>sua necessidade.</em></h2>
              <p>Solicite um orçamento e conte o que você precisa proteger.</p>
              <a className="btn btn-gold" href={waLink(waMessages.contact)} target="_blank" rel="noreferrer"><WhatsAppIcon size={18} aria-hidden="true" /> Falar no WhatsApp</a>
            </div>
            <address className="contact-details">
              <a className="contact-line" href={waLink(waMessages.contactLine)} target="_blank" rel="noreferrer"><WhatsAppIcon size={17} aria-hidden="true" /> WhatsApp: (11) 91371-4556</a>
              <a className="contact-line" href="mailto:jt.toledoseguranca@gmail.com"><Mail size={17} aria-hidden="true" /> jt.toledoseguranca@gmail.com</a>
              <a className="contact-line" href="https://www.instagram.com/toledoseguranca4/" target="_blank" rel="noreferrer"><Instagram size={17} aria-hidden="true" /> @toledoseguranca4</a>
              <span className="contact-line"><MapPin size={17} aria-hidden="true" /> Rua José do Patrocínio, 134, Centro — Jundiaí/SP</span>
              <span className="contact-line"><Clock3 size={17} aria-hidden="true" /> Segunda a sexta, 08h às 18h</span>
            </address>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-main">
          <a
            className="footer-brand"
            href="#inicio"
            aria-label="Voltar ao topo"
            onClick={(event) => {
              event.preventDefault()
              closeMenu()
              const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
              window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
            }}
          >
            <img src="/assets/brand/toledo-logo.png" alt="Toledo Segurança" />
          </a>
          <div>
            <p>Segurança que protege o que importa.</p>
            <span>Jundiaí e região</span>
          </div>
          <a className="instagram" href="https://www.instagram.com/toledoseguranca4/" target="_blank" rel="noreferrer" aria-label="Instagram da Toledo Segurança"><Instagram /></a>
        </div>
        <div className="footer-bottom">
          <span>Toledo Eventos LTDA · CNPJ 28.531.574/0001-42</span>
          <span>Rua José do Patrocínio, 134, Centro — Jundiaí/SP</span>
          <span>© {new Date().getFullYear()} Toledo Segurança. Todos os direitos reservados.</span>
        </div>
        <div className="footer-credit">
          <span>Criado e desenvolvido por</span>
          <a
            className="footer-credit-link"
            href={eloSitesWaLink(waMessages.eloSites)}
            target="_blank"
            rel="noreferrer"
            aria-label="Falar com a Elo Sites pelo WhatsApp"
          >
            <WhatsAppIcon size={16} aria-hidden="true" />
            <img src="/assets/brand/elo-sites-logo.png" alt="Elo Sites" width="1536" height="382" decoding="async" />
          </a>
          <span>o melhor site pelo melhor preço</span>
        </div>
        <div className="footer-action">
          <button
            type="button"
            className="back-to-top"
            onClick={scrollToTop}
            aria-label="Voltar ao topo"
          >
            <ChevronUp size={13} aria-hidden="true" />
            <span>Voltar ao topo</span>
          </button>
        </div>
      </footer>

      <div className={bubbleOpen ? 'wa-widget bubble-open' : 'wa-widget'}>
        {bubbleOpen && (
          <aside className="wa-bubble" aria-label="Convite para contato pelo WhatsApp" aria-live="polite">
            <button type="button" className="wa-bubble-close" onClick={closeBubble} aria-label="Fechar aviso">
              <X size={15} aria-hidden="true" />
            </button>
            <a className="wa-bubble-link" href={waLink(waMessages.bubble)} target="_blank" rel="noreferrer">
              <span>Olá! 👋 Posso te ajudar a encontrar a solução ideal para sua segurança? Fale com a gente.</span>
            </a>
          </aside>
        )}
        <a className="floating-wa" href={waLink(waMessages.floating)} target="_blank" rel="noreferrer" aria-label="Falar com a Toledo pelo WhatsApp" title="Falar no WhatsApp">
          <WhatsAppIcon size={24} aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}

export default App
