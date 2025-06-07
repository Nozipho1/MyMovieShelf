import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
const PORT= process.env.PORT || 5000;
const OMDB_KEY= process.env.OMDB_API_KEY;
const SUPABASE_URL= process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY= process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY= process.env.SUPABASE_SERVICE_ROLE_KEY;


const supabase    = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const app = express();
app.use(cors());
app.use(express.json());


app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  if (error) return res.status(400).json({ error: error.message });
 
  res.status(201).json({ user: data.user });
});


app.post('/api/auth/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) return res.status(401).json({ error: error.message });
 
  res.json({
    user: data.user,
    access_token: data.session?.access_token,
    refresh_token: data.session?.refresh_token
  });
});


async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const token = header.split(' ')[1];
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  req.user = user;
  next();
}



app.get('/api/search', async (req, res) => {
  const title = req.query.title;
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'title query param required' });
  }
  try {
    const omdb = await fetch(`http://www.omdbapi.com/?apikey=${OMDB_KEY}&s=${encodeURIComponent(title)}`);
    const data = await omdb.json();
    if (data.Response === 'False') {
      return res.status(404).json({ error: data.Error });
    }
    res.json(data.Search);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OMDb fetch failed' });
  }
});


app.get('/api/watchlist', authenticate, async (req, res) => {
  const userId = req.user.id;
  const { data, error } = await supabaseAdmin
    .from('watchlist')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});


app.post('/api/watchlist', authenticate, async (req, res) => {
    const userId = req.user.id;
    console.log("User ID:", userId);
    console.log("Request body:", req.body);
    const { imdb_id, title, year, poster } = req.body;
  
    if (!imdb_id || !title) {
      return res.status(400).json({ error: 'imdb_id and title required' });
    }
  
    const { data, error } = await supabaseAdmin
      .from('watchlist')
      .insert([
        { user_id: userId, imdb_id, title, year, poster }
      ])
      .select('*') 
      .single();
  
    if (error) {
      console.error(" Supabase insert error:", error);
      return res.status(500).json({ error: error.message });
    }
  
    console.log(" Inserted watchlist row:", data);
    return res.status(201).json(data);
  });
  
  

app.patch('/api/watchlist/:id', authenticate, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const updates = req.body;
  const { data, error } = await supabaseAdmin
    .from('watchlist')
    .update(updates)
    .match({ id, user_id: userId })
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});


app.delete('/api/watchlist/:id', authenticate, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { error } = await supabaseAdmin
    .from('watchlist')
    .delete()
    .match({ id, user_id: userId });
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).end();
});



app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});



app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
