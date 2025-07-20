import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Play, 
  Eye,
  ThumbsUp,
  Instagram,
  Twitter,
  Youtube,
  ExternalLink
} from 'lucide-react';

interface SocialMediaFeedProps {
  platform: string;
  username?: string;
  channelId?: string;
}

export function SocialMediaFeed({ platform, username, channelId }: SocialMediaFeedProps) {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSocialContent();
  }, [platform, username, channelId]);

  const fetchSocialContent = async () => {
    try {
      setLoading(true);
      setError(null);

      let endpoint = '';
      let payload = {};

      switch (platform) {
        case 'instagram':
          endpoint = 'fetch-instagram-content';
          payload = { username };
          break;
        case 'twitter':
          endpoint = 'fetch-twitter-content';
          payload = { username };
          break;
        case 'youtube':
          endpoint = 'fetch-youtube-content';
          payload = { channelId, username };
          break;
        default:
          throw new Error(`Platform ${platform} not supported`);
      }

      const { data, error: functionError } = await supabase.functions.invoke(endpoint, {
        body: payload
      });

      if (functionError) throw functionError;
      setContent(data);
    } catch (err: any) {
      console.error('Error fetching social content:', err);
      setError(err.message || 'Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '';
    
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="animate-pulse flex space-x-3">
          <div className="rounded-lg bg-muted h-16 w-16"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground mb-2">Unable to load content</p>
        <Button variant="outline" size="sm" onClick={fetchSocialContent}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="space-y-4">
      {/* Platform Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {platform === 'instagram' && <Instagram className="h-4 w-4 text-pink-500" />}
          {platform === 'twitter' && <Twitter className="h-4 w-4 text-blue-500" />}
          {platform === 'youtube' && <Youtube className="h-4 w-4 text-red-500" />}
          <span className="text-sm font-medium">@{username || channelId}</span>
        </div>
        <div className="flex gap-3 text-xs text-muted-foreground">
          {platform === 'instagram' && content.user && (
            <>
              <span>{formatNumber(content.user.followers_count)} followers</span>
              <span>{formatNumber(content.user.media_count)} posts</span>
            </>
          )}
          {platform === 'twitter' && content.user && (
            <>
              <span>{formatNumber(content.user.followers_count)} followers</span>
              <span>{formatNumber(content.user.tweet_count)} tweets</span>
            </>
          )}
          {platform === 'youtube' && content.channel && (
            <>
              <span>{formatNumber(content.channel.subscriber_count)} subscribers</span>
              <span>{formatNumber(content.channel.video_count)} videos</span>
            </>
          )}
        </div>
      </div>

      {/* Recent Content */}
      <div className="space-y-3">
        {platform === 'instagram' && content.recent_posts?.map((post: any) => (
          <Card key={post.id} className="p-3">
            <div className="flex gap-3">
              <img 
                src={post.media_url} 
                alt="Instagram post" 
                className="w-12 h-12 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground line-clamp-2 mb-2">
                  {post.caption}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {formatNumber(post.like_count)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {formatNumber(post.comments_count)}
                  </span>
                  <span>{new Date(post.timestamp).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {platform === 'twitter' && content.recent_tweets?.map((tweet: any) => (
          <Card key={tweet.id} className="p-3">
            <div className="space-y-2">
              <p className="text-sm text-foreground">{tweet.text}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {formatNumber(tweet.public_metrics.like_count)}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  {formatNumber(tweet.public_metrics.reply_count)}
                </span>
                <span className="flex items-center gap-1">
                  <Share className="h-3 w-3" />
                  {formatNumber(tweet.public_metrics.retweet_count)}
                </span>
                <span>{new Date(tweet.created_at).toLocaleDateString('en-IN')}</span>
              </div>
            </div>
          </Card>
        ))}

        {platform === 'youtube' && content.recent_videos?.map((video: any) => (
          <Card key={video.id} className="p-3">
            <div className="flex gap-3">
              <div className="relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-20 h-12 rounded object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="h-4 w-4 text-white drop-shadow-lg" />
                </div>
                <Badge variant="secondary" className="absolute bottom-1 right-1 text-xs px-1 py-0">
                  {formatDuration(video.duration)}
                </Badge>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium line-clamp-2 mb-1">
                  {video.title}
                </h4>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {formatNumber(video.view_count)}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3" />
                    {formatNumber(video.like_count)}
                  </span>
                  <span>{new Date(video.published_at).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <div className="pt-2 border-t">
        <p className="text-xs text-muted-foreground text-center">
          Want to see real-time content? Connect your {platform} API in settings
        </p>
      </div>
    </div>
  );
}