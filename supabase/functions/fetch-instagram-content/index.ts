import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { username, accessToken } = await req.json()

    if (!username) {
      throw new Error('Username is required')
    }

    // For now, return mock data since we need Instagram API setup
    const mockData = {
      user: {
        username,
        followers_count: Math.floor(Math.random() * 10000),
        following_count: Math.floor(Math.random() * 1000),
        media_count: Math.floor(Math.random() * 500),
        biography: "Music professional sharing content"
      },
      recent_posts: [
        {
          id: '1',
          media_type: 'IMAGE',
          media_url: 'https://picsum.photos/300/300?random=1',
          caption: '🎵 Latest recording session vibes! #music #studio',
          timestamp: new Date().toISOString(),
          like_count: Math.floor(Math.random() * 500),
          comments_count: Math.floor(Math.random() * 50)
        },
        {
          id: '2',
          media_type: 'IMAGE',
          media_url: 'https://picsum.photos/300/300?random=2',
          caption: '🎸 Working on some new compositions #guitar #musician',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          like_count: Math.floor(Math.random() * 300),
          comments_count: Math.floor(Math.random() * 30)
        }
      ]
    }

    return new Response(
      JSON.stringify(mockData),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})