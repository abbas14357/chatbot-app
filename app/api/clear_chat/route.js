import { supabase } from '@/app/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST() {
  const { error } = await supabase.from('messages').delete().neq('id', 0); // deletes all rows

  if (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
