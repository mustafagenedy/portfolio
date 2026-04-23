import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiMail, FiLinkedin, FiGithub, FiSend, FiCheck, FiLogIn, FiLock } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import Section from '../ui/Section';
import Button from '../ui/Button';
import api from '../../lib/api';
import { profile } from '../../config/portfolio';
import { useAuth } from '../../store/auth';

const channels = [
  { icon: FiMail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  { icon: FaWhatsapp, label: 'WhatsApp', value: profile.phone, href: `https://wa.me/${profile.whatsapp}` },
  { icon: FiLinkedin, label: 'LinkedIn', value: 'mostafa-genidy', href: profile.linkedin },
  { icon: FiGithub, label: 'GitHub', value: 'mustafagenedy', href: profile.github },
];

export default function Contact() {
  const user = useAuth((s) => s.user);

  return (
    <Section id="contact" eyebrow="Contact" title="Let's build something.">
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Channels */}
        <div>
          <p className="text-base md:text-lg text-muted leading-relaxed mb-8 max-w-md">
            Got a problem worth solving? I read every message and respond within 48 hours.
          </p>

          <div className="space-y-3">
            {channels.map((c, i) => (
              <motion.a
                key={c.label}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200/80 dark:border-gray-700 hover:border-accent transition-colors duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/5 dark:bg-accent/10 flex items-center justify-center text-primary dark:text-accent group-hover:scale-110 transition-transform duration-300">
                  <c.icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-wider text-muted">{c.label}</p>
                  <p className="text-sm font-semibold text-primary dark:text-white truncate">
                    {c.value}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Form or auth gate */}
        {user ? <MessageForm user={user} /> : <AuthGate />}
      </div>
    </Section>
  );
}

function AuthGate() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="p-8 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200/80 dark:border-gray-700 flex flex-col items-center justify-center text-center min-h-[400px]"
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/5 dark:bg-accent/10 flex items-center justify-center text-primary dark:text-accent mb-4">
        <FiLock size={22} />
      </div>
      <h3 className="text-xl font-bold text-primary dark:text-white mb-2">
        Sign in to send a message
      </h3>
      <p className="text-sm text-muted leading-relaxed max-w-xs mb-6">
        Create an account or sign in so we can keep the conversation threaded
        and respond to you directly.
      </p>
      <div className="flex gap-3">
        <Button as={Link} to="/login" variant="primary">
          <FiLogIn size={16} /> Sign in
        </Button>
        <Button as={Link} to="/register" variant="secondary">
          Create account
        </Button>
      </div>
    </motion.div>
  );
}

function MessageForm({ user }) {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    subject: '',
    body: '',
  });
  const [sent, setSent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const mutation = useMutation({
    mutationFn: (payload) => api.post('/messages', payload),
    onSuccess: () => {
      setSent(true);
      setForm((f) => ({ ...f, subject: '', body: '' }));
      setFieldErrors({});
    },
    onError: (err) => {
      const details = err.response?.data?.details;
      if (details) setFieldErrors(details);
    },
  });

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    setSent(false);
    mutation.mutate(form);
  };

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="p-6 md:p-8 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200/80 dark:border-gray-700 space-y-4"
    >
      <p className="text-xs text-muted">
        Signed in as <span className="font-semibold text-primary dark:text-white">{user.email}</span>
      </p>

      <Input label="Subject" value={form.subject} onChange={update('subject')} error={fieldErrors.subject?.[0]} />
      <div>
        <label className="block text-xs uppercase tracking-wider text-muted font-semibold mb-1.5">
          Message
        </label>
        <textarea
          value={form.body}
          onChange={update('body')}
          required
          rows={5}
          className={`w-full px-4 py-3 rounded-xl bg-bg dark:bg-bg-dark border text-sm text-text dark:text-text-dark focus:outline-none focus:border-accent transition-colors resize-none ${
            fieldErrors.body ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'
          }`}
        />
        {fieldErrors.body && <p className="mt-1.5 text-xs text-red-500">{fieldErrors.body[0]}</p>}
      </div>

      {mutation.isError && !Object.keys(fieldErrors).length && (
        <p className="text-sm text-red-500">
          {mutation.error?.response?.data?.error || "Couldn't send — try email or WhatsApp."}
        </p>
      )}

      <Button
        type="submit"
        disabled={mutation.isPending || sent}
        className="w-full justify-center"
      >
        {sent ? (
          <>
            <FiCheck size={16} /> Message sent
          </>
        ) : mutation.isPending ? (
          'Sending...'
        ) : (
          <>
            <FiSend size={16} /> Send message
          </>
        )}
      </Button>
    </motion.form>
  );
}

function Input({ label, error, ...props }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-muted font-semibold mb-1.5">
        {label}
      </label>
      <input
        {...props}
        className={`w-full px-4 py-3 rounded-xl bg-bg dark:bg-bg-dark border text-sm text-text dark:text-text-dark focus:outline-none focus:border-accent transition-colors ${
          error ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'
        }`}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
