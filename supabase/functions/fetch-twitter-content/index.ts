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
    const { username } = await req.json()

    // Input validation and sanitization
    if (!username) {
      throw new Error('Username is required')
    }

    // Sanitize username - only allow alphanumeric characters and underscores
    const sanitizedUsername = username.replace(/[^a-zA-Z0-9_]/g, '')
    if (sanitizedUsername !== username || username.length > 15 || username.length < 1) {
      throw new Error('Invalid username format. Only alphanumeric characters and underscores allowed.')
    }

    // For now, return mock data since we need Twitter API setup
    const mockData = {
      user: {
        username,
        name: "Music Professional",
        followers_count: Math.floor(Math.random() * 5000),
        following_count: Math.floor(Math.random() * 1000),
        tweet_count: Math.floor(Math.random() * 2000),
        description: "Musician • Producer • Creating beautiful music"
      },
      recent_tweets: [
        {
          id: '1',
          text: '🎵 Just finished recording a new track! Can\'t wait to share it with you all. #NewMusic #Recording',
          created_at: new Date().toISOString(),
          public_metrics: {
            retweet_count: Math.floor(Math.random() * 50),
            like_count: Math.floor(Math.random() * 200),
            reply_count: Math.floor(Math.random() * 20),
            quote_count: Math.floor(Math.random() * 10)
          }
        },
        {
          id: '2',
          text: '🎸 Live performance tonight at 8 PM! Come join us for an amazing musical evening #LiveMusic #Performance',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          public_metrics: {
            retweet_count: Math.floor(Math.random() * 30),
            like_count: Math.floor(Math.random() * 150),
            reply_count: Math.floor(Math.random() * 15),
            quote_count: Math.floor(Math.random() * 5)
          }
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