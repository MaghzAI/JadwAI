import { NextRequest } from 'next/server';
import { generateCSRFEndpoint } from '@/lib/middleware/csrf';

export async function GET(request: NextRequest) {
  return await generateCSRFEndpoint(request);
}
