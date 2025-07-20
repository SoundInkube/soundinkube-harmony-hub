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
    const { channelId, username } = await req.json()

    // Input validation and sanitization
    if (!channelId && !username) {
      throw new Error('Channel ID or username is required')
    }

    // Validate and sanitize inputs
    if (channelId) {
      const sanitizedChannelId = channelId.replace(/[^a-zA-Z0-9_-]/g, '')
      if (sanitizedChannelId !== channelId || channelId.length > 50) {
        throw new Error('Invalid channel ID format')
      }
    }

    if (username) {
      const sanitizedUsername = username.replace(/[^a-zA-Z0-9_-]/g, '')
      if (sanitizedUsername !== username || username.length > 30) {
        throw new Error('Invalid username format')
      }
    }

    // For now, return mock data since we need YouTube API setup
    const mockData = {
      channel: {
        id: channelId || username,
        title: "Music Professional Channel",
        subscriber_count: Math.floor(Math.random() * 50000),
        video_count: Math.floor(Math.random() * 200),
        view_count: Math.floor(Math.random() * 1000000),
        description: "Creating and sharing beautiful music with the world"
      },
      recent_videos: [
        {
          id: '1',
          title: '🎵 New Original Composition - "Moonlight Serenade"',
          description: 'My latest original composition inspired by peaceful moonlit nights',
          thumbnail: 'https://picsum.photos/480/360?random=3',
          published_at: new Date().toISOString(),
          view_count: Math.floor(Math.random() * 10000),
          like_count: Math.floor(Math.random() * 500),
          comment_count: Math.floor(Math.random() * 50),
          duration: 'PT4M32S'
        },
        {
          id: '2',
          title: '🎸 Guitar Tutorial - Advanced Fingerpicking Techniques',
          description: 'Learn advanced fingerpicking techniques to elevate your guitar playing',
          thumbnail: 'https://picsum.photos/480/360?random=4',
          published_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          view_count: Math.floor(Math.random() * 15000),
          like_count: Math.floor(Math.random() * 800),
          comment_count: Math.floor(Math.random() * 120),
          duration: 'PT12M45S'
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