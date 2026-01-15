import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Create Supabase client
const getSupabase = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
};

// ============================================
// AUTH ROUTES
// ============================================

// Sign up new admin
app.post('/make-server-c4cc4184/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    const supabase = getSupabase();
    
    // Create user with admin role
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role: 'admin' },
      email_confirm: true // Auto-confirm since we don't have email server configured
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log('Server error during signup:', error);
    return c.json({ error: 'Server error during signup' }, 500);
  }
});

// Check authentication
app.get('/make-server-c4cc4184/auth/user', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const supabase = getSupabase();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    return c.json({ user });
  } catch (error) {
    console.log('Auth check error:', error);
    return c.json({ error: 'Server error during auth check' }, 500);
  }
});

// ============================================
// EVENTS ROUTES
// ============================================

// Get all events
app.get('/make-server-c4cc4184/events', async (c) => {
  try {
    const events = await kv.getByPrefix('event:');
    return c.json({ events: events || [] });
  } catch (error) {
    console.log('Error fetching events:', error);
    return c.json({ error: 'Failed to fetch events' }, 500);
  }
});

// Create event (admin only)
app.post('/make-server-c4cc4184/events', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabase();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const event = await c.req.json();
    const eventId = `event:${Date.now()}`;
    
    await kv.set(eventId, {
      ...event,
      id: eventId,
      createdAt: new Date().toISOString(),
      createdBy: user.id
    });

    return c.json({ success: true, id: eventId });
  } catch (error) {
    console.log('Error creating event:', error);
    return c.json({ error: 'Failed to create event' }, 500);
  }
});

// Update event (admin only)
app.put('/make-server-c4cc4184/events/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabase();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const eventId = c.req.param('id');
    const updates = await c.req.json();
    
    const existing = await kv.get(eventId);
    if (!existing) {
      return c.json({ error: 'Event not found' }, 404);
    }

    await kv.set(eventId, {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id
    });

    return c.json({ success: true });
  } catch (error) {
    console.log('Error updating event:', error);
    return c.json({ error: 'Failed to update event' }, 500);
  }
});

// Delete event (admin only)
app.delete('/make-server-c4cc4184/events/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabase();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const eventId = c.req.param('id');
    await kv.del(eventId);

    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting event:', error);
    return c.json({ error: 'Failed to delete event' }, 500);
  }
});

// ============================================
// NEWS ROUTES
// ============================================

// Get all news
app.get('/make-server-c4cc4184/news', async (c) => {
  try {
    const news = await kv.getByPrefix('news:');
    return c.json({ news: news || [] });
  } catch (error) {
    console.log('Error fetching news:', error);
    return c.json({ error: 'Failed to fetch news' }, 500);
  }
});

// Create news (admin only)
app.post('/make-server-c4cc4184/news', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabase();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const article = await c.req.json();
    const newsId = `news:${Date.now()}`;
    
    await kv.set(newsId, {
      ...article,
      id: newsId,
      createdAt: new Date().toISOString(),
      createdBy: user.id
    });

    return c.json({ success: true, id: newsId });
  } catch (error) {
    console.log('Error creating news:', error);
    return c.json({ error: 'Failed to create news' }, 500);
  }
});

// Update news (admin only)
app.put('/make-server-c4cc4184/news/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabase();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const newsId = c.req.param('id');
    const updates = await c.req.json();
    
    const existing = await kv.get(newsId);
    if (!existing) {
      return c.json({ error: 'News not found' }, 404);
    }

    await kv.set(newsId, {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id
    });

    return c.json({ success: true });
  } catch (error) {
    console.log('Error updating news:', error);
    return c.json({ error: 'Failed to update news' }, 500);
  }
});

// Delete news (admin only)
app.delete('/make-server-c4cc4184/news/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabase();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const newsId = c.req.param('id');
    await kv.del(newsId);

    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting news:', error);
    return c.json({ error: 'Failed to delete news' }, 500);
  }
});

// ============================================
// MEDIA ROUTES
// ============================================

// Get all media items
app.get('/make-server-c4cc4184/media', async (c) => {
  try {
    const media = await kv.getByPrefix('media:');
    return c.json({ media: media || [] });
  } catch (error) {
    console.log('Error fetching media:', error);
    console.log('Error details:', error.message, error.stack);
    return c.json({ error: `Failed to fetch media: ${error.message}` }, 500);
  }
});

// Create media (admin only)
app.post('/make-server-c4cc4184/media', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabase();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const mediaItem = await c.req.json();
    const mediaId = `media:${Date.now()}`;
    
    await kv.set(mediaId, {
      ...mediaItem,
      id: mediaId,
      createdAt: new Date().toISOString(),
      createdBy: user.id
    });

    return c.json({ success: true, id: mediaId });
  } catch (error) {
    console.log('Error creating media:', error);
    return c.json({ error: 'Failed to create media' }, 500);
  }
});

// Update media (admin only)
app.put('/make-server-c4cc4184/media/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabase();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const mediaId = c.req.param('id');
    const updates = await c.req.json();
    
    const existing = await kv.get(mediaId);
    if (!existing) {
      return c.json({ error: 'Media not found' }, 404);
    }

    await kv.set(mediaId, {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id
    });

    return c.json({ success: true });
  } catch (error) {
    console.log('Error updating media:', error);
    return c.json({ error: 'Failed to update media' }, 500);
  }
});

// Delete media (admin only)
app.delete('/make-server-c4cc4184/media/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabase();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const mediaId = c.req.param('id');
    await kv.del(mediaId);

    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting media:', error);
    return c.json({ error: 'Failed to delete media' }, 500);
  }
});

// ============================================
// SETTINGS ROUTES
// ============================================

// Get settings
app.get('/make-server-c4cc4184/settings', async (c) => {
  try {
    const settings = await kv.get('settings');
    return c.json({ settings: settings || {} });
  } catch (error) {
    console.log('Error fetching settings:', error);
    console.log('Error details:', error.message, error.stack);
    return c.json({ error: `Failed to fetch settings: ${error.message}` }, 500);
  }
});

// Update settings (admin only)
app.put('/make-server-c4cc4184/settings', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabase();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const settings = await c.req.json();
    await kv.set('settings', {
      ...settings,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id
    });

    return c.json({ success: true });
  } catch (error) {
    console.log('Error updating settings:', error);
    return c.json({ error: 'Failed to update settings' }, 500);
  }
});

// ============================================
// TESTIMONIES ROUTES
// ============================================

// Get all testimonies
app.get('/make-server-c4cc4184/testimonies', async (c) => {
  try {
    const testimonies = await kv.getByPrefix('testimony:');
    return c.json({ testimonies: testimonies || [] });
  } catch (error) {
    console.log('Error fetching testimonies:', error);
    return c.json({ error: 'Failed to fetch testimonies' }, 500);
  }
});

// Create testimony (admin only)
app.post('/make-server-c4cc4184/testimonies', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabase();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const testimony = await c.req.json();
    const testimonyId = `testimony:${Date.now()}`;
    
    await kv.set(testimonyId, {
      ...testimony,
      id: testimonyId,
      created_at: new Date().toISOString(),
      createdBy: user.id
    });

    return c.json({ success: true, id: testimonyId });
  } catch (error) {
    console.log('Error creating testimony:', error);
    return c.json({ error: 'Failed to create testimony' }, 500);
  }
});

// Update testimony (admin only)
app.put('/make-server-c4cc4184/testimonies/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabase();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const testimonyId = c.req.param('id');
    const updates = await c.req.json();
    
    const existing = await kv.get(testimonyId);
    if (!existing) {
      return c.json({ error: 'Testimony not found' }, 404);
    }

    await kv.set(testimonyId, {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id
    });

    return c.json({ success: true });
  } catch (error) {
    console.log('Error updating testimony:', error);
    return c.json({ error: 'Failed to update testimony' }, 500);
  }
});

// Delete testimony (admin only)
app.delete('/make-server-c4cc4184/testimonies/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabase();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const testimonyId = c.req.param('id');
    await kv.del(testimonyId);

    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting testimony:', error);
    return c.json({ error: 'Failed to delete testimony' }, 500);
  }
});

// ============================================
// LEADERS ROUTES
// ============================================

// Get all leaders
app.get('/make-server-c4cc4184/leaders', async (c) => {
  try {
    const leaders = await kv.getByPrefix('leader:');
    return c.json({ leaders: leaders || [] });
  } catch (error) {
    console.log('Error fetching leaders:', error);
    return c.json({ error: 'Failed to fetch leaders' }, 500);
  }
});

// Create leader (admin only)
app.post('/make-server-c4cc4184/leaders', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabase();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const leader = await c.req.json();
    const leaderId = `leader:${Date.now()}`;
    
    await kv.set(leaderId, {
      ...leader,
      id: leaderId,
      created_at: new Date().toISOString(),
      createdBy: user.id
    });

    return c.json({ success: true, id: leaderId });
  } catch (error) {
    console.log('Error creating leader:', error);
    return c.json({ error: 'Failed to create leader' }, 500);
  }
});

// Update leader (admin only)
app.put('/make-server-c4cc4184/leaders/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabase();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const leaderId = c.req.param('id');
    const updates = await c.req.json();
    
    const existing = await kv.get(leaderId);
    if (!existing) {
      return c.json({ error: 'Leader not found' }, 404);
    }

    await kv.set(leaderId, {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id
    });

    return c.json({ success: true });
  } catch (error) {
    console.log('Error updating leader:', error);
    return c.json({ error: 'Failed to update leader' }, 500);
  }
});

// Delete leader (admin only)
app.delete('/make-server-c4cc4184/leaders/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabase();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const leaderId = c.req.param('id');
    await kv.del(leaderId);

    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting leader:', error);
    return c.json({ error: 'Failed to delete leader' }, 500);
  }
});

// ============================================
// FILE UPLOAD ROUTES
// ============================================

// Initialize storage bucket
const BUCKET_NAME = 'make-c4cc4184-uploads';

// Upload file (admin only)
app.post('/make-server-c4cc4184/upload', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabase();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    // Ensure bucket exists (idempotent operation)
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
      
      if (!bucketExists) {
        await supabase.storage.createBucket(BUCKET_NAME, {
          public: false,
          fileSizeLimit: 10485760 // 10MB
        });
        console.log(`Created storage bucket: ${BUCKET_NAME}`);
      }
    } catch (bucketError) {
      console.log('Bucket initialization error (continuing):', bucketError);
      // Continue anyway - bucket might already exist
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Convert File to ArrayBuffer then to Uint8Array
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, uint8Array, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.log('Upload error:', uploadError);
      return c.json({ error: uploadError.message }, 500);
    }

    // Get signed URL (valid for 10 years)
    const { data: urlData } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, 315360000); // 10 years in seconds

    if (!urlData?.signedUrl) {
      return c.json({ error: 'Failed to generate URL' }, 500);
    }

    return c.json({ 
      success: true, 
      url: urlData.signedUrl,
      path: filePath 
    });
  } catch (error) {
    console.log('Server error during file upload:', error);
    return c.json({ error: 'Server error during file upload' }, 500);
  }
});

// Health check
app.get('/make-server-c4cc4184/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);