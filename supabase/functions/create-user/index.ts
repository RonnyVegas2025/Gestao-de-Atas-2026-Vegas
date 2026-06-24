import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { nome, email, password, cargo, departamento, perfil, status } = await req.json()

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  })

  if (authError) return new Response(JSON.stringify({ error: authError.message }), { status: 400 })

  const { error: dbError } = await supabaseAdmin.from('usuarios').insert({
    id: authData.user.id,
    nome, email, cargo, departamento, perfil, status
  })

  if (dbError) return new Response(JSON.stringify({ error: dbError.message }), { status: 400 })

  return new Response(JSON.stringify({ success: true, id: authData.user.id }), { status: 200, headers: { 'Content-Type': 'application/json' } })
})
