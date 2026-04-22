import { NextResponse } from 'next/server';
import { getDemoStore, type DemoTenantRequest } from '@/lib/demoStore';

function formatTimestamp(input?: string) {
  if (!input) {
    return 'Just now';
  }

  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return input;
  }

  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export async function GET() {
  const requests = getDemoStore().tenantRequests
    .slice()
    .sort((left, right) => {
      const leftTime = new Date(left.createdAt ?? 0).getTime();
      const rightTime = new Date(right.createdAt ?? 0).getTime();
      return rightTime - leftTime;
    });

  return NextResponse.json(requests);
}

export async function POST(request: Request) {
  const data = await request.json();
  const store = getDemoStore();

  const tenantRequest: DemoTenantRequest = {
    id: `req-${Date.now()}`,
    requestId: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
    category: data.category,
    title: data.title,
    requester: data.requester ?? 'Anonymous Tenant',
    details: data.details ?? '',
    status: data.status ?? 'Pending Review',
    timestamp: formatTimestamp(data.requestedFor ?? data.timestamp),
    meta: data.meta ?? {},
    createdAt: new Date().toISOString(),
  };

  store.tenantRequests.unshift(tenantRequest);

  return NextResponse.json(tenantRequest, { status: 201 });
}
