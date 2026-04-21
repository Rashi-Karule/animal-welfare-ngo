import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const resendApiKey = Deno.env.get('RESEND_API_KEY') || '';
const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || '';

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

function escapeHtml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const payload = await req.json();
    const eventType = payload?.eventType as 'missing_reported' | 'pet_found';
    const pet = payload?.pet || {};

    if (!eventType || !['missing_reported', 'pet_found'].includes(eventType)) {
      return new Response(JSON.stringify({ error: 'Invalid eventType' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data: subscribers, error: subscriberError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('email');

    if (subscriberError) {
      return new Response(JSON.stringify({ error: subscriberError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const emails = Array.from(
      new Set((subscribers || []).map((row: { email: string }) => (row.email || '').trim().toLowerCase()))
    ).filter(Boolean);

    if (emails.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: 'No subscribers found' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const petName = escapeHtml(pet.pet_name || 'A pet');
    const location = escapeHtml(pet.last_seen_location || 'Not specified');
    const description = escapeHtml(pet.description || 'Not specified');
    const photoUrl = pet.photo_url ? String(pet.photo_url) : '';
    const details = escapeHtml((pet.other_details || '').replace('[[FOUND]]', '').trim());

    const subject =
      eventType === 'missing_reported'
        ? `Missing Pet Alert: ${petName}`
        : `Update: ${petName} has been found`;

    const statusLine =
      eventType === 'missing_reported'
        ? '<p style="color:#8a4b00;"><strong>Status:</strong> Still Missing</p>'
        : '<p style="color:#1f6b3a;"><strong>Status:</strong> Found</p>';

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;padding:16px;">
        <h2 style="margin-bottom:8px;">Juno The Choco Lab - Missing Pet Update</h2>
        ${statusLine}
        <p><strong>Pet:</strong> ${petName}</p>
        <p><strong>Last Seen:</strong> ${location}</p>
        <p><strong>Description:</strong> ${description}</p>
        ${details ? `<p><strong>Update:</strong> ${details}</p>` : ''}
        ${photoUrl ? `<p><img src="${photoUrl}" alt="${petName}" style="max-width:100%;border-radius:8px;" /></p>` : ''}
        <p>View full list on missing pets page: <a href="https://animal-welfare-ngo.vercel.app/missing-pet.html">Open Missing Pet Helpline</a></p>
      </div>
    `;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: emails,
        subject,
        html
      })
    });

    if (!resendResponse.ok) {
      const resendErrorText = await resendResponse.text();
      return new Response(JSON.stringify({ error: resendErrorText }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ sent: emails.length }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
