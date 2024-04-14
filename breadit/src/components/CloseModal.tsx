'use client';
import { useRouter } from 'next/navigation';
import { Button } from './ui/Button';
import { X } from 'lucide-react';

const CloseModal = () => {
  const router = useRouter();
  return (
    <Button
      variant="subtle"
      className="w-6 h-6 p-0 rounded-md"
      aria-label="close modal"
      onClick={() => router.back()}
    >
      <X className="w-4 h-4" />
    </Button>
  );
};

export default CloseModal;
