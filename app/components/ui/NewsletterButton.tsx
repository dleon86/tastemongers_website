'use client';

interface NewsletterButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function NewsletterButton({ className, children }: NewsletterButtonProps) {
  const handleClick = () => {
    const event = new CustomEvent('openNewsletterPopup');
    window.dispatchEvent(event);
  };

  return (
    <button 
      className={className || "bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"}
      onClick={handleClick}
    >
      {children || "Subscribe Now"}
    </button>
  );
} 