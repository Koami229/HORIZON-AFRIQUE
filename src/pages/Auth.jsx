import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge, Btn, Crumbs, useApp } from '../components/ui.jsx'
import { ACCOUNT_TYPES, COUNTRIES, IMG, TALENT_CATEGORIES, STYLES } from '../data.js'

const aside = (
  <div className="auth-aside">
    <img src={IMG.hero} alt="" />
    <div>
      <span className="logo-mark" style={{ width: 44, height: 44, borderRadius: 14, fontSize: 20 }}>H</span>
      <h2 className="mt-16" style={{ color: '#fff' }}>Horizon Afrique</h2>
      <p style={{ color: '#cfccd8', maxWidth: '44ch' }}>
        La plateforme des talents, marques et créations africaines. Créez votre profil, publiez vos créations,
        vendez vos produits et collaborez partout sur le continent.
      </p>
    </div>
    <div className="stack gap-16">
      {[['48 216', 'Professionnels inscrits'], ['12 407', 'Talents vérifiés'], [String(COUNTRIES.length), 'Pays représentés']].map(([a, b]) => (
        <div key={b} className="row gap-12">
          <b style={{ fontFamily: 'var(--display)', fontSize: 22, color: 'var(--gold)', minWidth: 82 }}>{a}</b>
          <span className="small" style={{ color: '#cfccd8' }}>{b}</span>
        </div>
      ))}
    </div>
  </div>
)

/* =====================================================================
   4. PAGE CONNEXION
   ===================================================================== */
export function Connexion() {
  const nav = useNavigate()
  const { notify } = useApp()
  const [tab, setTab] = useState('Email')

  const submit = (e) => {
    e.preventDefault()
    notify('Connexion réussie — bienvenue sur Horizon Afrique 👋')
    nav('/tableau-de-bord')
  }

  return (
    <div className="auth-shell">
      {aside}
      <div className="auth-form-wrap">
        <div className="auth-card">
          <Crumbs items={[{ label: 'Connexion' }]} />
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>Connexion</h1>
          <p>Accédez à votre espace professionnel Horizon Afrique.</p>

          <div className="pill-row mb-16">
            {['Email', 'Numéro de téléphone'].map((t) => (
              <button key={t} className={`chip ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>

          <form onSubmit={submit}>
            <div className="field">
              <label>{tab === 'Email' ? 'Adresse email' : 'Numéro de téléphone'}</label>
              <input className="input" type={tab === 'Email' ? 'email' : 'tel'}
                placeholder={tab === 'Email' ? 'vous@exemple.com' : '+229 96 00 00 00'}
                defaultValue={tab === 'Email' ? 'aicha.kora@horizonafrique.com' : '+229 96 45 12 88'} required />
            </div>
            <div className="field">
              <label>Mot de passe</label>
              <input className="input" type="password" placeholder="••••••••" defaultValue="horizon2026" required />
            </div>
            <div className="between mb-16">
              <label className="checkbox"><input type="checkbox" defaultChecked /> <span>Se souvenir de moi</span></label>
              <Link to="/mot-de-passe-oublie" className="link-arrow">Mot de passe oublié ?</Link>
            </div>
            <Btn type="submit" size="lg" className="btn-block">Se connecter</Btn>
          </form>

          <div className="divider" />
          <p className="small center-text mb-16">Pas encore de compte ?</p>
          <Btn to="/inscription" variant="outline" className="btn-block">Créer un compte</Btn>
          <p className="small center-text mt-12 mb-0">
            Vous hésitez ? <Link to="/type-de-compte" className="gold strong">Comparer les 5 types de compte</Link>
          </p>

          <div className="notice mt-24">
            <span>ℹ️</span>
            <span className="small">Maquette de démonstration : cliquez sur « Se connecter » pour accéder au tableau de bord.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* =====================================================================
   3. PAGE INSCRIPTION (+ choix du type de compte)
   ===================================================================== */
export function Inscription() {
  const nav = useNavigate()
  const { notify } = useApp()
  const [step, setStep] = useState(1)
  const [type, setType] = useState('talent')
  const [form, setForm] = useState({
    firstName: 'Aïcha', lastName: 'Kora', pro: 'Maison Kora', email: 'aicha.kora@horizonafrique.com',
    phone: '+229 96 45 12 88', country: 'Bénin', city: 'Cotonou', password: '', password2: '', category: 'Stylistes', specialty: 'Wax chic',
  })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const steps = ['Type de compte', 'Informations', 'Profil professionnel', 'Confirmation']
  const cities = COUNTRIES.find((c) => c.name === form.country)?.cities || []
  const isTalent = type === 'talent'

  return (
    <div className="auth-shell">
      {aside}
      <div className="auth-form-wrap">
        <div className="auth-card" style={{ width: 'min(620px, 100%)' }}>
          <Crumbs items={[{ label: 'Inscription' }]} />
          <h1 style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2rem)' }}>Créer mon compte</h1>
          <p>Rejoignez la communauté professionnelle de la création africaine. L’inscription est gratuite.</p>

          <div className="stepper-h mb-24">
            {steps.map((s, i) => (
              <span key={s} className="row gap-8" style={{ alignItems: 'center' }}>
                <span className={`s ${step >= i + 1 ? 'on' : ''}`}><b>{i + 1}</b>{s}</span>
                {i < steps.length - 1 && <span style={{ width: 22, height: 1, background: 'var(--line)' }} />}
              </span>
            ))}
          </div>

          {step === 1 && (
            <>
              <h2 className="h-sub">Quel type de compte souhaitez-vous créer ?</h2>
              <div className="stack gap-12">
                {ACCOUNT_TYPES.map((t) => (
                  <button key={t.key} className={`account-type ${type === t.key ? 'active' : ''}`} onClick={() => setType(t.key)}>
                    <span className="icon">{t.icon}</span>
                    <span className="stack">
                      <b>{t.label}</b>
                      <span className="tiny muted">{t.desc}</span>
                    </span>
                  </button>
                ))}
              </div>
              <Btn size="lg" className="btn-block mt-24" onClick={() => setStep(2)}>Continuer</Btn>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="h-sub">Informations personnelles</h2>
              <div className="form-grid">
                <div className="field"><label>Nom</label><input className="input" value={form.lastName} onChange={set('lastName')} required /></div>
                <div className="field"><label>Prénom</label><input className="input" value={form.firstName} onChange={set('firstName')} required /></div>
              </div>
              <div className="field">
                <label>Nom professionnel ou nom de la structure</label>
                <input className="input" value={form.pro} onChange={set('pro')} placeholder="Ex : Maison Kora / TOURÉ." />
              </div>
              <div className="form-grid">
                <div className="field"><label>Adresse email</label><input className="input" type="email" value={form.email} onChange={set('email')} required /></div>
                <div className="field"><label>Numéro de téléphone</label><input className="input" value={form.phone} onChange={set('phone')} required /></div>
              </div>
              <div className="form-grid">
                <div className="field">
                  <label>Pays</label>
                  <select className="select" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value, city: COUNTRIES.find((c) => c.name === e.target.value)?.cities[0] || '' })}>
                    {COUNTRIES.map((c) => <option key={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Ville</label>
                  <select className="select" value={form.city} onChange={set('city')}>
                    {cities.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-grid">
                <div className="field">
                  <label>Mot de passe</label>
                  <input className="input" type="password" placeholder="8 caractères minimum" value={form.password} onChange={set('password')} />
                  <span className="hint">Utilisez au moins 8 caractères, dont une majuscule et un chiffre.</span>
                </div>
                <div className="field">
                  <label>Confirmer le mot de passe</label>
                  <input className="input" type="password" placeholder="Ressaisissez le mot de passe" value={form.password2} onChange={set('password2')} />
                  <span className={`hint ${form.password2 && form.password2 !== form.password ? 'red' : ''}`}>
                    {form.password2 && form.password2 !== form.password ? 'Les deux mots de passe ne correspondent pas.' : 'Les deux saisies doivent être identiques.'}
                  </span>
                </div>
              </div>
              <div className="row gap-12 mt-8">
                <Btn variant="outline" onClick={() => setStep(1)}>← Retour</Btn>
                <Btn onClick={() => setStep(3)}>Continuer</Btn>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="h-sub">Profil professionnel</h2>
              <div className="form-grid">
                <div className="field">
                  <label>Catégorie</label>
                  <select className="select" value={form.category} onChange={set('category')}>
                    {(isTalent ? TALENT_CATEGORIES.map((c) => c.name) : ['Mode & couture', 'Prêt-à-porter', 'Luxe artisanal', 'Artisanat & textile', 'Design', 'Institution', 'Média']).map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Spécialité</label>
                  <select className="select" value={form.specialty} onChange={set('specialty')}>
                    {(isTalent ? ['Wax chic', 'Contemporain', 'Haute couture', 'Streetwear', 'Bijoux', 'Vannerie', 'Broderie'] : STYLES).map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="field"><label>Biographie courte</label><textarea className="textarea" placeholder="Présentez votre activité en quelques lignes…" defaultValue="Maison de couture béninoise spécialisée dans le wax chic et les pièces de soirée." /></div>
              <div className="field">
                <label>Réseaux sociaux (optionnel)</label>
                <div className="form-grid-3">
                  <input className="input" placeholder="Instagram" defaultValue="@aichakora" />
                  <input className="input" placeholder="TikTok" />
                  <input className="input" placeholder="Site web" />
                </div>
              </div>
              <div className="field">
                <label>Logo / photo de profil</label>
                <div className="row gap-12">
                  <div className="logo-mark" style={{ width: 54, height: 54, borderRadius: 16, fontSize: 18 }}>AK</div>
                  <Btn variant="outline" size="sm">Téléverser une image</Btn>
                  <span className="tiny muted-2">PNG ou JPG, 2 Mo maximum</span>
                </div>
              </div>
              <label className="checkbox mb-16"><input type="checkbox" defaultChecked /> <span>J’accepte les conditions d’utilisation et la politique de confidentialité de Horizon Afrique.</span></label>
              <div className="row gap-12">
                <Btn variant="outline" onClick={() => setStep(2)}>← Retour</Btn>
                <Btn size="lg" onClick={() => { setStep(4); notify('Compte créé avec succès 🎉') }}>Créer mon compte</Btn>
              </div>
            </>
          )}

          {step === 4 && (
            <div className="center-text" style={{ padding: '20px 0' }}>
              <div style={{ fontSize: 46 }}>🎉</div>
              <h2>Bienvenue {form.firstName} !</h2>
              <p style={{ maxWidth: '52ch', margin: '0 auto 20px' }}>
                Votre compte <b>{ACCOUNT_TYPES.find((t) => t.key === type)?.label}</b> a été créé. Complétez votre
                portfolio, publiez votre première création et activez un Boost si vous souhaitez une visibilité immédiate.
              </p>
              <div className="panel" style={{ textAlign: 'left' }}>
                <div className="between mb-8"><span className="muted small">Nom professionnel</span><b>{form.pro}</b></div>
                <div className="between mb-8"><span className="muted small">Email</span><b>{form.email}</b></div>
                <div className="between mb-8"><span className="muted small">Pays / Ville</span><b>{form.country} · {form.city}</b></div>
                <div className="between"><span className="muted small">Catégorie / Spécialité</span><b>{form.category} · {form.specialty}</b></div>
              </div>
              <div className="row gap-12 center wrap mt-24">
                <Btn size="lg" onClick={() => nav('/tableau-de-bord')}>Accéder à mon tableau de bord</Btn>
                <Btn to="/tableau-de-bord/portfolio" variant="outline" size="lg">Compléter mon portfolio</Btn>
              </div>
            </div>
          )}

          <div className="divider" />
          <p className="small center-text mb-0">Vous avez déjà un compte ? <Link to="/connexion" className="gold strong">Se connecter</Link></p>
        </div>
      </div>
    </div>
  )
}

/* ---------------------------- Choix du type de compte ----------------- */
export function TypeDeCompte() {
  const nav = useNavigate()
  const { notify } = useApp()
  const [type, setType] = useState('talent')

  return (
    <div className="container section">
      <div className="center-text mb-32">
        <span className="upper gold">Inscription</span>
        <h1>Choisissez votre type de compte</h1>
        <p style={{ maxWidth: '64ch', margin: '0 auto' }}>
          Chaque type de compte donne accès à des fonctionnalités adaptées : portfolio, boutique, campagnes,
          gestion de partenariats ou sponsoring.
        </p>
      </div>

      <div className="grid grid-3">
        {ACCOUNT_TYPES.map((t) => (
          <button key={t.key} className={`account-type ${type === t.key ? 'active' : ''}`} style={{ flexDirection: 'column', padding: 24 }} onClick={() => setType(t.key)}>
            <span style={{ fontSize: 30 }}>{t.icon}</span>
            <b style={{ fontSize: 17, marginTop: 10 }}>{t.label}</b>
            <span className="small muted mt-8">{t.desc}</span>
            <span className="pill-row mt-16">
              {(t.key === 'talent' ? ['Portfolio', 'Publications', 'Collaborations', 'Opportunités']
                : t.key === 'marque' ? ['Page marque', 'Collections', 'Produits', 'Campagnes']
                  : t.key === 'boutique' ? ['Boutique', 'Commandes', 'Stocks', 'Statistiques']
                    : t.key === 'partenaire' ? ['Profil org.', 'Opportunités', 'Événements', 'Recherche de talents']
                      : ['Campagnes', 'Talents soutenus', 'Événements', 'Reporting']).map((f) => <span key={f} className="tag">{f}</span>)}
            </span>
          </button>
        ))}
      </div>

      <div className="center-text mt-32">
        <Badge tone="gold">Type sélectionné : {ACCOUNT_TYPES.find((t) => t.key === type)?.label}</Badge>
        <div className="row gap-12 center mt-16 wrap">
          <Btn size="lg" onClick={() => { notify(`Type de compte « ${ACCOUNT_TYPES.find((t) => t.key === type)?.label} » sélectionné`); nav('/inscription') }}>Continuer l’inscription</Btn>
          <Btn to="/connexion" variant="outline" size="lg">J’ai déjà un compte</Btn>
        </div>
      </div>
    </div>
  )
}

/* =====================================================================
   MOT DE PASSE OUBLIÉ
   ===================================================================== */
export function MotDePasseOublie() {
  const { notify } = useApp()
  const [sent, setSent] = useState(false)

  return (
    <div className="auth-shell">
      {aside}
      <div className="auth-form-wrap">
        <div className="auth-card">
          <Crumbs items={[{ label: 'Mot de passe oublié' }]} />
          {sent ? (
            <div className="center-text" style={{ padding: 20 }}>
              <div style={{ fontSize: 42 }}>📧</div>
              <h2>Email envoyé</h2>
              <p className="small">Si un compte existe avec cette adresse, vous recevrez un lien de réinitialisation valable 30 minutes.</p>
              <Btn to="/connexion" className="btn-block">Retour à la connexion</Btn>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2rem)' }}>Mot de passe oublié</h1>
              <p>Indiquez l’adresse email ou le numéro associé à votre compte : nous vous enverrons un lien de réinitialisation.</p>
              <div className="field"><label>Adresse email ou numéro de téléphone</label><input className="input" defaultValue="aicha.kora@horizonafrique.com" /></div>
              <Btn size="lg" className="btn-block" onClick={() => { setSent(true); notify('Lien de réinitialisation envoyé 📧') }}>Envoyer le lien</Btn>
              <div className="divider" />
              <Btn to="/connexion" variant="ghost" className="btn-block">← Retour à la connexion</Btn>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
