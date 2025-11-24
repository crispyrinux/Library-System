// src/lib/api.ts
// Use a relative API base by default so the app works when served from the
// backend (same origin). You can override with `VITE_API_BASE_URL` for dev.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ====== BOOKS ======
export function getBooks(params?: {
  page?: number;
  limit?: number;
  search?: string;
  genre?: string;
  isAvailable?: boolean;
}) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.search) query.set('search', params.search);
  if (params?.genre) query.set('genre', params.genre);
  if (params?.isAvailable !== undefined)
    query.set('isAvailable', String(params.isAvailable));

  const qs = query.toString();
  return request<{ data: any[]; total: number; page: number; limit: number }>(
    `/books${qs ? `?${qs}` : ''}`,
  );
}

export function createBook(body: {
  title: string;
  author: string;
  genre?: string;
  publication_year?: number;
}) {
  return request('/books', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function updateBook(id: string, body: Partial<{
  title: string;
  author: string;
  genre?: string;
  publication_year?: number;
  is_available?: boolean;
}>) {
  return request(`/books/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function deleteBook(id: string) {
  return request(`/books/${id}`, {
    method: 'DELETE',
  });
}

// ====== MEMBERS ======
export function getMembers() {
  return request('/members');
}

export function createMember(body: {
  name: string;
  email: string;
  phone?: string;
}) {
  return request('/members', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function updateMember(
  id: string,
  body: Partial<{
    name: string;
    email: string;
    phone?: string;
    membership_date?: string;
  }>,
) {
  return request(`/members/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function deleteMember(id: string) {
  return request(`/members/${id}`, {
    method: 'DELETE',
  });
}


// ====== LOANS ======
export function getLoans(params?: { activeOnly?: boolean }) {
  const query = new URLSearchParams();
  if (params?.activeOnly) query.set('activeOnly', 'true');
  const qs = query.toString();
  return request<{ data: any[]; total: number; page: number; limit: number }>(
    `/loans${qs ? `?${qs}` : ''}`,
  );
}

export function createLoan(body: { member_id: string; book_id: string }) {
  return request('/loans', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function returnLoan(loanId: string) {
  return request(`/loans/${loanId}/return`, {
    method: 'PATCH',
    body: JSON.stringify({}), // bisa tambahin return_date kalau mau
  });
}

// ====== FINES ======
export function getFines(params?: { isPaid?: boolean }) {
  const query = new URLSearchParams();
  if (params?.isPaid !== undefined)
    query.set('isPaid', String(params.isPaid));
  const qs = query.toString();
  return request<{ data: any[]; total: number; page: number; limit: number }>(
    `/fines${qs ? `?${qs}` : ''}`,
  );
}

export function markFinePaid(fineId: string) {
  return request(`/fines/${fineId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ is_paid: true }),
  });
}
