'use client';

import React from 'react';
import ReviewsModeration from '@/components/Administration/ReviewsModeration';

const ReviewsModerationPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Administración de Reseñas</h1>
      <ReviewsModeration />
    </div>
  );
};

export default ReviewsModerationPage;
