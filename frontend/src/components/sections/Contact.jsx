import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiMail, FiLinkedin, FiGithub, FiSend, FiCheck } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import Section from '../ui/Section';
import Button from '../ui/Button';
import api from '../../lib/api';
import { profile } from '../../config/portfolio';

const channels = [
  { icon: FiMail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  { icon: FaWhatsapp, label: 'WhatsApp', value: profile.phone, href: `https://wa.me/${profile.whatsapp}` },
  { icon: FiLinkedin, label: 'LinkedIn', value: 'mostafa-genidy', href: profile.linkedin },
  { icon: FiGithub, label: 'GitHub', value: 'mustafagenedy', href: profile.github },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', body: '' });
  const [sent, setSent] = useState(false);

  const mutation = useMutation({
    mutationFn: (payload) => api.post('/messages', payload),
    onSuccess: () => {
      setSent(true);
      setForm({ name: '', email: '', subject: '', body: '' });
    },
  });

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

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

        {/* Form */}
        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-6 md:p-8 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200/80 dark:border-gray-700 space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Name" value={form.name} onChange={update('name')} required />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={update('email')}
              required
            />
          </div>
          <Input label="Subject" value={form.subject} onChange={update('subject')} />
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted font-semibold mb-1.5">
              Message
            </label>
            <textarea
              value={form.body}
              onChange={update('body')}
              required
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-bg dark:bg-bg-dark border border-gray-200 dark:border-gray-700 text-sm text-text dark:text-text-dark focus:outline-none focus:border-accent transition-colors resize-none"
            />
          </div>

          {mutation.isError && (
            <p className="text-sm text-red-500">
              Couldn't send — try email or WhatsApp instead.
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
      </div>
    </Section>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-muted font-semibold mb-1.5">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-3 rounded-xl bg-bg dark:bg-bg-dark border border-gray-200 dark:border-gray-700 text-sm text-text dark:text-text-dark focus:outline-none focus:border-accent transition-colors"
      />
    </div>
  );
}
