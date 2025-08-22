'use client';

import { useRouter } from 'next/navigation';
import { ProjectWizard } from '@/components/projects/ProjectWizard';

export default function NewProjectPage() {
  const router = useRouter();

  const handleProjectComplete = async (projectData: any) => {
    // Here would be the API call to create the project
    console.log('Creating project:', projectData);
    
    // For now, just redirect to projects page
    router.push('/projects');
  };

  const handleCancel = () => {
    router.push('/projects');
  };

  return (
    <ProjectWizard 
      onComplete={handleProjectComplete}
      onCancel={handleCancel}
    />
  );
}
