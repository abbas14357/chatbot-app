import { supabase } from '../../lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { message, source } = await req.json()

  try {
    // ✅ Perform the insert directly
    const { data, error } = await supabase
      .from('messages')
      .insert([
        { message: message, source: source}
      ])

    if (error) {
      console.error('Supabase insert error:', error.message)
      return NextResponse.json({ reply: 'Insert failed', error: error.message }, { status: 500 })
    }

    return NextResponse.json({ reply: 'Inserted Data', data })

  } catch (error) {
    console.error('Something went wrong:', error)
    return NextResponse.json({ reply: 'Server error', error: error.message }, { status: 500 })
  }
}
