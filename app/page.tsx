
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function Page() {
  const cookieStore = await cookies()
  // const supabase = createClient(cookieStore)

  // const { data: todos } = await supabase.from('todos').select()

  return (
    <div>
      <h1>QuickQR order</h1>
      {/* <ul>
        {todos?.map((todo) => (
          <li>{todo}</li>
        ))}
      </ul> */}
      <Link href={"/auth/sign-up"}> sign up </Link>
    </div>
  )
}
