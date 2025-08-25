'use client';

import { useEffect, useState } from 'react';

export function DateDisplay({ date }: { date: string | Date }) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    // This effect only runs on the client side
    setFormattedDate(new Date(date).toLocaleDateString('ar-SA'));
  }, [date]);

  return <span>{formattedDate}</span>;
}
