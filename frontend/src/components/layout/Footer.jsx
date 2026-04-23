import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-primary dark:bg-surface-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-sm text-gray-300">
          &copy; {new Date().getFullYear()} Mostafa Genidy. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a href="https://github.com/mustafagenedy" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-accent transition-colors">
            <FiGithub size={20} />
          </a>
          <a href="https://www.linkedin.com/in/mostafa-genidy-9214b82a7" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-accent transition-colors">
            <FiLinkedin size={20} />
          </a>
          <a href="mailto:mostafagenydy@gmail.com" aria-label="Email" className="hover:text-accent transition-colors">
            <FiMail size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
